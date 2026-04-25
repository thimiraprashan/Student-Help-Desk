import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'
import EducatorApplication from '../models/EducatorApplication.js';
import mongoose from 'mongoose';

// update role to educator
export const updateRoleToEducator = async (req, res) => {

    try {

        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add New Course
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = JSON.parse(courseData)

        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {

        const educator = req.auth.userId

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl email');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl email').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases
            .filter(purchase => purchase.userId && purchase.courseId)
            .map(purchase => ({
                student: purchase.userId,
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt
            }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

// Get Educator Course by ID
export const getEducatorCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const educatorId = req.auth.userId;

        const course = await Course.findById(id);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }
        if (course.educator.toString() !== educatorId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        res.json({ success: true, course });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Edit Course
export const editCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth.userId;

        const course = await Course.findById(id);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }
        if (course.educator.toString() !== educatorId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        const parsedCourseData = JSON.parse(courseData);

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path);
            parsedCourseData.courseThumbnail = imageUpload.secure_url;
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, parsedCourseData, { new: true });

        if (!updatedCourse) {
            return res.json({ success: false, message: 'Course not found during update' });
        }

        res.json({ success: true, message: 'Course Updated' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const educatorId = req.auth.userId;

        const course = await Course.findById(id);
        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }
        if (course.educator.toString() !== educatorId.toString()) {
            return res.json({ success: false, message: 'Unauthorized' });
        }

        await Course.findByIdAndDelete(id);

        res.json({ success: true, message: 'Course Deleted' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- Educator Application Logic ---

// Submit Educator Application
export const submitEducatorApplication = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const applicationData = req.body;

        const existingApplication = await EducatorApplication.findOne({ userId, status: 'Pending' });
        if (existingApplication) {
            return res.json({ success: false, message: 'You already have a pending application' });
        }

        const application = new EducatorApplication({
            ...applicationData,
            userId
        });

        await application.save();

        res.json({ success: true, message: 'Application submitted successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Educator Applications (Admin Only)
export const getEducatorApplications = async (req, res) => {
    try {
        const applications = await EducatorApplication.find().sort({ createdAt: -1 });
        res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Application Status (Approve/Reject)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, rejectionReason } = req.body;

        const application = await EducatorApplication.findById(id);
        if (!application) {
            return res.json({ success: false, message: 'Application not found' });
        }

        application.status = status;
        if (status === 'Rejected') {
            application.rejectionReason = rejectionReason || '';
        }
        await application.save();

        // If approved, update Clerk role
        if (status === 'Approved') {
            await clerkClient.users.updateUserMetadata(application.userId, {
                publicMetadata: {
                    role: 'educator',
                },
            });
        }

        // Send notification to student
        const db = mongoose.connection.db;
        let message = '';
        if (status === 'Approved') {
            message = `🎉 Congratulations! Your application to become an educator has been approved. You now have access to the Educator Dashboard.`;
        } else {
            message = `❌ Your application to become an educator was rejected. Reason: ${rejectionReason || 'No reason provided.'}`;
        }

        await db.collection("notifications").insertOne({
            toUserId: application.userId, // Clerk IDs are strings, but the notification component uses Number comparison sometimes? 
            // Wait, studentId in server.js was Number(req.body.studentId). 
            // But Clerk IDs are like 'user_...'.
            // I'll store it as is.
            message,
            date: new Date().toISOString(),
            read: false,
            type: "educator_application",
            status: status
        });

        res.json({ success: true, message: `Application ${status}` });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin Login (Mock for Dept Head)
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (email === 'admin@123' && password === '1234') {
        res.json({ success: true, role: 'admin', token: 'mock-admin-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};
