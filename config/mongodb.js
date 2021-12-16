import mongoose from "mongoose";

const connection = {};

async function connectDB() {
  if (connection.isConnected) return;

  // configure db
  const MONGO_URI = process.env.MONGO_URI;
  const DEPRECATED_FIX = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  // connect db
  try {
    const db = await mongoose.connect(MONGO_URI, DEPRECATED_FIX);
    connection.isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected:", connection.isConnected);
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
  }
}

export default connectDB;
