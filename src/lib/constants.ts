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

// 무료 템플릿 제공 마감일 (2026년 4월 30일 자정 KST)
export const TEMPLATE_DEADLINE = new Date("2026-04-30T00:00:00+09:00");

export function isDeadlinePassed(deadline: Date = TEMPLATE_DEADLINE): boolean {
  return new Date().getTime() >= deadline.getTime();
}

// =============================================================================
// TIERED PRICING - 4주 정기 멘토링
// =============================================================================

// 수동 관리: 슬롯 판매 시 이 값을 변경 (1-5, 6 = sold out)
export const CURRENT_PRICING_SLOT = 4;

export const PRICING_TIERS: PricingTier[] = [
  { slot: 1, price: 400000, priceDisplay: "₩400,000", status: "sold" },
  { slot: 2, price: 400000, priceDisplay: "₩400,000", status: "sold" },
  { slot: 3, price: 500000, priceDisplay: "₩500,000", status: "sold" },
  { slot: 4, price: 500000, priceDisplay: "₩500,000", status: "current" },
  { slot: 5, price: 600000, priceDisplay: "₩600,000", status: "upcoming" },
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
    id: "monthly",
    name: "4주 정기 멘토링",
    nameEn: "4-Week Program",
    price: 500000,
    priceDisplay: "50만원",
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
    value: 15,
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
  participants: 18,
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
// HUB PAGE DATA — 제품 허브 라우팅용
// PRODUCTS (위): 멘토링 가격 티어
// PRODUCT_CARDS (아래): 허브 페이지 제품 카드 (라우팅/소개용)
// =============================================================================

export const PRODUCT_CARDS = [
  {
    id: "mentoring",
    name: "1:1 멘토링",
    tagline: "Agentic Engineer로 성장하는 1:1 도제 과정",
    description: "· 제출→피드백→수정 루프로 판단을 훈련\n· 개별 상황에 맞춘 훈련 설계\n· 멘토의 관점을 곁에서 배우는 도제 관계",
    metric: { value: "", label: "" },
    cta: { text: "자세히 보기", href: "/mentoring" },
    isExternal: false,
    posterImage: "/assets/poster-mentoring.png",
    posterGlow: "radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, transparent 70%)",
  },
  {
    id: "agentic30",
    name: "Agentic30",
    tagline: "30일 안에 제품을 세상에 내놓는 훈련",
    description: "· 문제 선택부터 출시까지 30일간 전주기 훈련\n· 혼자 만드는 엔지니어를 위한 실행 루프\n· 실전 프로젝트로 판단력을 단련",
    metric: { value: "", label: "" },
    cta: { text: "시작하기", href: "https://agentic30.app" },
    isExternal: true,
    posterImage: "/assets/poster-agentic30.png",
    posterGlow: "radial-gradient(circle at center, rgba(255, 107, 53, 0.15) 0%, transparent 70%)",
  },
  {
    id: "league",
    name: "Agentic League",
    tagline: "AI 역량 훈련 그리고 증명",
    description: "· LeetCode 스타일 Agentic Engineer 훈련\n· AI 도구 활용 능력을 실전 문제로 단련\n· 자신의 훈련을 증명하는 포트폴리오",
    metric: { value: "Coming Soon", label: "" },
    cta: { text: "대기자 등록", href: "#league-waitlist" },
    isExternal: false,
    isComingSoon: true,
    posterImage: "/assets/poster-league.png",
    posterGlow: "radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, transparent 70%)",
  },
];

export const GARAGE_INFO = {
  name: "Agentic Garage Seoul",
  tagline: "동료 사이에서 훈련하는 자리",
  description: "혼자 만드는 엔지니어가 모여 판단을 나누는 오프라인 훈련장.\n실행을 보여주고, 질문받고, 서로의 지평을 넓힙니다.",
  nextEvent: {
    name: "Agentic Garage Seoul #1",
    date: "2026년 4월 22일 (수) 오후 3:00 ~ 5:00",
    location: "서울 마포구 공덕역 부근",
    locationNote: "상세 장소는 참가 확정자에게 안내",
    price: "참가 예약비 ₩10,000 (참석 시 반환)",
    capacity: "5~10명 소규모",
  },
  targetAudience: [
    "혼자 제품을 진지하게 만들고 있는 전업 1인 개발자",
    "AI 코딩 도구(Claude Code, Codex 등)를 활용하는 분",
    "유저 확보·수익화 단계에서 막히는 분",
  ],
  sessionStructure: [
    { duration: "30분", activity: "체크인 & 공유" },
    { duration: "90분", activity: "솔로 워킹" },
    { duration: "30분", activity: "랩업 & 데모" },
  ],
  poweredBy: "PostHog",
  ctaUrl: "https://lu.ma/agentic_garage",
  posterImage: "/assets/agentic-garage-poster.png",
} as const;

// =============================================================================
// FRAMEWORK - 5대 역량 (랜딩에서는 노출 X, /framework 페이지 전용)
// =============================================================================

export const FRAMEWORK_COMPETENCIES = [
  {
    id: "definition",
    ko: "문제 정의력",
    en: "Definition",
    summary: "풀어야 할 문제를 스스로 골라내고, 그 범위를 또렷이 정의하는 힘.",
  },
  {
    id: "command",
    ko: "주도력",
    en: "Command",
    summary: "AI와 도구를 방향 있게 다루어, 결과를 의도한 방향으로 이끌어가는 힘.",
  },
  {
    id: "clout",
    ko: "영향력",
    en: "Clout",
    summary: "자신의 선택과 결과를 타인에게 전달하고, 설득으로 이어가는 힘.",
  },
  {
    id: "responsibility",
    ko: "책임감",
    en: "Responsibility",
    summary: "미완의 결과도 자신의 것으로 껴안고, 다음을 다시 설계하는 태도.",
  },
  {
    id: "adaptability",
    ko: "적응력",
    en: "Adaptability",
    summary: "변하는 환경에서 전제를 다시 세우고, 축적된 판단을 재배열하는 힘.",
  },
] as const;

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
