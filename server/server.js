import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import eventRoutes from './routes/eventRoutes.js';
import sportRoutes from './routes/sportRoutes.js';
import clubRoutes from './routes/clubRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import path from 'path';
import startReminderScheduler from './utils/reminderScheduler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB().then(() => {
    // Start the event reminder scheduler
    startReminderScheduler();
});

app.use('/api/events', eventRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
