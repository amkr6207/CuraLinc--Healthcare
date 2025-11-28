import mongoose from 'mongoose';

const publicationSchema = new mongoose.Schema({
    pmid: {
        type: String,
        unique: true,
        sparse: true
    },
    title: {
        type: String,
        required: true
    },
    abstract: String,
    authors: [String],
    journal: String,
    publishedDate: Date,
    doi: String,
    url: String,
    keywords: [String],
    aiSummary: String,
    relatedConditions: [String],
    citationCount: Number,
    source: {
        type: String,
        enum: ['pubmed', 'manual'],
        default: 'pubmed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Publication', publicationSchema);
