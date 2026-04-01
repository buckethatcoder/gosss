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
      <div className="flex flex-col items-center justify-center gap-5 py-28 text-center animate-fade-up">
        <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", color: accent }} className="text-6xl">
          Done.
        </div>
        <p className="text-[#EDE8DF]/30 text-sm font-light tracking-wide">
          Pick another topic or come back tomorrow.
        </p>
        <button onClick={undo} className="mt-4 text-xs text-[#EDE8DF]/20 uppercase tracking-widest font-light hover:text-[#EDE8DF]/50 transition-colors">
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
        style={{ borderColor: `${accent}40`, color: accent }}
        className="w-full py-4 border text-sm font-semibold uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
      >
        Mark Done ✓
      </button>
    </div>
  );
}

function ContentItem({ item, accent, topic }) {
  // Track vote state per item so the buttons reflect what was chosen
  const [vote, setVote] = useState(null); // null | 1 | -1

  async function handleVote(value) {
    if (vote === value) return; // already voted this way
    setVote(value);
    await saveFeedback({
      topic,
      contentType: item.type,
      title: item.title,
      vote: value,
    });
  }

  return (
    <div className="flex flex-col gap-4 pb-8 border-b border-[#EDE8DF]/8">

      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#EDE8DF]/25">
        {item.type === "video" ? "📹 Video" : "📄 Article"}
      </span>

      <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[1.6rem] leading-snug text-[#EDE8DF]">
        {item.title}
      </h2>

      <p className="text-[#EDE8DF]/45 text-sm font-light leading-relaxed">
        {item.summary}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-[#EDE8DF]/20 font-light">
          {item.source} · {item.duration}
        </span>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: accent }}
          className="text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-60 transition-opacity"
        >
          Open →
        </a>
      </div>

      {/* Thumbs up / down */}
      <div className="flex items-center gap-3 pt-1">
        <span className="text-xs text-[#EDE8DF]/20 font-light">Was this good?</span>
        <button
          onClick={() => handleVote(1)}
          className={`text-lg transition-all hover:scale-110 ${vote === 1 ? "opacity-100" : "opacity-25 hover:opacity-60"}`}
        >
          👍
        </button>
        <button
          onClick={() => handleVote(-1)}
          className={`text-lg transition-all hover:scale-110 ${vote === -1 ? "opacity-100" : "opacity-25 hover:opacity-60"}`}
        >
          👎
        </button>
      </div>

    </div>
  );
}
