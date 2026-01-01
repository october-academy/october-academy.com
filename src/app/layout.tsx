import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "옥토버 코드 — 취업/이직 합격 루프",
  description: "제출 → 피드백 → 수정 → 재제출. 합격이 나올 수밖에 없는 상태를 만드는 프로그램.",
  openGraph: {
    title: "옥토버 코드 — 취업/이직 합격 루프",
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
    <html lang="ko">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
