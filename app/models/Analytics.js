import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok']
  },
  metrics: [{
    followers: Number,
    engagement: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  dailyStats: [{
    date: {
      type: Date,
      default: Date.now
    },
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create compound index for efficient queries
AnalyticsSchema.index({ userId: 1, platform: 1 });

// Create index for date-based queries
AnalyticsSchema.index({ 'metrics.timestamp': -1 });
AnalyticsSchema.index({ 'dailyStats.date': -1 });

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema); 