import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'

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
        const enrolledStudents = purchases.map(purchase => ({
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
