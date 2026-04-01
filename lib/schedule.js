// schedule.js — defines what topic to show on each day of the week
// and has sample (mock) content for each topic

// The schedule maps day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)
// to a topic with a name, color, and emoji
export const SCHEDULE = {
  0: { topic: "Review",         emoji: "📚", color: "slate"   }, // Sunday
  1: { topic: "Finance",        emoji: "💰", color: "emerald" }, // Monday
  2: { topic: "Hollywood",      emoji: "🎬", color: "purple"  }, // Tuesday
  3: { topic: "Politics India", emoji: "🇮🇳", color: "orange"  }, // Wednesday
  4: { topic: "Rock Music",     emoji: "🎸", color: "red"     }, // Thursday
  5: { topic: "Politics US",    emoji: "🇺🇸", color: "blue"    }, // Friday
  6: { topic: "Free Pick",      emoji: "🎯", color: "yellow"  }, // Saturday
};

// Mock content — one sample item per topic
// In Phase 2, we'll replace these with real API results
export const MOCK_CONTENT = {
  "Finance": {
    type: "article",
    title: "What is Compound Interest and Why Does It Matter?",
    source: "Investopedia",
    duration: "8 min read",
    url: "#",
    summary: "The single most important concept in personal finance, explained simply.",
  },
  "Hollywood": {
    type: "video",
    title: "Why The Godfather Changed Cinema Forever",
    source: "YouTube · Every Frame a Painting",
    duration: "18 min watch",
    url: "#",
    summary: "A deep dive into the techniques that made this 1972 film a masterpiece.",
  },
  "Politics India": {
    type: "article",
    title: "Understanding India's Budget: What It Means for You",
    source: "The Hindu",
    duration: "12 min read",
    url: "#",
    summary: "Breaking down the Union Budget in plain language — no economics degree needed.",
  },
  "Rock Music": {
    type: "video",
    title: "The Story Behind Led Zeppelin's 'Stairway to Heaven'",
    source: "YouTube · Rick Beato",
    duration: "22 min watch",
    url: "#",
    summary: "How one song became the defining moment of an entire era of rock.",
  },
  "Politics US": {
    type: "article",
    title: "How the US Congress Actually Works",
    source: "NPR",
    duration: "10 min read",
    url: "#",
    summary: "A plain-English guide to how laws get made — and why it's so slow.",
  },
  "Review": {
    type: "article",
    title: "It's Sunday — Pick one thing you learned this week and go deeper.",
    source: "GOSSS",
    duration: "Your pace",
    url: "#",
    summary: "No new content today. Revisit your favorite piece from the week.",
  },
  "Free Pick": {
    type: "article",
    title: "Saturday is your wild card — check back once APIs are connected!",
    source: "GOSSS",
    duration: "TBD",
    url: "#",
    summary: "This slot will surface trending content across all your topics.",
  },
};

// Returns today's schedule entry and its mock content
export function getTodayContent() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0-6
  const schedule = SCHEDULE[dayOfWeek];
  const content = MOCK_CONTENT[schedule.topic];
  return { schedule, content };
}
