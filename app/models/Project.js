import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  aiSuggestions: [{
    text: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    applied: {
      type: Boolean,
      default: false
    }
  }],
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps on save
ProjectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add text index for search functionality
ProjectSchema.index({ title: 'text', description: 'text', content: 'text' });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema); 