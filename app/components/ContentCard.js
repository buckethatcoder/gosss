"use client";

import { useState, useEffect } from "react";
import { saveFeedback } from "../../lib/supabase";

export default function ContentCard({ article, video, accent, topic }) {
  const [done, setDone] = useState(false);
  const todayKey = `gosss-done-${topic}-${new Date().toDateString()}`;

  useEffect(() => {
    if (localStorage.getItem(todayKey) === "true") setDone(true);
  }, [todayKey]);

  function markDone() {
    localStorage.setItem(todayKey, "true");
    setDone(true);
  }

  function undo() {
    localStorage.removeItem(todayKey);
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center animate-fade-up">
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: accent }} className="text-6xl font-bold">
          Read.
        </div>
        <p className="text-[#1C1208]/40 text-sm italic" style={{ fontFamily: "var(--font-body)" }}>
          Pick another topic or come back tomorrow.
        </p>
        <button onClick={undo} className="mt-2 text-xs uppercase tracking-widest text-[#1C1208]/25 hover:text-[#1C1208]/50 transition-colors">
          undo
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 animate-fade-up-delay">
      {article && <ContentItem item={article} accent={accent} topic={topic} />}
      {video   && <ContentItem item={video}   accent={accent} topic={topic} />}

      <button
        onClick={markDone}
        style={{ borderColor: accent, color: accent }}
        className="w-full py-3 border-2 text-sm font-bold uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
        style={{ fontFamily: "var(--font-body)", borderColor: accent, color: accent }}
      >
        Mark as Read ✓
      </button>
    </div>
  );
}

function ContentItem({ item, accent, topic }) {
  const [vote, setVote] = useState(null);

  async function handleVote(value) {
    if (vote === value) return;
    setVote(value);
    await saveFeedback({ topic, contentType: item.type, title: item.title, vote: value });
  }

  return (
    <div className="flex flex-col gap-3 pb-8 border-b border-[#1C1208]/10">

      {/* Section tag */}
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1C1208]/35">
        {item.type === "video" ? "📹 Video Report" : "📄 Feature"}
      </span>

      {/* Headline */}
      <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }} className="text-2xl leading-snug text-[#1C1208]">
        {item.title}
      </h3>

      {/* Lede */}
      <p style={{ fontFamily: "var(--font-body)" }} className="text-sm leading-relaxed text-[#1C1208]/60 italic">
        {item.summary}
      </p>

      {/* Byline row */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1C1208]/10">
        <span className="text-xs text-[#1C1208]/35" style={{ fontFamily: "var(--font-body)" }}>
          {item.source} · {item.duration}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accent, fontFamily: "var(--font-body)" }}
          className="text-xs font-bold uppercase tracking-wider hover:opacity-60 transition-opacity"
        >
          Read Full Story →
        </a>
      </div>

      {/* Feedback */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-[#1C1208]/30 italic" style={{ fontFamily: "var(--font-body)" }}>Worth your time?</span>
        <button onClick={() => handleVote(1)} className={`text-base transition-all hover:scale-110 ${vote === 1 ? "opacity-100" : "opacity-25 hover:opacity-60"}`}>👍</button>
        <button onClick={() => handleVote(-1)} className={`text-base transition-all hover:scale-110 ${vote === -1 ? "opacity-100" : "opacity-25 hover:opacity-60"}`}>👎</button>
      </div>

    </div>
  );
}
