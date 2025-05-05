import mongoose from 'mongoose';

const MockAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['youtube', 'instagram', 'tiktok']
  },
  date: {
    type: Date,
    required: true
  },
  isConnected: {
    type: Boolean,
    default: true
  },
  // YouTube metrics
  subscribers: Number,
  views: Number,
  watchTime: Number,
  likes: Number,
  // Instagram metrics
  followers: Number,
  engagement: Number,
  posts: Number,
  reach: Number,
  likes: Number,
  comments: Number,
  // TikTok metrics
  comments: Number
});

// Create compound index for efficient queries and prevent duplicates
// Include userId in the compound index to allow same date/platform combinations for different users
MockAnalyticsSchema.index({ userId: 1, platform: 1, date: 1 }, { unique: true });

// Prevent duplicate model compilation
const MockAnalytics = mongoose.models.MockAnalytics || mongoose.model('MockAnalytics', MockAnalyticsSchema);

export default MockAnalytics; 