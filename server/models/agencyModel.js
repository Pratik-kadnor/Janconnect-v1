const mongoose = require('mongoose');

// Agency schema for implementing and executing agencies
const agencySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please provide agency name'],
    trim: true
  },
  type: { 
    type: String, 
    enum: ['Implementing', 'Executing'], 
    required: [true, 'Please specify agency type']
  },
  state: { 
    type: String, 
    required: [true, 'Please provide state name']
  },
  district: { 
    type: String 
  },
  nodalOfficer: {
    name: { 
      type: String,
      required: [true, 'Please provide nodal officer name']
    },
    email: { 
      type: String,
      required: [true, 'Please provide nodal officer email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    phone: { 
      type: String,
      required: [true, 'Please provide nodal officer phone'],
      match: [/^[0-9]{10}$/, 'Please provide a valid 10-digit phone number']
    }
  },
  address: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for faster queries
agencySchema.index({ state: 1, type: 1 });
agencySchema.index({ name: 1 });

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;
