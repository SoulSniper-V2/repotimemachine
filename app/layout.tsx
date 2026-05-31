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
  metadataBase: new URL("https://repotimemachine.ai"),
  title: {
    default: "Repo Time Machine",
    template: "%s | Repo Time Machine",
  },
  description:
    "Paste any GitHub repository and get the story of the project. Not commits and code — the documentary.",
  openGraph: {
    type: "website",
    siteName: "Repo Time Machine",
    title: "Repo Time Machine",
    description: "Paste any GitHub repository and get the story of the project.",
    url: "https://repotimemachine.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repo Time Machine",
    description: "Paste any GitHub repository and get the story of the project.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full bg-[#fffdf8] antialiased">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
