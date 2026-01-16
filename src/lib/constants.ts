import type {
  Product,
  Metric,
  ChangeMetric,
  Principle,
  FAQItem,
  WeekContent,
  Company,
  PlaceholderData,
  PricingTier,
  YouTubeVideo,
} from "./types";

// =============================================================================
// DATA CONSTANTS
// =============================================================================

// Toggle this to true when Inflearn course launches
export const INFLEARN_LIVE = false;

// =============================================================================
// COMMUNITY - 비공개 단톡방
// =============================================================================

export const COMMUNITY = {
  maxMembers: 100,
  currentMembers: 1, // 수동 업데이트: 현재 참여자 수
  templateUrl:
    "https://drive.google.com/drive/folders/1VBJrhcU-jRULmgkReH6xd2TDUeMTQYov",
  openChatUrl: "https://open.kakao.com/o/pUJ4dbai",
} as const;

export function getCommunityRemainingSeats(): number {
  return Math.max(0, COMMUNITY.maxMembers - COMMUNITY.currentMembers);
}

export function getCommunityProgress(): number {
  return (COMMUNITY.currentMembers / COMMUNITY.maxMembers) * 100;
}

// =============================================================================
// DEADLINES
// =============================================================================

// 무료 템플릿 제공 마감일 (2026년 1월 31일 자정 KST)
export const TEMPLATE_DEADLINE = new Date("2026-01-31T00:00:00+09:00");

export function isDeadlinePassed(deadline: Date = TEMPLATE_DEADLINE): boolean {
  return new Date().getTime() >= deadline.getTime();
}

// =============================================================================
// TIERED PRICING - 4주 정기 멘토링
// =============================================================================

// 수동 관리: 슬롯 판매 시 이 값을 변경 (1-5, 6 = sold out)
export const CURRENT_PRICING_SLOT = 2;

export const PRICING_TIERS: PricingTier[] = [
  { slot: 1, price: 400000, priceDisplay: "₩400,000", status: "sold" },
  { slot: 2, price: 500000, priceDisplay: "₩500,000", status: "current" },
  { slot: 3, price: 600000, priceDisplay: "₩600,000", status: "upcoming" },
  { slot: 4, price: 700000, priceDisplay: "₩700,000", status: "upcoming" },
  { slot: 5, price: 800000, priceDisplay: "₩800,000", status: "upcoming" },
];

export function getTiersWithStatus(): PricingTier[] {
  return PRICING_TIERS.map((tier) => ({
    ...tier,
    status:
      tier.slot < CURRENT_PRICING_SLOT
        ? "sold"
        : tier.slot === CURRENT_PRICING_SLOT
          ? "current"
          : "upcoming",
  }));
}

export function getCurrentPrice(): PricingTier | null {
  if (CURRENT_PRICING_SLOT > 5) return null; // sold out
  return getTiersWithStatus().find((t) => t.status === "current") || null;
}

export function getNextPrice(): PricingTier | null {
  const nextSlot = CURRENT_PRICING_SLOT + 1;
  if (nextSlot > 5) return null;
  return PRICING_TIERS.find((t) => t.slot === nextSlot) || null;
}

export function getRemainingSeats(): number {
  return Math.max(0, 5 - CURRENT_PRICING_SLOT + 1);
}

