import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "옥토버 아카데미 — 취업/이직 합격 루프",
  description: "제출 → 피드백 → 수정 → 재제출. 합격이 나올 수밖에 없는 상태를 만드는 프로그램.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "옥토버 아카데미 — 취업/이직 합격 루프",
    description: "제출 → 피드백 → 수정 → 재제출. 합격이 나올 수밖에 없는 상태를 만드는 프로그램.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
