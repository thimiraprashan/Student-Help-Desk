import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Event from '../models/Event.js';
import Club from '../models/Club.js';
import Sport from '../models/Sport.js';
import Notification from '../models/Notification.js';

dotenv.config();

const clearData = async () => {
    try {
        await connectDB();

        console.log('Clearing all data...');

        await Event.deleteMany({});
        await Club.deleteMany({});
        await Sport.deleteMany({});
        await Notification.deleteMany({});

        console.log('✅ Events cleared');
        console.log('✅ Clubs cleared');
        console.log('✅ Sports cleared');
        console.log('✅ Notifications cleared');

        process.exit();
    } catch (error) {
        console.error('Error clearing data:', error);
        process.exit(1);
    }
};

clearData();
