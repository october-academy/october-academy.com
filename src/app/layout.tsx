import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "./posthog-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.october-academy.com"),
  title: "옥토버 아카데미 — Agentic Engineer 양성 과정",
  description: "AI 시대, 전통 개발자에서 Agentic Engineer로. 멘토링과 실전으로 판단력과 실행력을 키웁니다.",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    other: {
      "naver-site-verification": "308f44e669fab6241de4bb1e6402ae8918796dc6",
    },
  },
  openGraph: {
    title: "옥토버 아카데미 — Agentic Engineer 양성 과정",
    description: "AI 시대, 전통 개발자에서 Agentic Engineer로. 멘토링과 실전으로 판단력과 실행력을 키웁니다.",
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
    <html lang="ko">
      <body className="antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
