import mongoose from 'mongoose';

const contentSuggestionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['instagram', 'tiktok', 'youtube', 'twitter']
  },
  tone: {
    type: String,
    required: true,
    enum: ['professional', 'casual', 'humorous', 'educational']
  },
  status: {
    type: String,
    enum: ['saved', 'edited', 'deleted'],
    default: 'saved'
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

// Update the updatedAt timestamp before saving
contentSuggestionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const ContentSuggestion = mongoose.models.ContentSuggestion || mongoose.model('ContentSuggestion', contentSuggestionSchema);

export default ContentSuggestion; 