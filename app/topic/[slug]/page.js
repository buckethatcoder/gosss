import Link from "next/link";
import { getDailyBriefing, fetchTopicContent } from "../../../lib/briefing";
import ContentCard from "../../components/ContentCard";

export const dynamic = "force-dynamic";

export default async function TopicPage({ params }) {
  const { slug } = await params;
  const topic = decodeURIComponent(slug);
  const [briefings, { article, video }] = await Promise.all([
    getDailyBriefing(),
    fetchTopicContent(topic),
  ]);
  const item = briefings.find(b => b.topic === topic);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EB]">
        <p className="text-[#111111]/40 text-sm">Topic not found.</p>
      </div>
    );
  }

  const accentMap = {
    emerald: "#1a6640", purple: "#6b21a8", orange: "#b45309",
    red:     "#991b1b", blue:   "#1e40af", cyan:   "#0e7490", yellow: "#854d0e",
  };
  const accent = accentMap[item.color];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col max-w-3xl mx-auto px-6">

      {/* Masthead */}
      <header className="animate-fade-up pt-10 pb-4 flex flex-col items-center gap-1 border-b-4 border-[#111111]">
        <Link href="/">
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 900 }} className="text-5xl tracking-tight text-[#111111] leading-none hover:opacity-70 transition-opacity cursor-pointer">
            GOSSS
          </h1>
        </Link>
        <div className="w-full flex items-center justify-between pt-2 text-[11px] text-[#111111]/40">
          <Link href="/" className="hover:text-[#111111]/70 transition-colors">← All Topics</Link>
          <span>{today}</span>
        </div>
      </header>

      <main className="flex-1 py-10 flex flex-col gap-8 animate-fade-up-delay">

        {/* Article header — like a newspaper story */}
        <div className="flex flex-col gap-4 border-b border-[#111111]/15 pb-8">
          <span
            style={{ backgroundColor: accent }}
            className="self-start text-[9px] font-bold uppercase tracking-[0.2em] text-white px-2 py-0.5"
          >
            {item.emoji} {item.topic}
          </span>

          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700 }} className="text-4xl leading-tight text-[#111111]">
            Today's Brief
          </h2>

          <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic" }} className="text-base text-[#111111]/60 leading-relaxed border-l-2 pl-4" style={{ borderColor: accent, fontFamily: "var(--font-body)", fontStyle: "italic" }}>
            {item.briefing}
          </p>
        </div>

        {/* Content */}
        <ContentCard
          article={article}
          video={video}
          accent={accent}
          topic={item.topic}
        />

      </main>

      <footer className="border-t-2 border-[#111111] py-4 mb-8 flex items-center justify-between">
        <span className="text-[10px] tracking-widest uppercase text-[#111111]/30">
          GOSSS · Daily Edition
        </span>
        <span className="text-[10px] tracking-widest uppercase text-[#111111]/30">
          20 minutes · every day
        </span>
      </footer>

    </div>
  );
}
