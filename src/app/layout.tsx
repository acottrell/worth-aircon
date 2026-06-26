import type { Metadata } from "next";
import { Geist_Mono, Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Worth Aircon? | Is air conditioning worth it where you live?",
  description:
    "Enter your UK postcode to see how many nights per year are too warm to sleep comfortably. Based on ten years of real temperature data. Independent and free.",
  keywords: [
    "air conditioning UK",
    "is aircon worth it",
    "hot nights UK",
    "UK heatwave",
    "portable aircon UK",
    "too hot to sleep",
    "tropical nights UK",
  ],
  openGraph: {
    title: "Worth Aircon? | Is air conditioning worth it where you live?",
    description:
      "Enter your UK postcode to see how many nights are too warm to sleep. Ten years of real data. No sales pitch.",
    siteName: "Worth Aircon?",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "https://worthaircon.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
