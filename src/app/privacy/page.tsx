import type { Metadata } from "next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";
import { PRIVACY_DOCUMENT } from "@/lib/legal";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 옥토버 아카데미",
  description: "옥토버 아카데미 개인정보처리방침입니다.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalDocumentPage document={PRIVACY_DOCUMENT} />;
}
