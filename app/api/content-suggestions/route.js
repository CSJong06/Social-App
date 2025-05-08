import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { topic, platform, tone } = await request.json();

    const prompt = `Generate ONE creative content idea for a ${topic} influencer on ${platform}. 
    The tone should be ${tone}. Include a mix of different content types (posts, reels, stories, etc.) 
    that would engage their audience. Format the suggestion with a title and brief description.
    Keep the suggestion concise and focused on a single idea.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 150,
    });

    return NextResponse.json({ 
      suggestions: completion.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error generating content suggestions:', error);
    return NextResponse.json(
      { error: 'Failed to generate content suggestions' },
      { status: 500 }
    );
  }
} 