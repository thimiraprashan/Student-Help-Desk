import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";
import connectCloudinary from "./configs/cloudinary.js";
import startReminderScheduler from "./utils/reminderScheduler.js";
import { clerkWebhooks, stripeWebhooks } from "./controllers/webhooks.js";

import eventRoutes from "./routes/eventRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import studentRoutes from "./routes/CStudentRoutes.js";
import studentAuthRoutes from "./routes/CStudentAuthRoutes.js";
import companyRoutes from "./routes/CCompanyRoutes.js";
import messageRoutes from "./routes/CSMessageRoutes.js";
import cvRoutes from "./routes/CStudentCVRoutes.js";
import companyProfileRoutes from "./routes/CCompanyProfileRoutes.js";
import companyAuthRoutes from "./routes/CCompanyAuthRoutes.js";

import educatorRouter from "./routes/educatorRoutes.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const hasClerkKeys =
  Boolean(process.env.CLERK_PUBLISHABLE_KEY) &&
  Boolean(process.env.CLERK_SECRET_KEY);

app.use(cors());
if (hasClerkKeys) {
  app.use(clerkMiddleware());
} else {
  console.warn("[Startup] Clerk keys missing. Clerk auth middleware disabled.");
}

// Webhooks need to be registered before the global JSON parser.
if (process.env.CLERK_WEBHOOK_SECRET) {
  app.post("/clerk", express.json(), clerkWebhooks);
} else {
  console.warn("[Startup] CLERK_WEBHOOK_SECRET missing. /clerk webhook disabled.");
}
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.use(express.json());

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Event management routes
app.use("/api/events", eventRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);

// Student/company routes
app.use("/students", studentRoutes);
app.use("/students", studentAuthRoutes);
app.use("/companies", companyRoutes);
app.use("/messages", messageRoutes);
app.use("/api/cv", cvRoutes);
app.use("/company-profile", companyProfileRoutes);
app.use("/company-auth", companyAuthRoutes);

// Educator routes
app.use("/api/educator", educatorRouter);
app.use("/api/course", courseRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Create application
app.post("/applications", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const data = {
      ...req.body,
      studentId: Number(req.body.studentId),
      companyId: Number(req.body.companyId),
    };

    const result = await db.collection("applications").insertOne(data);
    res.json({ _id: result.insertedId, ...data });
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all applications
app.get("/applications", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const data = await db.collection("applications").find().toArray();
    res.json(data);
  } catch (err) {
    console.log("GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update application + notification
app.put("/applications/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const appId = req.params.id;
    const { status } = req.body;

    const application = await db.collection("applications").findOne({
      _id: new mongoose.Types.ObjectId(appId),
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    await db.collection("applications").updateOne(
      { _id: new mongoose.Types.ObjectId(appId) },
      { $set: { status } }
    );

    if (application.status !== status) {
      let message = "";

      if (status === "Accepted") {
        message = `You have been accepted for ${application.title}!`;
      } else if (status === "Rejected") {
        message = `Your application for ${application.title} was rejected`;
      } else if (status === "Shortlisted") {
        message = `You have been shortlisted for ${application.title}`;
      } else {
        message = `Status updated to ${status}`;
      }

      await db.collection("notifications").insertOne({
        toUserId: Number(application.studentId),
        message,
        date: new Date().toISOString(),
        read: false,
        type: "application_status",
        relatedApplicationId: appId,
      });
    }

    res.json({ message: "Updated successfully + notification sent" });
  } catch (err) {
    console.log("UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/notifications", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const data = await db.collection("notifications").find().toArray();
    res.json(data);
  } catch (err) {
    console.log("NOTIF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/notifications/:userId", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const userId = Number(req.params.userId);
    const data = await db.collection("notifications").find({ toUserId: userId }).toArray();
    res.json(data);
  } catch (err) {
    console.log("USER NOTIF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/notifications/:id/read", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    await db.collection("notifications").updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { $set: { read: true } }
    );

    res.json({ message: "Marked as read" });
  } catch (err) {
    console.log("READ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startListening = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const fallbackPort = port + 1;
      console.warn(`[Startup] Port ${port} is in use. Retrying on ${fallbackPort}...`);
      startListening(fallbackPort);
      return;
    }

    console.error("Server listen error:", err);
    process.exit(1);
  });
};

const startServer = async () => {
  try {
    const dbConnected = await connectDB();
    await connectCloudinary();

    if (dbConnected) {
      startReminderScheduler();
    } else {
      console.warn("[Startup] Server started without DB connection. DB-backed features are unavailable.");
    }

    startListening(DEFAULT_PORT);
  } catch (err) {
    console.log("Server Startup Error:", err);
    process.exit(1);
  }
};

startServer();