export const PRODUCTS: Product[] = [
  {
    id: "one-time",
    name: "1회 멘토링",
    nameEn: "One-time Mentoring",
    price: 30000,
    priceDisplay: "3만원",
    duration: "30분",
    description: "빠르게 피드백 받고 싶은 분",
    features: [
      "이력서 1회 피드백",
      "30분 화상 상담",
      "질문 무제한 (상담 중)",
    ],
    cta: {
      text: "상담 신청하기",
      url: "https://mentoring.inflearn.com/mentors/2754",
    },
  },
  {
    id: "inflearn",
    name: "[인프런] 이력서 강의",
    nameEn: "Inflearn Course",
    price: 33000,
    priceDisplay: "3.3만원",
    duration: "2시간+",
    description: "스스로 준비하고 싶은 분",
    features: [
      "V0→V5 프레임워크 강의",
      "이력서 템플릿 제공",
      "면접 답변 프레임",
      "무제한 복습",
    ],
    cta: {
      text: "이력서 강의 1월 중 오픈 예정",
      url: "https://inflearn.com/",
      badge: "오픈 예정",
    },
  },
  {
    id: "monthly",
    name: "4주 정기 멘토링",
    nameEn: "4-Week Program",
    price: 400000,
    priceDisplay: "40만원",
    duration: "1개월",
    description: "확실하게 합격하고 싶은 분",
    features: [
      "매주 1:1 멘토링 (4회)",
      "이력서 무제한 피드백",
      "면접 답변 프레임 완성",
      "포트폴리오 컨설팅",
      "지원 전략 수립",
    ],
    cta: {
      text: "상담 신청하기",
      url: "https://open.kakao.com/o/sXxBmmoh",
    },
    isPopular: true,
  },
];

export const METRICS: Metric[] = [
  {
    id: "hires",
    value: 14,
    unit: "명",
    label: "IT 기업 최종 합격자",
    prefix: "+",
    description: "현재까지 합격한 멘티 수",
  },
  {
    id: "companies",
    value: 12,
    unit: "개",
    label: "합격 기업",
    description: "멘티들이 합격한 기업 수",
  },
  {
    id: "pass-rate",
    value: 78,
    unit: "%",
    label: "서류 통과율",
  },
  {
    id: "interview-rate",
    value: 4.2,
    unit: "배",
    label: "면접 전환",
    decimals: 1,
  },
  {
    id: "coaching",
    value: 100,
    unit: "명",
    label: "누적 코칭 인원",
    prefix: "+",
  },
];

export const CHANGE_METRICS: ChangeMetric[] = [
  {
    id: "applications",
    label: "지원 수",
    before: 1,
    after: 5,
    changePercent: 400,
    displayChange: "+400%",
  },
  {
    id: "document-pass-rate",
    label: "서류 합격율",
    before: 10,
    after: 30,
    changePercent: 200,
    displayChange: "+200%",
  },
  {
    id: "final-acceptance",
    label: "최종 합격율 (취준 6개월 이내)",
    before: 0,
    after: 100,
    changePercent: 100,
    displayChange: "100%",
  },
];

export const PRINCIPLES: Principle[] = [
  {
    id: "no-perfection",
    name: "완벽 금지",
    shortName: "80%면 제출",
    description: "완벽해질 때까지 기다리면 영원히 시작 못합니다",
    benefit: "빠른 피드백 → 빠른 개선",
  },
  {
    id: "must-submit",
    name: "제출 필수",
    shortName: "매주 과제",
    description: "매주 과제를 제출해야 다음 단계로 진행합니다",
    benefit: "데드라인이 실력을 만듭니다",
  },
  {
    id: "rejection-data",
    name: "거절=데이터",
    shortName: "거절도 자산",
    description: "불합격도 다음 지원을 위한 귀중한 데이터입니다",
    benefit: "거절에서 배운 것이 합격으로 연결",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "beginner",
    question: "주니어/신입도 참여할 수 있나요?",
    answer:
      "네, 1~5년차 개발자를 주요 대상으로 합니다. 신입이라도 프로젝트 경험이 있다면 충분히 참여 가능합니다.",
    category: "eligibility",
  },
  {
    id: "refund",
    question: "환불 정책은 어떻게 되나요?",
    answer:
      "첫 번째 세션까지 들어보고 결정하세요. 불만족 시 100% 환불해드립니다.",
    category: "payment",
  },
  {
    id: "time-commitment",
    question: "주당 얼마나 시간을 투자해야 하나요?",
    answer:
      "4주 프로그램 기준 주당 5~10시간을 권장합니다. 1:1 멘토링 1시간 + 과제 작성 및 수정 4~9시간입니다.",
    category: "program",
  },
  {
    id: "guarantee",
    question: "합격을 보장하나요?",
    answer:
      "합격을 보장하지는 않습니다. 하지만 78%의 서류 통과율과 4.2배의 면접 전환율이 프로그램의 효과를 증명합니다.",
    category: "results",
  },
];

