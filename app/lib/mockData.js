export const generateMockData = (platform, days = 30) => {
  const data = [];
  const today = new Date();
  
  // Base metrics for different platforms with more variation
  const baseMetrics = {
    instagram: {
      followers: Math.floor(Math.random() * 5000) + 1000, // Random between 1000-6000
      engagement: 0.05 + (Math.random() * 0.03), // Random between 0.05-0.08
      posts: Math.floor(Math.random() * 5) + 1, // Random between 1-6
      reach: Math.floor(Math.random() * 5000) + 1000, // Random between 1000-6000
      likes: Math.floor(Math.random() * 500) + 100, // Random between 100-600
      comments: Math.floor(Math.random() * 100) + 20 // Random between 20-120
    },
    youtube: {
      subscribers: Math.floor(Math.random() * 3000) + 500, // Random between 500-3500
      views: Math.floor(Math.random() * 10000) + 2000, // Random between 2000-12000
      watchTime: Math.floor(Math.random() * 5000) + 1000, // Random between 1000-6000
      likes: Math.floor(Math.random() * 300) + 50 // Random between 50-350
    },
    tiktok: {
      followers: Math.floor(Math.random() * 8000) + 2000, // Random between 2000-10000
      views: Math.floor(Math.random() * 20000) + 5000, // Random between 5000-25000
      likes: Math.floor(Math.random() * 1000) + 300, // Random between 300-1300
      comments: Math.floor(Math.random() * 200) + 50 // Random between 50-250
    }
  };

  // Generate data for each day
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dayData = {
      date: date.toISOString().split('T')[0],
    };

    // Add platform-specific metrics with some random variation
    if (platform === 'instagram') {
      const base = baseMetrics.instagram;
      dayData.followers = Math.round(base.followers * (1 + (Math.random() * 0.1 - 0.05)));
      dayData.engagement = base.engagement * (1 + (Math.random() * 0.2 - 0.1));
      dayData.posts = Math.round(base.posts * (1 + (Math.random() * 0.5 - 0.25)));
      dayData.reach = Math.round(base.reach * (1 + (Math.random() * 0.2 - 0.1)));
      dayData.likes = Math.round(base.likes * (1 + (Math.random() * 0.3 - 0.15)));
      dayData.comments = Math.round(base.comments * (1 + (Math.random() * 0.4 - 0.2)));
    } else if (platform === 'youtube') {
      const base = baseMetrics.youtube;
      dayData.subscribers = Math.round(base.subscribers * (1 + (Math.random() * 0.1 - 0.05)));
      dayData.views = Math.round(base.views * (1 + (Math.random() * 0.2 - 0.1)));
      dayData.watchTime = Math.round(base.watchTime * (1 + (Math.random() * 0.2 - 0.1)));
      dayData.likes = Math.round(base.likes * (1 + (Math.random() * 0.3 - 0.15)));
    } else if (platform === 'tiktok') {
      const base = baseMetrics.tiktok;
      dayData.followers = Math.round(base.followers * (1 + (Math.random() * 0.1 - 0.05)));
      dayData.views = Math.round(base.views * (1 + (Math.random() * 0.2 - 0.1)));
      dayData.likes = Math.round(base.likes * (1 + (Math.random() * 0.3 - 0.15)));
      dayData.comments = Math.round(base.comments * (1 + (Math.random() * 0.4 - 0.2)));
    }

    data.push(dayData);
  }

  return data;
};

export const generateMockSummary = (platform) => {
  // Generate random base metrics for summary
  const baseMetrics = {
    instagram: {
      totalFollowers: Math.floor(Math.random() * 5000) + 1000,
      totalPosts: Math.floor(Math.random() * 150) + 50,
      avgEngagement: 0.05 + (Math.random() * 0.03),
      totalReach: Math.floor(Math.random() * 20000) + 5000
    },
    youtube: {
      totalSubscribers: Math.floor(Math.random() * 3000) + 500,
      totalViews: Math.floor(Math.random() * 20000) + 5000,
      totalWatchTime: Math.floor(Math.random() * 10000) + 2000,
      totalLikes: Math.floor(Math.random() * 1000) + 200
    },
    tiktok: {
      totalFollowers: Math.floor(Math.random() * 8000) + 2000,
      totalViews: Math.floor(Math.random() * 50000) + 10000,
      totalLikes: Math.floor(Math.random() * 3000) + 500,
      totalComments: Math.floor(Math.random() * 500) + 100
    }
  };

  return baseMetrics[platform] || {};
}; 