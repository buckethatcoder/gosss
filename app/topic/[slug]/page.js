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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-[#EDE8DF]/30 text-sm">Topic not found.</p>
      </div>
    );
  }

  const accentMap = {
    emerald: "#00FF94", purple: "#C084FC", orange: "#FB923C",
    red:     "#F87171", blue:   "#60A5FA", cyan:   "#22D3EE", yellow: "#FACC15",
  };
  const accent = accentMap[item.color];

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="border-b border-[#EDE8DF]/8 px-12 py-6 flex items-center justify-between animate-fade-up">
        <Link href="/">
          <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl tracking-tight hover:opacity-60 transition-opacity cursor-pointer">
            GOSSS
          </span>
        </Link>
        <Link href="/">
          <span className="text-xs text-[#EDE8DF]/30 tracking-widest uppercase font-light hover:text-[#EDE8DF]/60 transition-colors">
            ← Back
          </span>
        </Link>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-12 py-16 flex flex-col gap-10">

        {/* Topic header */}
        <div className="flex flex-col gap-4 animate-fade-up">
          <span style={{ color: accent }} className="text-[11px] font-semibold uppercase tracking-[0.18em]">
            {item.emoji} {item.topic}
          </span>
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-4xl text-[#EDE8DF] leading-snug">
            Today's brief
          </h1>
          <p className="text-[#EDE8DF]/45 text-[15px] font-light leading-relaxed">
            {item.briefing}
          </p>
        </div>

        <div className="h-px bg-[#EDE8DF]/8" />

        {/* Content */}
        <ContentCard
          article={article}
          video={video}
          accent={accent}
          topic={item.topic}
        />

      </main>

      <footer className="px-12 py-8 text-center">
        <span className="text-xs text-[#EDE8DF]/12 uppercase tracking-[0.2em] font-light">
          20 minutes · every day
        </span>
      </footer>
    </div>
  );
}
