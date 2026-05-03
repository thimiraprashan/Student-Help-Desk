import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ObjectId } from "mongodb";
import { clerkMiddleware } from '@clerk/express';

// Top Part Routes
import startReminderScheduler from "./utils/reminderScheduler.js";
import router from "./routes/CStudentRoutes.js";
import studentAuthRoutes from "./routes/CStudentAuthRoutes.js";
import companyRoutes from "./routes/CCompanyRoutes.js";
import messageRoutes from "./routes/CSMessageRoutes.js";
import cvRoutes from "./routes/CStudentCVRoutes.js";
import companyProfileRoutes from "./routes/CCompanyProfileRoutes.js";
import companyAuthRoutes from "./routes/CCompanyAuthRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Educator Part Imports
import connectCloudinary from './configs/cloudinary.js';
import userRouter from './routes/userRoutes.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import courseRouter from './routes/courseRoute.js';
import eventRoutes from "./routes/eventRoutes.js";
import sportRoutes from "./routes/sportRoutes.js";
import clubRoutes from "./routes/clubRoutes.js";
import activityNotificationRoutes from "./routes/notificationRoutes.js";
import feedbackRoutes from "./routes/FeedbackRoutes.js";
import studyGuideRoutes from "./routes/studyGuideRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const DEFAULT_PORT = 5000;
const DEFAULT_HOST = "127.0.0.1";

const hasRealEnvValue = (value) =>
    typeof value === "string" &&
    value.trim() !== "" &&
    !value.includes("-----");

const getConfiguredPort = (value) => {
    if (typeof value !== "string") {
        return DEFAULT_PORT;
    }

    const trimmedValue = value.trim();

    if (!/^\d+$/.test(trimmedValue)) {
        return DEFAULT_PORT;
    }

    const parsedPort = Number.parseInt(trimmedValue, 10);

    if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
        return DEFAULT_PORT;
    }

    return parsedPort;
};

const HOST = hasRealEnvValue(process.env.HOST)
    ? process.env.HOST.trim()
    : DEFAULT_HOST;
const PORT = getConfiguredPort(process.env.PORT);

