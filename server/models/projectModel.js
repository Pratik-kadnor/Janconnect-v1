const mongoose = require('mongoose');

// Milestone sub-schema
const milestoneSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, 'Please provide milestone description']
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide milestone deadline']
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  evidenceUrl: {
    type: String
  },
  completedDate: {
    type: Date
  },
  remarks: {
    type: String
  }
}, { timestamps: true });

// Main project schema
const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Please provide project title'],
    trim: true
  },
  component: { 
    type: String, 
    enum: ['Adarsh Gram', 'GIA', 'Hostel'], 
    required: [true, 'Please specify project component']
  },
  status: { 
    type: String, 
    enum: ['Sanctioned', 'In-Progress', 'Completed', 'Delayed'], 
    default: 'Sanctioned' 
  },
  state: {
    type: String,
    required: [true, 'Please provide state']
  },
  district: {
    type: String,
    required: [true, 'Please provide district']
  },
  implementingAgency: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agency',
    required: [true, 'Please assign implementing agency']
  },
  executingAgency: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agency',
    required: [true, 'Please assign executing agency']
  },
  financials: {
    totalBudget: { 
      type: Number, 
      default: 0,
      min: [0, 'Budget cannot be negative']
    },
    fundsReleased: { 
      type: Number, 
      default: 0,
      min: [0, 'Funds released cannot be negative'],
      validate: {
        validator: function(value) {
          return value <= this.financials.totalBudget;
        },
        message: 'Funds released cannot exceed total budget'
      }
    },
    fundsUtilized: { 
      type: Number, 
      default: 0,
      min: [0, 'Funds utilized cannot be negative'],
      validate: {
        validator: function(value) {
          return value <= this.financials.fundsReleased;
        },
        message: 'Funds utilized cannot exceed funds released'
      }
    }
  },
  milestones: [milestoneSchema],
  sanctionDate: {
    type: Date,
    required: [true, 'Please provide sanction date']
  },
  expectedCompletionDate: {
    type: Date,
    required: [true, 'Please provide expected completion date']
  },
  actualCompletionDate: {
    type: Date
  },
  description: {
    type: String
  },
  beneficiaries: {
    type: Number,
    default: 0,
    min: [0, 'Beneficiaries cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { 
  timestamps: true 
});

// Virtual for calculating utilization percentage
projectSchema.virtual('utilizationPercentage').get(function() {
  if (this.financials.fundsReleased === 0) return 0;
  return ((this.financials.fundsUtilized / this.financials.fundsReleased) * 100).toFixed(2);
});

// Virtual for calculating completed milestones percentage
projectSchema.virtual('milestoneProgress').get(function() {
  if (this.milestones.length === 0) return 0;
  const completed = this.milestones.filter(m => m.status === 'Completed').length;
  return ((completed / this.milestones.length) * 100).toFixed(2);
});

// Indexes for performance
projectSchema.index({ state: 1, status: 1 });
projectSchema.index({ component: 1 });
projectSchema.index({ implementingAgency: 1 });
projectSchema.index({ executingAgency: 1 });
projectSchema.index({ createdAt: -1 });

// Ensure virtuals are included in JSON
projectSchema.set('toJSON', { virtuals: true });
projectSchema.set('toObject', { virtuals: true });

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
