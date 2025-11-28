import mongoose from 'mongoose';

const healthExpertSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        sparse: true // Allow null for non-registered experts
    },
    name: {
        type: String,
        required: true
    },
    specialties: [String],
    researchInterests: [String],
    location: {
        city: String,
        country: String
    },
    publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
    isRegistered: {
        type: Boolean,
        default: false
    },
    contactEmail: String,
    orcidId: String,
    researchGateId: String,
    institution: String,
    bio: String,
    profilePicture: String,
    h_index: Number, // Research impact metric
    totalCitations: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('HealthExpert', healthExpertSchema);
