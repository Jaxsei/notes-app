import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Note must have an owner"],
      index: true // helps query notes per user faster
    },
    title: {
      type: String,
      required: [true, "Note title is required"],
      trim: true,
      maxlength: [100, "Title must be under 100 characters"]
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: ""
    },
    thumbnail: {
      type: String,
      required: [true, 'Note thumbnail required']
    },
    isStarred: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: "default",
      enum: [
        "default",
        "red",
        "orange",
        "yellow",
        "green",
        "blue",
        "purple",
        "pink",
        "gray"
      ]
    }
  },
  { timestamps: true }
);

// Optional compound index for faster starred notes per user
noteSchema.index({ owner: 1, isStarred: 1 });

export const Note = mongoose.model("Note", noteSchema);
