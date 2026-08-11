import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LeetRep — Remember what you solve",
  description:
    "Log LeetCode problems, journal why they work, and return on a spaced schedule with recall and re-solve reps.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${barlowCondensed.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {/*
          THESIS: Solving once is not learning — today's reps line up like lanes; sign in is the starting block.
          OWN-WORLD: Staggered Start — asphalt charcoal, off-white rail, emerald/orange/cobalt lane accents, condensed meet-program type, sharp steel edges.
          STORY: Visitor sees the V1 loop and a synthetic Today's Reps strip, believes retention needs return, signs in or creates an account.
          FIRST VIEWPORT: Meet Program split — left course map + reps demo; right full-height auth rail; Lane Board wordmark (Leet white / Rep lime italic).
          FORM: Staggered Start (grounded #7), seed 5c626fe9; composition Meet Program + A wordmark.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        {children}
      </body>
    </html>
  );
}