const logServerStartupError = (err) => {
    if (err?.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use. Update PORT in server/.env or stop the process using that port.`);
        return;
    }

    if (err?.code === "EACCES") {
        console.log(`Cannot listen on ${HOST}:${PORT}. Update HOST or PORT in server/.env and try again.`);
        return;
    }

    console.log("Uncaught server error:", err);
};

process.on("uncaughtException", (err) => {
    logServerStartupError(err);
    process.exit(1);
});

// Initialize Express
const app = express();

const isClerkConfigured =
    hasRealEnvValue(process.env.CLERK_SECRET_KEY) &&
    hasRealEnvValue(process.env.CLERK_PUBLISHABLE_KEY) &&
    hasRealEnvValue(process.env.CLERK_WEBHOOK_SECRET);

const isStripeConfigured =
    hasRealEnvValue(process.env.STRIPE_SECRET_KEY) &&
    hasRealEnvValue(process.env.STRIPE_WEBHOOK_SECRET);

const getLocalDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const deleteExpiredAcceptedApplications = async (db) => {
    const today = getLocalDateString();

    const result = await db.collection("applications").deleteMany({
        status: "Accepted",
        interviewDate: { $exists: true, $ne: "", $lt: today }
    });

    if (result.deletedCount > 0) {
        console.log(`Deleted ${result.deletedCount} expired accepted application(s).`);
    }
};

// ✅ middleware
app.use(cors());
if (isClerkConfigured) {
    app.use(clerkMiddleware());
} else {
    console.log("Clerk is not configured. Skipping Clerk middleware.");
}

// ✅ Webhook routes (MUST be before express.json() to allow raw parsing for stripe)
if (isClerkConfigured) {
    app.post('/clerk', express.json(), clerkWebhooks);
}

if (isStripeConfigured) {
    app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);
} else {
    console.log("Stripe is not configured. Skipping Stripe webhook route.");
}

// Now apply express.json() for all subsequent routes
app.use(express.json());

// ✅ static folder (CV view)
app.use("/uploads", express.static("uploads"));

// ✅ Top part routes
app.use("/students", router);
app.use("/students", studentAuthRoutes);
app.use("/companies", companyRoutes);
app.use("/messages", messageRoutes);
app.use("/api/cv", cvRoutes);
app.use("/company-profile", companyProfileRoutes);
app.use("/company-auth", companyAuthRoutes);
app.use("/api/upload", uploadRoutes);

// ✅ Bottom part routes
app.get('/', (req, res) => res.send("API Working"));
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use('/api/user', express.json(), userRouter);
app.use("/api/events", eventRoutes);
app.use("/api/sports", sportRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/notifications", activityNotificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/study-guide", studyGuideRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/ai", aiRoutes);

// =======================================
// 🔥 APPLICATION ROUTES
// =======================================

// CREATE APPLICATION
app.post("/applications", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const data = {
            ...req.body,
            studentId: Number(req.body.studentId),
            companyId: Number(req.body.companyId)
        };

        const result = await db.collection("applications").insertOne(data);
        res.json({
            _id: result.insertedId,
            ...data,
        });

    } catch (err) {
        console.log("CREATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// GET ALL APPLICATIONS
app.get("/applications", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        await deleteExpiredAcceptedApplications(db);

        const data = await db.collection("applications").find().toArray();
        res.json(data);

    } catch (err) {
        console.log("GET ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// UPDATE APPLICATION + NOTIFICATION
app.put("/applications/:id", async (req, res) => {
    try {
        const db = mongoose.connection.db;

        const appId = req.params.id;
        const { status, interviewDate, interviewTime, interviewHall } = req.body;

        const application = await db.collection("applications").findOne({
            _id: new ObjectId(appId)
        });

        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        if (status === "Accepted") {
            const hall = typeof interviewHall === "string" ? interviewHall.trim() : "";

            if (!interviewDate || !interviewTime || !hall) {
                return res.status(400).json({ error: "Interview date, time, and hall are required" });
            }

            if (interviewDate < getLocalDateString()) {
                return res.status(400).json({ error: "Interview date cannot be in the past" });
            }

            if (hall.length < 3) {
                return res.status(400).json({ error: "Interview hall must be at least 3 characters" });
            }
        }

        const updateDoc = {
            $set: { status }
        };

        if (status === "Accepted") {
            updateDoc.$set.interviewDate = interviewDate || "";
            updateDoc.$set.interviewTime = interviewTime || "";
            updateDoc.$set.interviewHall = interviewHall.trim();
        } else {
            updateDoc.$unset = {
                interviewDate: "",
                interviewTime: "",
                interviewHall: ""
            };
        }

        await db.collection("applications").updateOne(
            { _id: new ObjectId(appId) },
            updateDoc
        );

        const updatedApplication = await db.collection("applications").findOne({
            _id: new ObjectId(appId)
        });

        if (application.status !== status) {

            let message = "";

            if (status === "Accepted") {
                message = `🎉 You have been accepted for ${application.title}!`;
                const interviewDetails = [
                    interviewDate ? `Date: ${interviewDate}` : "",
                    interviewTime ? `Time: ${interviewTime}` : "",
                    interviewHall ? `Hall: ${interviewHall}` : ""
                ].filter(Boolean).join(" | ");

                message = `Accepted for ${application.title}!${interviewDetails ? ` Interview - ${interviewDetails}` : ""}`;
            } else if (status === "Rejected") {
                message = `❌ Your application for ${application.title} was rejected`;
            } else if (status === "Shortlisted") {
                message = `⭐ You have been shortlisted for ${application.title}`;
            } else {
                message = `ℹ️ Status updated to ${status}`;
            }

            await db.collection("notifications").insertOne({
                toUserId: Number(application.studentId),
                message,
                date: new Date().toISOString(),
                read: false,
                type: "application_status",
                relatedApplicationId: appId
            });
        }

        res.json({
            message: "Updated successfully + notification sent",
            application: updatedApplication
        });

    } catch (err) {
        console.log("UPDATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// =======================================
// 🔔 NOTIFICATIONS
// =======================================

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
        const userId = req.params.userId;

        // Try to find notifications where toUserId matches as a string or as a number
        const data = await db.collection("notifications").find({
            $or: [
                { toUserId: userId },
                { toUserId: Number(userId) }
            ]
        }).toArray();

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
            { _id: new ObjectId(req.params.id) },
            { $set: { read: true } }
        );

        res.json({ message: "Marked as read" });

    } catch (err) {
        console.log("READ ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// =======================================

try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected:", process.env.MONGODB_URI);

    // Connect Cloudinary (for educator image uploads)
    await connectCloudinary();
    
    startReminderScheduler();

    const cleanupExpiredApplications = async () => {
        try {
            await deleteExpiredAcceptedApplications(mongoose.connection.db);
        } catch (err) {
            console.log("Expired application cleanup error:", err.message);
        }
    };

    await cleanupExpiredApplications();
    setInterval(cleanupExpiredApplications, 60 * 60 * 1000);

    const server = app.listen(PORT, HOST, () => {
        console.log(`🚀 Server running at http://${HOST}:${PORT}`);
    });
    server.on("error", (err) => {
        logServerStartupError(err);
        process.exit(1);
    });

} catch (err) {
    console.log("❌ Server Startup Error:", err);
}
