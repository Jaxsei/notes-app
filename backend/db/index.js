import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
// Connect to MongoDB
const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI not defined in environment variables.");
        process.exit(1);
    }
    try {
        const connection = await mongoose.connect(`${uri}/${DB_NAME}`, {});
        console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=index.js.map