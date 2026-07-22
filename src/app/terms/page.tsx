import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { TERMS_DOCUMENT } from "@/lib/legal";

export const metadata: Metadata = {
  title: "이용약관 | 옥토버 아카데미",
  description: "옥토버 아카데미 서비스 이용약관입니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalDocumentPage document={TERMS_DOCUMENT} />;
}
