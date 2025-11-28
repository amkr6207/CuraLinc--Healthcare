import mongoose from 'mongoose';

const clinicalTrialSchema = new mongoose.Schema({
    nctId: {
        type: String,
        unique: true,
        sparse: true // Allow null for manually added trials
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    phase: {
        type: String,
        enum: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Not Applicable']
    },
    status: {
        type: String,
        enum: ['recruiting', 'not recruiting', 'completed', 'suspended', 'terminated'],
        default: 'recruiting'
    },
    conditions: [String],
    location: {
        city: String,
        country: String,
        facilities: [String]
    },
    eligibility: {
        criteria: String,
        minAge: String,
        maxAge: String,
        gender: {
            type: String,
            enum: ['All', 'Male', 'Female']
        }
    },
    contactEmail: String,
    contactPhone: String,
    principalInvestigator: String,
    sponsor: String,
    startDate: Date,
    completionDate: Date,
    enrollmentCount: Number,
    aiSummary: String,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    source: {
        type: String,
        enum: ['clinicaltrials.gov', 'manual'],
        default: 'manual'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
clinicalTrialSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('ClinicalTrial', clinicalTrialSchema);
