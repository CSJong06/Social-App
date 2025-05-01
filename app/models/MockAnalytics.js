import mongoose from 'mongoose';

const MockAnalyticsSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['youtube', 'instagram', 'tiktok']
  },
  date: {
    type: Date,
    required: true
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
  // TikTok metrics
  comments: Number
});

// Create compound index for efficient queries
MockAnalyticsSchema.index({ platform: 1, date: 1 });

// Prevent duplicate model compilation
const MockAnalytics = mongoose.models.MockAnalytics || mongoose.model('MockAnalytics', MockAnalyticsSchema);

export default MockAnalytics; 