import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    userType: {
        type: String,
        enum: ['patient', 'researcher'],
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    orcidId: {
        type: String,
        unique: true,
        sparse: true
    },
    profile: {
        // Common fields
        name: String,

        // Patient-specific fields
        conditions: [String],
        symptoms: String,
        location: {
            city: String,
            country: String
        },

        // Researcher-specific fields
        specialties: [String],
        researchInterests: [String],
        orcidId: String,
        researchGateId: String,
        availableForMeetings: {
            type: Boolean,
            default: false
        },
        bio: String,
        institution: String
    },
    favorites: {
        trials: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ClinicalTrial' }],
        publications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Publication' }],
        experts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HealthExpert' }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default mongoose.model('User', userSchema);
