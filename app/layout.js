import { DM_Serif_Display, Sora } from "next/font/google";
import "./globals.css";

// DM Serif Display — for the logo, headlines, and big moments
const dmSerif = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Sora — clean, geometric, warm sans-serif for all body text
// Much more readable than monospace for long-form briefings
const sora = Sora({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata = {
  title: "GOSSS",
  description: "20 minutes a day. Every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0C0C0C] text-[#EDE8DF]" style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
