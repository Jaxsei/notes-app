import mongoose from "mongoose";

// Note Database structure
const noteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: false },
  isStarred: { type: Boolean, default: false },
  color: { type: String, default: "default" }
}, { timestamps: true })

export const Note = mongoose.model('Note', noteSchema)
