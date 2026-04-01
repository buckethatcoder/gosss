// fetchers.js — functions that pull real content from external APIs
// Each function returns an object in the same shape as our mock content
// so the UI doesn't need to change at all

// Search queries for each topic — tuned for quality results
const TOPIC_QUERIES = {
  "Finance":        { news: "personal finance investing explained",  youtube: "finance explained beginner" },
  "Hollywood":      { news: "film cinema analysis hollywood",        youtube: "film analysis cinema history" },
  "Politics India": { news: "india politics explained",              youtube: "india current affairs" },
  "Rock Music":     { news: "rock music history band album",         youtube: "rock music history documentary" },
  "Politics US":    { news: "US politics explained",                 youtube: "US politics explained" },
  "Review":         { news: null,                                    youtube: null },
  "Tech":           { news: "technology explained ai software",      youtube: "tech explained beginner"      },
  "Free Pick":      { news: "interesting explainer science culture", youtube: "fascinating documentary short" },
};

// Fetch a news article for a given topic
export async function fetchArticle(topic) {
  const query = TOPIC_QUERIES[topic]?.news;
  if (!query) return null;

  const url = `https://newsapi.org/v2/everything?` +
    `q=${encodeURIComponent(query)}` +
    `&language=en` +
    `&sortBy=relevancy` +
    `&pageSize=5` +  // get 5, we'll pick the best one
    `&apiKey=${process.env.NEWS_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache for 1 hour
  if (!res.ok) throw new Error(`NewsAPI error: ${res.status}`);

  const data = await res.json();
  const articles = data.articles?.filter(a => a.title && a.description && a.url) ?? [];
  if (articles.length === 0) return null;

  // Pick the first valid article
  const article = articles[0];
  return {
    type: "article",
    title: article.title,
    source: article.source?.name ?? "News",
    duration: estimateReadTime(article.description),
    url: article.url,
    summary: article.description,
    image: article.urlToImage ?? null,
  };
}

// Fetch a YouTube video for a given topic
export async function fetchVideo(topic) {
  const query = TOPIC_QUERIES[topic]?.youtube;
  if (!query) return null;

  // Search for videos between 10-20 minutes (videoDuration=medium)
  const url = `https://www.googleapis.com/youtube/v3/search?` +
    `part=snippet` +
    `&q=${encodeURIComponent(query)}` +
    `&type=video` +
    `&videoDuration=medium` +   // 4-20 minutes
    `&relevanceLanguage=en` +
    `&maxResults=5` +
    `&key=${process.env.YOUTUBE_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`YouTube API error: ${res.status}`);

  const data = await res.json();
  const videos = data.items?.filter(v => v.snippet?.title && v.id?.videoId) ?? [];
  if (videos.length === 0) return null;

  const video = videos[0];
  return {
    type: "video",
    title: video.snippet.title,
    source: `YouTube · ${video.snippet.channelTitle}`,
    duration: "~15 min watch",
    url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
    summary: video.snippet.description?.slice(0, 200) + "..." ?? "",
    image: video.snippet.thumbnails?.high?.url ?? null,
  };
}

// Fetches both an article and a video in parallel for the given topic
// Promise.allSettled means if one fails, the other still comes through
export async function fetchTodayContent(topic) {
  const [articleResult, videoResult] = await Promise.allSettled([
    fetchArticle(topic),
    fetchVideo(topic),
  ]);

  return {
    article: articleResult.status === "fulfilled" ? articleResult.value : null,
    video:   videoResult.status   === "fulfilled" ? videoResult.value   : null,
  };
}

// Rough estimate of reading time based on text length
function estimateReadTime(text) {
  if (!text) return "5 min read";
  const words = text.split(" ").length;
  const minutes = Math.ceil(words / 200); // average reading speed
  return `~${minutes} min read`;
}
