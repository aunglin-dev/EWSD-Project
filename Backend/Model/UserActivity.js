import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true, 
        refPath: 'userModel' // Dynamic reference based on 'userModel'
    },
    userModel: { 
        type: String, 
        required: true, 
        enum: ['Student', 'Tutor', 'Staff'] // Allowed models
    },
    activityType: { type: String, required: true },
    pageViewed: { type: String },
    browserInfo: { type: String },
    deviceInfo: { type: String },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const UserActivity = mongoose.model('UserActivity', userActivitySchema);

export default UserActivity;