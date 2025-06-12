import mongoose from "mongoose";

const AILogSchema = new mongoose.Schema({
  issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  predictedPriority: String,
  predictionConfidence: Number,
  isDuplicate: Boolean,
  modelVersion: String,
  evaluatedAt: Date
});

export const AiLog = mongoose.model("AiLog",AILogSchema);
