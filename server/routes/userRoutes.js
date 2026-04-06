import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, getUserPurchase, verifyStripePurchase } from '../controllers/userController.js';

const userRouter = express.Router()

// Get user Data
userRouter.get('/data', getUserData)
userRouter.post('/purchase', purchaseCourse)
userRouter.post('/verify-purchase', verifyStripePurchase)
userRouter.post('/user-purchase', getUserPurchase)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)

export default userRouter;