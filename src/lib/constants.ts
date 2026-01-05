import type {
  Product,
  Metric,
  ChangeMetric,
  Principle,
  FAQItem,
  WeekContent,
  Company,
  PlaceholderData,
} from "./types";

// =============================================================================
// DATA CONSTANTS
// =============================================================================

// Toggle this to true when Inflearn course launches
export const INFLEARN_LIVE = false;

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
    name: "인프런 강의",
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
      text: "1월 중 오픈 예정",
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
    label: "합격자",
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
];

export const CHANGE_METRICS: ChangeMetric[] = [
  {
    id: "applications",
    label: "지원 수",
    before: 3,
    after: 23,
    changePercent: 665,
    displayChange: "+665%",
  },
  {
    id: "response-rate",
    label: "회신율",
    before: 8,
    after: 42,
    changePercent: 425,
    displayChange: "+425%",
  },
  {
    id: "interview-conversion",
    label: "면접 전환",
    before: 3,
    after: 40,
    changePercent: 1233,
    displayChange: "+1233%",
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
      "첫 번째 세션 전까지 100% 환불 가능합니다. 첫 세션 이후에는 진행된 세션 수를 제외한 금액을 환불해드립니다.",
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
export const PLACEHOLDER_DATA: PlaceholderData = {
  participants: 28,
  satisfaction: 5.0,
  interviewRate: 425,
  seats: { current: 1, total: 5 },
  companies: ["토스", "카카오", "네이버", "당근"],
};
