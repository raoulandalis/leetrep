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
          THESIS: Solving once is not learning — journal the insight, return for today's reps; sign in to start.
          OWN-WORLD: Journal Board — quiet charcoal field with soft depth (no ruled lines), off-white clipboard rail, emerald/orange/cobalt accents, condensed program type, sharp edges.
          STORY: Visitor sees the V1 loop as stamped entries beside a framed synthetic dashboard preview, believes retention needs return, signs in or creates an account.
          FIRST VIEWPORT: Meet Program split — left thesis + steps|dashboard preview; right full-height auth rail; wordmark Leet white / Rep emerald italic.
          FORM: Journal Board polish on Meet Program split; seed 5c626fe9 lineage retained for palette/layout only.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        {children}
      </body>
    </html>
  );
}
