import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    console.warn(
      '[DB] MongoDB URI is missing. Set MONGO_URI (or MONGODB_URI) in server/.env.'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.warn(
        `[DB] Cannot reach MongoDB at ${mongoUri}. Start MongoDB or update MONGO_URI/MONGODB_URI.`
      );
      return false;
    }

    console.warn(`[DB] Connection failed: ${error.message}`);
    return false;
  }
};

export default connectDB;