export const WEEKLY_CURRICULUM: WeekContent[] = [
  {
    week: 1,
    title: "현황 분석 & V0 작성",
    focus: "현재 이력서 분석, 템플릿 기반 V0 작성",
    deliverables: ["현황 분석 리포트", "V0 이력서"],
  },
  {
    week: 2,
    title: "V1~V3 반복 수정",
    focus: "5가지 관점 피드백 → 수정 → 재피드백",
    deliverables: ["V1~V3 이력서", "피드백 반영 기록"],
  },
  {
    week: 3,
    title: "면접 답변 프레임",
    focus: "자주 묻는 질문별 답변 프레임 완성",
    deliverables: ["면접 답변 문서", "포트폴리오 피드백"],
  },
  {
    week: 4,
    title: "V4~V5 & 지원 전략",
    focus: "최종 이력서 완성, 타겟 기업 지원 전략",
    deliverables: ["V5 최종 이력서", "지원 전략 문서"],
  },
];

export const COMPANIES: Company[] = [
  { name: "쿠팡", category: "commerce" },
  { name: "토스", category: "fintech" },
  { name: "네이버", category: "tech" },
  { name: "오늘의집", category: "commerce" },
  { name: "크림", category: "commerce" },
  { name: "강남언니", category: "other" },
  { name: "마이리얼트립", category: "other" },
  { name: "리디", category: "tech" },
];

// 플레이스홀더 데이터 (나중에 실제 데이터로 교체)
// seats는 CURRENT_PRICING_SLOT과 동기화됨
export const PLACEHOLDER_DATA: PlaceholderData = {
  participants: 28,
  satisfaction: 5.0,
  interviewRate: 425,
  seats: { current: CURRENT_PRICING_SLOT, total: 5 },
  companies: ["토스", "카카오", "네이버", "당근"],
};

// =============================================================================
// YOUTUBE VIDEOS - 무료 리드 자료
// =============================================================================

export const YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: "3aokY48UZkk",
    title: "N사 면접관이 생각하는 '이런 개발자는 안 뽑아요'",
    description: "채용자 관점에서 본 탈락 사유",
    views: "15만회",
    uploadedAgo: "1년 전",
  },
  {
    id: "b4Ro_2cK9V8",
    title: "신입이 어떻게 대규모 트래픽 처리 경험을 쌓아요? ㅁ_ㅁ;;",
    description: "경험이 없어도 증명하는 방법",
    views: "8.6만회",
    uploadedAgo: "2년 전",
  },
  {
    id: "ilnILlxY8gI",
    title: "신입 개발자는 '성장 가능성'을 본다고?",
    description: "면접관이 실제로 보는 것",
    views: "7.9만회",
    uploadedAgo: "1년 전",
  },
];

export function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

// =============================================================================
// FOOTER - 사업자 정보
// =============================================================================

export const BUSINESS_INFO = {
  companyName: "옥토버 아카데미",
  ceo: "유호균",
  privacyOfficer: "유호균",
  businessNumber: "607-71-00645",
  ecommerceNumber: "2025-경기김포-0444",
  address: "경기도 김포시 김포한강9로 79, 4층 401-85A호(구래동)",
  phone: "070-4571-5314",
  email: "admin@october-academy.com",
  copyright: "© 2026 옥토버 아카데미. All rights reserved.",
} as const;

export const FOOTER_LINKS = {
  legal: [
    { label: "이용약관", href: "https://zettalyst.notion.site/18171085f62f80b69250dd138d779dcc" },
    { label: "개인정보처리방침", href: "https://zettalyst.notion.site/18171085f62f80ada589ce89aaa57312" },
  ],
} as const;
