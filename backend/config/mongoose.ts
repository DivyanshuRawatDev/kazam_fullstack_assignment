const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://divyanshurawatdev:ML05a09d%40123@cluster0.2larfwk.mongodb.net/kazam";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB Error", error);
    process.exit(1);
  }
};

export default connectDB;
