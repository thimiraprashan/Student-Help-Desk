import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      'MongoDB URI is missing. Set MONGO_URI (or MONGODB_URI) in server/.env.'
    );
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot reach MongoDB at ${mongoUri}. Start MongoDB or update MONGO_URI/MONGODB_URI.`
      );
    }

    throw error;
  }
};

export default connectDB;
