import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Will you be mine? 💍❤️",
  description: "I made something special for you… don’t overthink, just answer 💖",
  icons: {
    icon: "/favicon.svg",
  },

  openGraph: {
    title: "Will you be mine? 💍❤️",
    description: "You can’t click NO 😈💖",
    url: "https://love-app-black.vercel.app/", 
    siteName: "Purnendu's Love Game",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Romantic Proposal 💖",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Will you be mine? 💍❤️",
    description: "Try this… but answer honestly 😏💖",
    images: ["/preview.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
