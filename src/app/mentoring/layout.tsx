import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "멘토링 | 옥토버 아카데미 — Agentic Engineer 취업/이직",
  description:
    "AI 시대 개발자 취업/이직. 제출 → 피드백 → 수정 → 재제출 루프로 V5 이력서 완성. 서류 통과율 78%, 면접 전환 4.2배.",
  openGraph: {
    title: "멘토링 | 옥토버 아카데미 — Agentic Engineer 취업/이직",
    description:
      "AI 시대 개발자 취업/이직. 제출 → 피드백 → 수정 → 재제출 루프로 V5 이력서 완성.",
    type: "website",
  },
};

export default function MentoringLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
