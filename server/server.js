import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ObjectId } from "mongodb";

import router from "./Routes/CStudentRoutes.js";
import companyRoutes from "./Routes/CCompanyRoutes.js";
import messageRoutes from "./Routes/CSMessageRoutes.js";
import cvRoutes from "./Routes/CStudentCVRoutes.js";
import companyProfileRoutes from "./Routes/CCompanyProfileRoutes.js";
import uploadRoutes from "./Routes/uploadRoutes.js";

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ static folder (CV view)
app.use("/uploads", express.static("uploads"));

// ✅ existing routes
app.use("/students", router);
app.use("/companies", companyRoutes);
app.use("/messages", messageRoutes);
app.use("/api/cv", cvRoutes);
app.use("/company-profile", companyProfileRoutes);
app.use("/api/upload", uploadRoutes);

// =======================================
// 🔥 APPLICATION ROUTES
// =======================================

// ✅ CREATE APPLICATION
app.post("/applications", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const data = {
      ...req.body,
      studentId: Number(req.body.studentId),
      companyId: Number(req.body.companyId)
    };

    const result = await db.collection("applications").insertOne(data);

    res.json(result);
  } catch (err) {
    console.log("CREATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL APPLICATIONS
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

// ✅ UPDATE STATUS + SEND NOTIFICATION
app.put("/applications/:id", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const appId = req.params.id;
    const { status } = req.body;

    console.log("👉 UPDATE STATUS:", status);

    const application = await db.collection("applications").findOne({
      _id: new ObjectId(appId)
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // 🔥 update status
    await db.collection("applications").updateOne(
      { _id: new ObjectId(appId) },
      { $set: { status } }
    );

    // 🔥 notification create (ALL STATUS)
    if (application.status !== status) {

      console.log("🔥 STATUS CHANGED → creating notification");

      let message = "";

      if (status === "Accepted") {
        message = `🎉 You have been accepted for ${application.title}!`;
      } else if (status === "Rejected") {
        message = `❌ Your application for ${application.title} was rejected`;
      } else if (status === "Shortlisted") {
        message = `⭐ You have been shortlisted for ${application.title}`;
      } else {
        message = `ℹ️ Your application for ${application.title} status updated to ${status}`;
      }

      await db.collection("notifications").insertOne({
        toUserId: Number(application.studentId),
        message: message,
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
// 🔔 NOTIFICATION ROUTES
// =======================================

// ✅ GET ALL
app.get("/notifications", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const data = await db.collection("notifications").find().toArray();

    res.json(data);
  } catch (err) {
    console.log("NOTIF GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET BY USER
app.get("/notifications/:userId", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    const userId = Number(req.params.userId);

    const data = await db.collection("notifications").find({
      toUserId: userId
    }).toArray();

    res.json(data);
  } catch (err) {
    console.log("NOTIF USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ MARK READ
app.put("/notifications/:id/read", async (req, res) => {
  try {
    const db = mongoose.connection.db;

    await db.collection("notifications").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { read: true } }
    );

    res.json({ message: "Notification marked as read" });
  } catch (err) {
    console.log("READ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =======================================

// ✅ connect DB
mongoose.connect("mongodb+srv://admin1:LYHUgp1Ch6JuduaC@cluster0.jm7s1hy.mongodb.net/")
  .then(() => {
    console.log("✅ Connected to MongoDB");

    app.listen(5000, () => {
      console.log("🚀 Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));