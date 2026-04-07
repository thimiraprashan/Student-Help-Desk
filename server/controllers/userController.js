import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import User from "../models/User.js"
import stripe from "stripe"
import { clerkClient } from '@clerk/express'



// Get User Data
export const getUserData = async (req, res) => {
    try {

        const userId = req.auth.userId

        let user = await User.findById(userId)

        if (!user) {
            const clerkUser = await clerkClient.users.getUser(userId)
            if (clerkUser) {
                const email = clerkUser.emailAddresses[0].emailAddress;
                if (!email.endsWith('@sliit.lk') && !email.endsWith('@my.sliit.lk')) {
                    return res.json({ success: false, message: 'Only SLIIT emails are allowed to access this system.' })
                }
                user = new User({
                    _id: userId,
                    name: clerkUser.firstName + ' ' + clerkUser.lastName,
                    email,
                    imageUrl: clerkUser.imageUrl,
                    enrolledCourses: []
                })
                await user.save()
            } else {
                return res.json({ success: false, message: 'User Not Found' })
            }
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Purchase Course 
export const purchaseCourse = async (req, res) => {

    try {

        const { courseId } = req.body
        const { origin } = req.headers


        const userId = req.auth.userId

        const courseData = await Course.findById(courseId)
        const userData = await User.findById(userId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' })
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        if (Math.floor(newPurchase.amount) === 0) {
            newPurchase.status = 'completed';
            await newPurchase.save();
            
            // Immediately add to user and course
            if (!courseData.enrolledStudents.some(id => id.toString() === userData._id.toString())) {
                courseData.enrolledStudents.push(userData._id);
                await courseData.save();
            }

            if (!userData.enrolledCourses.some(id => id.toString() === courseData._id.toString())) {
                userData.enrolledCourses.push(courseData._id);
                await userData.save();
            }
            
            return res.json({ success: true, message: 'Enrolled in free course successfully!', session_url: null, freeEnrollment: true });
        }

        // Stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        // Creating line items to for Stripe
        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/`,
            line_items: line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString()
            }
        })

        res.json({ success: true, session_url: session.url });


    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get Single Course Purchase Data
export const getUserPurchase = async (req, res) => {
    try {
        const userId = req.auth.userId
        const { courseId } = req.body
        const purchaseData = await Purchase.findOne({ courseId, userId }).sort({ createdAt: -1 })
        res.json({ success: true, purchaseData })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Verify Stripe Manual Verification
export const verifyStripePurchase = async (req, res) => {
    try {
        const { sessionId } = req.body;
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { purchaseId } = session.metadata;
            const purchaseData = await Purchase.findById(purchaseId);
            
            if (purchaseData.status === 'pending') {
                const userData = await User.findById(purchaseData.userId);
                const courseData = await Course.findById(purchaseData.courseId.toString());

                if (!courseData.enrolledStudents.some(id => id.toString() === userData._id.toString())) {
                    courseData.enrolledStudents.push(userData._id);
                    await courseData.save();
                }

                if (!userData.enrolledCourses.some(id => id.toString() === courseData._id.toString())) {
                    userData.enrolledCourses.push(courseData._id);
                    await userData.save();
                }

                purchaseData.status = 'completed';
                await purchaseData.save();
            }
            return res.json({ success: true, message: 'Payment verified sync' });
        }
        res.json({ success: false, message: 'Payment failed sync' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {

    try {

        const userId = req.auth.userId

        const userData = await User.findById(userId)
            .populate('enrolledCourses')

        // De-duplicate in case of corrupted array
        const uniqueCourses = [];
        const seenIds = new Set();
        for (const course of userData.enrolledCourses) {
            if (course && !seenIds.has(course._id.toString())) {
                uniqueCourses.push(course);
                seenIds.add(course._id.toString());
            }
        }

        res.json({ success: true, enrolledCourses: uniqueCourses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {

            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        } else {

            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })

        }

        res.json({ success: true, message: 'Progress Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {

    try {

        const userId = req.auth.userId

        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })
        const purchaseData = await Purchase.findOne({ userId, courseId, status: 'completed' }).sort({ createdAt: -1 })

        res.json({ success: true, progressData, purchaseData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {

    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'InValid Details' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};