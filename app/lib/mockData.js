export const generateMockData = (platform, days = 30) => {
  const data = [];
  const today = new Date();
  
  // Base metrics for different platforms
  const baseMetrics = {
    instagram: {
      followers: 1000,
      engagement: 0.05,
      posts: 3,
      reach: 2000
    },
    youtube: {
      subscribers: 500,
      views: 2000,
      watchTime: 1000,
      likes: 100
    },
    tiktok: {
      followers: 2000,
      views: 5000,
      likes: 300,
      comments: 50
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
    } else if (platform === 'youtube') {
      const base = baseMetrics.youtube;
      dayData.subscribers = Math.round(base.subscribers * (1 + (Math.random() * 0.1 - 0.05)));
      dayData.views = Math.round(base.views * (1 + (Math.random() * 0.3 - 0.15)));
      dayData.watchTime = Math.round(base.watchTime * (1 + (Math.random() * 0.2 - 0.1)));
      dayData.likes = Math.round(base.likes * (1 + (Math.random() * 0.4 - 0.2)));
    } else if (platform === 'tiktok') {
      const base = baseMetrics.tiktok;
      dayData.followers = Math.round(base.followers * (1 + (Math.random() * 0.1 - 0.05)));
      dayData.views = Math.round(base.views * (1 + (Math.random() * 0.3 - 0.15)));
      dayData.likes = Math.round(base.likes * (1 + (Math.random() * 0.4 - 0.2)));
      dayData.comments = Math.round(base.comments * (1 + (Math.random() * 0.5 - 0.25)));
    }

    data.push(dayData);
  }

  return data;
};

export const generateMockSummary = (platform) => {
  const baseMetrics = {
    instagram: {
      totalFollowers: 1000,
      totalPosts: 150,
      avgEngagement: 0.05,
      totalReach: 20000
    },
    youtube: {
      totalSubscribers: 500,
      totalViews: 20000,
      totalWatchTime: 10000,
      totalLikes: 1000
    },
    tiktok: {
      totalFollowers: 2000,
      totalViews: 50000,
      totalLikes: 3000,
      totalComments: 500
    }
  };

  return baseMetrics[platform] || {};
}; 