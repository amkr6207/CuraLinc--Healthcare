import mongoose from 'mongoose';

const meetingRequestSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HealthExpert',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'admin_review'],
        default: 'pending'
    },
    message: String,
    contactInfo: {
        name: String,
        email: String,
        phone: String
    },
    preferredDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now
    },
    respondedAt: Date
});

export default mongoose.model('MeetingRequest', meetingRequestSchema);
