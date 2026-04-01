import Link from "next/link";
import { getDailyBriefing } from "../lib/briefing";

// Tell Next.js to never pre-render this page at build time
// It always fetches fresh data on each request (needs live API keys)
export const dynamic = "force-dynamic";

const accentMap = {
  emerald: "#00FF94",
  purple:  "#C084FC",
  orange:  "#FB923C",
  red:     "#F87171",
  blue:    "#60A5FA",
  cyan:    "#22D3EE",
};

export default async function Home() {
  const briefings = await getDailyBriefing();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <header className="border-b border-[#EDE8DF]/8 px-12 py-6 flex items-center justify-between animate-fade-up">
        <span style={{ fontFamily: "var(--font-display)" }} className="text-2xl tracking-tight">
          GOSSS
        </span>
        <span className="text-xs text-[#EDE8DF]/30 tracking-widest uppercase font-light">
          {today}
        </span>
      </header>

      <main className="flex-1 max-w-2xl w-full mx-auto px-12 py-16 flex flex-col gap-12">

        {/* Hero text */}
        <div className="animate-fade-up flex flex-col gap-3">
          <h1 style={{ fontFamily: "var(--font-display)" }} className="text-5xl text-[#EDE8DF] leading-[1.1]">
            What's happening<br />
            <span style={{ fontStyle: "italic" }}>today?</span>
          </h1>
          <p className="text-[#EDE8DF]/35 text-sm font-light tracking-wide">
            Six topics. Pick one to go deep on.
          </p>
        </div>

        {/* Topic list */}
        <div className="flex flex-col animate-fade-up-delay">
          {briefings.map((item, i) => {
            const accent = accentMap[item.color];
            const slug = encodeURIComponent(item.topic);
            return (
              <Link key={item.topic} href={`/topic/${slug}`}>
                <div
                  className="group relative flex flex-col gap-2.5 py-7 border-b border-[#EDE8DF]/8 cursor-pointer transition-all duration-200 hover:pl-4"
                >
                  {/* Left accent bar — slides in on hover */}
                  <div
                    style={{ backgroundColor: accent }}
                    className="absolute left-0 top-0 w-0.5 h-0 group-hover:h-full transition-all duration-300 ease-out"
                  />

                  {/* Topic label */}
                  <div className="flex items-center justify-between">
                    <span
                      style={{ color: accent }}
                      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
                    >
                      {item.emoji} {item.topic}
                    </span>
                  </div>

                  {/* Briefing text */}
                  <p className="text-[#EDE8DF]/60 text-[15px] leading-relaxed font-light group-hover:text-[#EDE8DF]/85 transition-colors">
                    {item.briefing}
                  </p>

                  {/* Content pills */}
                  <div className="flex gap-2 pt-1">
                    {item.hasArticle && (
                      <span className="text-[10px] uppercase tracking-wider text-[#EDE8DF]/20 border border-[#EDE8DF]/10 px-2.5 py-1 rounded-sm font-medium">
                        Article
                      </span>
                    )}
                    {item.hasVideo && (
                      <span className="text-[10px] uppercase tracking-wider text-[#EDE8DF]/20 border border-[#EDE8DF]/10 px-2.5 py-1 rounded-sm font-medium">
                        Video
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <footer className="px-12 py-8 text-center">
        <span className="text-xs text-[#EDE8DF]/12 uppercase tracking-[0.2em] font-light">
          20 minutes · every day
        </span>
      </footer>
    </div>
  );
}
