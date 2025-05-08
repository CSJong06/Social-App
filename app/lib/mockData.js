export const generateMockData = (platform, startDate, endDate) => {
  const data = [];
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  // Base metrics with more variation
  const baseMetrics = {
    youtube: {
      subscribers: Math.floor(Math.random() * 1000) + 5000, // 5000-6000
      views: Math.floor(Math.random() * 5000) + 10000, // 10000-15000
      likes: Math.floor(Math.random() * 300) + 200, // 200-500
      comments: Math.floor(Math.random() * 100) + 20, // 20-120
    },
    instagram: {
      followers: Math.floor(Math.random() * 2000) + 8000, // 8000-10000
      reach: Math.floor(Math.random() * 3000) + 5000, // 5000-8000
      likes: Math.floor(Math.random() * 400) + 300, // 300-700
      comments: Math.floor(Math.random() * 50) + 30, // 30-80
    },
    tiktok: {
      followers: Math.floor(Math.random() * 3000) + 7000, // 7000-10000
      views: Math.floor(Math.random() * 8000) + 12000, // 12000-20000
      likes: Math.floor(Math.random() * 500) + 400, // 400-900
      comments: Math.floor(Math.random() * 100) + 50, // 50-150
    }
  };

  // Generate data for each day
  for (let i = 0; i < days; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    
    // Add weekly patterns (weekend boost)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendMultiplier = isWeekend ? 1.3 : 1;

    // Add random daily fluctuations
    const dailyFluctuation = 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    // Add gradual growth trend
    const growthTrend = 1 + (i / days) * 0.2; // 1 to 1.2 over the period

    // Add occasional spikes (viral content)
    const spikeChance = Math.random();
    const spikeMultiplier = spikeChance > 0.95 ? 2 : 1; // 5% chance of viral content

    const dayData = {
      date: currentDate,
      platform,
    };

    // Apply variations to each metric
    if (platform === 'youtube') {
      dayData.subscribers = Math.floor(baseMetrics.youtube.subscribers * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.views = Math.floor(baseMetrics.youtube.views * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.likes = Math.floor(baseMetrics.youtube.likes * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.comments = Math.floor(baseMetrics.youtube.comments * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
    } else if (platform === 'instagram') {
      dayData.followers = Math.floor(baseMetrics.instagram.followers * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.reach = Math.floor(baseMetrics.instagram.reach * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.likes = Math.floor(baseMetrics.instagram.likes * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.comments = Math.floor(baseMetrics.instagram.comments * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
    } else if (platform === 'tiktok') {
      dayData.followers = Math.floor(baseMetrics.tiktok.followers * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.views = Math.floor(baseMetrics.tiktok.views * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.likes = Math.floor(baseMetrics.tiktok.likes * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
      dayData.comments = Math.floor(baseMetrics.tiktok.comments * weekendMultiplier * dailyFluctuation * growthTrend * spikeMultiplier);
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