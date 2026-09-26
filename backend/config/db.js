import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const configuredUri = process.env.MONGO_URI?.trim();

    if (!configuredUri) {
      throw new Error('MONGO_URI is not configured');
    }

    // Recover from an accidentally duplicated MONGO_URI assignment in .env.
    const mongoUri = configuredUri.split('MONGO_URI=')[0];
    const conn = await mongoose.connect(mongoUri);
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;