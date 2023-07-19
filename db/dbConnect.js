import mongoose from "mongoose";
export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("successfully connected");
  } catch (error) {
    console.log("something is wrong in connection");
  }
};
