import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

// Connect To Mongo Database
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n MONGODB Connected !! DB HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.error('Error in MONGODB Connection ', error)
    process.exit(1)

  }
}

export default connectDB
