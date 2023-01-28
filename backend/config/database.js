import mongoose from "mongoose";
const connectDB = async (req, res) => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGOOSE_URL).then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
