import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 3;
  const retryDelay = 3000; // 3 seconds

  for (let i = 0; i < maxRetries; i++) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      });

      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(
        `Database connection attempt ${i + 1}/${maxRetries} failed:`,
        error.message
      );

      if (i < maxRetries - 1) {
        console.log(`Retrying in ${retryDelay / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      } else {
        console.error(
          "All connection attempts failed. Check your MongoDB URI and internet connection."
        );
        console.warn("Server starting without database connection...");
      }
    }
  }
};

export default connectDB;