import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.october-academy.com"),
  title: "옥토버 아카데미 — Agentic Engineer 양성 과정",
  description: "AI 시대, 전통 개발자에서 Agentic Engineer로. 멘토링, Agentic30, Agentic League로 판단력과 실행력을 키웁니다.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "옥토버 아카데미 — Agentic Engineer 양성 과정",
    description: "AI 시대, 전통 개발자에서 Agentic Engineer로. 멘토링, Agentic30, Agentic League로 판단력과 실행력을 키웁니다.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "옥토버 아카데미",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={jetbrainsMono.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
