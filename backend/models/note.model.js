import mongoose from "mongoose";


const noteSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true })

export const Note = mongoose.model('Note', noteSchema)
