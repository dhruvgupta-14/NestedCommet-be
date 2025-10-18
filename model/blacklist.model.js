import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  expireAt: {
    type: Date,
    default: Date.now, 
  },
});

// TTL index: delete document 1 day (86400 seconds) after expireAt
blackListTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 86400 });
const BlackListToken = mongoose.model("BlackListToken", blackListTokenSchema);
export default BlackListToken;
