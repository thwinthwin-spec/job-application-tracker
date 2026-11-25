const mongoose = require('mongoose');

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];
const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

const applicationSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    employmentType: {
      type: String,
      enum: EMPLOYMENT_TYPES,
      default: 'Full-time'
    },
    postingUrl: { type: String, default: '', trim: true },
    dateApplied: { type: Date, required: true },
    status: { type: String, enum: STATUSES, default: 'Saved' },
    contactName: { type: String, default: '', trim: true },
    contactEmail: { type: String, default: '', trim: true },
    notes: { type: String, default: '', trim: true },
    followUpDate: { type: Date, default: null },
    interviewDate: { type: Date, default: null }
  },
  { timestamps: true }
);

// Helpful indexes for the common list and stats screens.
applicationSchema.index({ owner: 1, dateApplied: -1 });
applicationSchema.index({ owner: 1, status: 1 });
applicationSchema.index({ owner: 1, followUpDate: 1 });

module.exports = mongoose.model('Application', applicationSchema);
