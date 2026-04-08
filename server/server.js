import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { ObjectId } from "mongodb";

import router from "./Routes/CStudentRoutes.js";
import studentAuthRoutes from "./Routes/CStudentAuthRoutes.js";
import companyRoutes from "./Routes/CCompanyRoutes.js";
import messageRoutes from "./Routes/CSMessageRoutes.js";
import cvRoutes from "./Routes/CStudentCVRoutes.js";
import companyProfileRoutes from "./Routes/CCompanyProfileRoutes.js";
import companyAuthRoutes from "./Routes/CCompanyAuthRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

// 🔥 load env
dotenv.config();

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ static folder (CV view)
app.use("/uploads", express.static("uploads"));

// ✅ routes
app.use("/students", router);
app.use("/students", studentAuthRoutes);
app.use("/companies", companyRoutes);
app.use("/messages", messageRoutes);
app.use("/api/cv", cvRoutes);
app.use("/company-profile", companyProfileRoutes);
app.use("/company-auth", companyAuthRoutes);
app.use("/api/upload", uploadRoutes);

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
    const { status } = req.body;

    const application = await db.collection("applications").findOne({
      _id: new ObjectId(appId)
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    await db.collection("applications").updateOne(
      { _id: new ObjectId(appId) },
      { $set: { status } }
    );

    if (application.status !== status) {

      let message = "";

      if (status === "Accepted") {
        message = `🎉 You have been accepted for ${application.title}!`;
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

    res.json({ message: "Updated successfully + notification sent" });

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
    const userId = Number(req.params.userId);

    const data = await db.collection("notifications").find({
      toUserId: userId
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

// ✅ DB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });

  })
  .catch((err) => console.log("❌ DB ERROR:", err));
