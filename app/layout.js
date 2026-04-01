import { Playfair_Display, Libre_Baskerville } from "next/font/google";
import "./globals.css";

// Playfair Display — classic newspaper masthead and headlines
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

// Libre Baskerville — old-style serif for body copy, feels like newsprint
const baskerville = Libre_Baskerville({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "GOSSS",
  description: "20 minutes a day. Every day.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${baskerville.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#F7F3EB] text-[#1C1208]" style={{ fontFamily: "var(--font-body)" }}>
        {children}
      </body>
    </html>
  );
}
