import mongoose from 'mongoose';
import 'dotenv/config';

async function checkCourses() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const Course = mongoose.model('Course', new mongoose.Schema({
            courseTitle: String,
            educator: String
        }, { strict: false }));

        const courses = await Course.find({});
        console.log(`Found ${courses.length} courses total.`);
        courses.forEach(c => {
            console.log(`Title: ${c.courseTitle}, Educator ID: ${c.educator}, Thumbnail: ${c.courseThumbnail ? 'Exists' : 'MISSING'}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCourses();
