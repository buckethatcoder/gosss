import Anthropic from "@anthropic-ai/sdk";
import { fetchArticle, fetchVideo } from "./fetchers";

const TOPICS = ["Finance", "Hollywood", "Politics India", "Rock Music", "Politics US", "Tech"];

const TOPIC_META = {
  "Finance":        { emoji: "💰", color: "emerald" },
  "Hollywood":      { emoji: "🎬", color: "purple"  },
  "Politics India": { emoji: "🇮🇳", color: "orange"  },
  "Rock Music":     { emoji: "🎸", color: "red"     },
  "Politics US":    { emoji: "🇺🇸", color: "blue"    },
  "Tech":           { emoji: "💻", color: "cyan"    },
};

// Home page: only fetch articles (6 calls instead of 12) — faster load
async function fetchArticlesOnly() {
  const results = await Promise.allSettled(
    TOPICS.map(async (topic) => {
      const article = await fetchArticle(topic);
      return { topic, article };
    })
  );
  return results
    .filter(r => r.status === "fulfilled")
    .map(r => r.value);
}

// Topic detail page: fetch both article and video for one topic
export async function fetchTopicContent(topic) {
  const [article, video] = await Promise.allSettled([
    fetchArticle(topic),
    fetchVideo(topic),
  ]);
  return {
    article: article.status === "fulfilled" ? article.value : null,
    video:   video.status   === "fulfilled" ? video.value   : null,
  };
}

// Ask Claude to write a 2-sentence briefing for each topic
async function summariseWithClaude(topicData) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const topicDescriptions = topicData.map(({ topic, article }) => {
    const lines = [`Topic: ${topic}`];
    if (article) lines.push(`Article: "${article.title}" — ${article.summary}`);
    return lines.join("\n");
  }).join("\n\n");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    messages: [{
      role: "user",
      content: `You are helping a curious beginner learn something new every day.

Here is today's content across 6 topics:

${topicDescriptions}

For each topic, write exactly 2 sentences summarising what's happening today in plain, engaging language a beginner would enjoy. Make it feel like a friend is briefing them over coffee — no jargon, no fluff.

Respond in this exact JSON format:
[
  { "topic": "Finance", "briefing": "..." },
  { "topic": "Hollywood", "briefing": "..." },
  { "topic": "Politics India", "briefing": "..." },
  { "topic": "Rock Music", "briefing": "..." },
  { "topic": "Politics US", "briefing": "..." },
  { "topic": "Tech", "briefing": "..." }
]`
    }]
  });

  const text = message.content[0].text;
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error("Claude did not return valid JSON");
  return JSON.parse(jsonMatch[0]);
}

// Home page — returns briefings only (no videos, faster)
export async function getDailyBriefing() {
  const topicData = await fetchArticlesOnly();
  const briefings = await summariseWithClaude(topicData);

  return briefings.map((b) => {
    const data = topicData.find(t => t.topic === b.topic);
    const meta = TOPIC_META[b.topic];
    return {
      topic:    b.topic,
      briefing: b.briefing,
      emoji:    meta.emoji,
      color:    meta.color,
      hasArticle: !!data?.article,
      hasVideo:   true, // always show video badge — loaded on detail page
    };
  });
}
