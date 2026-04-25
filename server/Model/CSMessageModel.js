import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  threadId: String,
  fromId: String,
  toId: String,
  content: String,
  file: String,
  read: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CSMessage", messageSchema);