import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    activityType: { type: String, required: true },
    pageViewed: { type: String },
    browserInfo: { type: String },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;