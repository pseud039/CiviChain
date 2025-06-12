import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
//   votedAt: { type: Date, default: Date.now }
})

export const Vote = mongoose.model("Vote",VoteSchema);