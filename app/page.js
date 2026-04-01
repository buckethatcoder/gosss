import Link from "next/link";
import { getDailyBriefing } from "../lib/briefing";

export const dynamic = "force-dynamic";

const accentMap = {
  emerald: "#1a6640",
  purple:  "#6b21a8",
  orange:  "#b45309",
  red:     "#991b1b",
  blue:    "#1e40af",
  cyan:    "#0e7490",
};

export default async function Home() {
  const briefings = await getDailyBriefing();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  // Split into two columns
  const col1 = briefings.slice(0, 3);
  const col2 = briefings.slice(3);

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto px-6">

      {/* Masthead */}
      <header className="animate-fade-up pt-10 pb-4 flex flex-col items-center gap-1 border-b-4 border-[#111111]">
        <div className="text-xs tracking-[0.3em] uppercase text-[#111111]/50" style={{ fontFamily: "var(--font-body)" }}>
          Est. {new Date().getFullYear()} · Your Daily Intelligence Brief
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900 }} className="text-7xl tracking-tight text-[#111111] leading-none">
          GOSSS
        </h1>
        <div className="w-full flex items-center justify-between pt-2 text-[11px] text-[#111111]/40" style={{ fontFamily: "var(--font-body)" }}>
          <span>{today}</span>
          <span>6 Topics · 20 Minutes</span>
        </div>
      </header>

      {/* Headline */}
      <div className="animate-fade-up py-6 border-b border-[#111111]/20 text-center">
        <h2 style={{ fontFamily: "var(--font-display)", fontStyle: "italic" }} className="text-3xl text-[#111111]">
          What is today's GOSSS?
        </h2>
      </div>

      {/* Two-column newspaper layout */}
      <main className="flex-1 grid grid-cols-2 divide-x divide-[#111111]/15 py-8 gap-0 animate-fade-up-delay">

        {/* Column 1 */}
        <div className="flex flex-col divide-y divide-[#111111]/15 pr-8">
          {col1.map((item) => (
            <TopicCard key={item.topic} item={item} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col divide-y divide-[#111111]/15 pl-8">
          {col2.map((item) => (
            <TopicCard key={item.topic} item={item} />
          ))}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t-2 border-[#111111] py-4 mb-8 flex items-center justify-between">
        <span className="text-[10px] tracking-widest uppercase text-[#111111]/30" style={{ fontFamily: "var(--font-body)" }}>
          GOSSS · Daily Edition
        </span>
        <span className="text-[10px] tracking-widest uppercase text-[#111111]/30" style={{ fontFamily: "var(--font-body)" }}>
          20 minutes · every day
        </span>
      </footer>

    </div>
  );
}

function TopicCard({ item }) {
  const accent = {
    emerald: "#1a6640", purple: "#6b21a8", orange: "#b45309",
    red:     "#991b1b", blue:   "#1e40af", cyan:   "#0e7490",
  }[item.color];

  return (
    <Link href={`/topic/${encodeURIComponent(item.topic)}`}>
      <div className="group py-6 cursor-pointer">

        {/* Section label — like a newspaper section tag */}
        <div className="flex items-center gap-2 mb-3">
          <span
            style={{ backgroundColor: accent }}
            className="text-[9px] font-bold uppercase tracking-[0.2em] text-white px-2 py-0.5"
          >
            {item.emoji} {item.topic}
          </span>
        </div>

        {/* Briefing as lede paragraph */}
        <p
          style={{ fontFamily: "var(--font-body)" }}
          className="text-[15px] leading-relaxed text-[#111111]/75 group-hover:text-[#111111] transition-colors"
        >
          {item.briefing}
        </p>

        {/* Read more link */}
        <div className="mt-3 flex items-center gap-3">
          {item.hasArticle && (
            <span className="text-[10px] uppercase tracking-wider text-[#111111]/30 border border-[#111111]/15 px-2 py-0.5">
              Article
            </span>
          )}
          {item.hasVideo && (
            <span className="text-[10px] uppercase tracking-wider text-[#111111]/30 border border-[#111111]/15 px-2 py-0.5">
              Video
            </span>
          )}
        </div>

      </div>
    </Link>
  );
}
