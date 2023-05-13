import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI as string);
    } catch(error: any) {
        console.log(error.message);
    };
};

export default connectDB;