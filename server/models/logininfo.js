import mongoose from "mongoose";

const loginHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  browser: {
    type: String,
    required: true,
  },
  os: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Logininfo", loginHistorySchema);