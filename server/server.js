import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { ObjectId } from "mongodb";
import { clerkMiddleware } from '@clerk/express';

// Top Part Routes
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

// Initialize Express
const app = express();

// ✅ middleware
app.use(cors());
app.use(clerkMiddleware());

// ✅ Webhook routes (MUST be before express.json() to allow raw parsing for stripe)
app.post('/clerk', express.json(), clerkWebhooks);
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

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

const PORT = process.env.PORT || 5000;

try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected:", process.env.MONGODB_URI);

    // Connect Cloudinary (for educator image uploads)
    await connectCloudinary();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });

} catch (err) {
    console.log("❌ Server Startup Error:", err);
}
