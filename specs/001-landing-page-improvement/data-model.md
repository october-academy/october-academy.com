# Data Model: 옥토버 코드 랜딩 페이지 개선

**Feature Branch**: `001-landing-page-improvement`
**Date**: 2026-01-02
**Status**: Complete

## Overview

This is a static landing page. All data is hardcoded in TypeScript constants. No database or API integration required.

## Type Definitions

### Product (상품)

```typescript
interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  priceDisplay: string;
  duration: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaUrl: string;
  ctaEnabled: boolean;
  isPopular?: boolean;
  badge?: string;
}
```

**Instances**:
```typescript
const PRODUCTS: Product[] = [
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
      "질문 무제한 (상담 중)"
    ],
    ctaText: "상담 신청하기",
    ctaUrl: "https://forms.google.com/...", // TODO: 실제 URL
    ctaEnabled: true
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
      "무제한 복습"
    ],
    ctaText: "1월 중 오픈 예정",
    ctaUrl: "https://inflearn.com/...", // TODO: 실제 URL
    ctaEnabled: false,
    badge: "오픈 예정"
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
      "지원 전략 수립"
    ],
    ctaText: "상담 신청하기",
    ctaUrl: "https://forms.google.com/...", // TODO: 실제 URL
    ctaEnabled: true,
    isPopular: true
  }
];
```

### Metric (성과 지표)

```typescript
interface Metric {
  id: string;
  value: number;
  displayValue: string;
  unit: string;
  label: string;
  description?: string;
}
```

**Instances**:
```typescript
const METRICS: Metric[] = [
  {
    id: "hires",
    value: 14,
    displayValue: "14+",
    unit: "명",
    label: "합격자",
    description: "현재까지 합격한 멘티 수"
  },
  {
    id: "companies",
    value: 12,
    displayValue: "12",
    unit: "개",
    label: "합격 기업",
    description: "멘티들이 합격한 기업 수"
  },
  {
    id: "pass-rate",
    value: 78,
    displayValue: "78%",
    unit: "%",
    label: "서류 통과율"
  },
  {
    id: "interview-rate",
    value: 4.2,
    displayValue: "4.2x",
    unit: "배",
    label: "면접 전환"
  }
];
```

### ChangeMetric (변화율 데이터)

```typescript
interface ChangeMetric {
  id: string;
  label: string;
  before: number;
  after: number;
  changePercent: number;
  displayChange: string;
}
```

**Instances**:
```typescript
const CHANGE_METRICS: ChangeMetric[] = [
  {
    id: "applications",
    label: "지원 수",
    before: 3,
    after: 23,
    changePercent: 665,
    displayChange: "+665%"
  },
  {
    id: "response-rate",
    label: "회신율",
    before: 8,
    after: 42,
    changePercent: 425,
    displayChange: "+425%"
  },
  {
    id: "interview-conversion",
    label: "면접 전환",
    before: 3,
    after: 40,
    changePercent: 1233,
    displayChange: "+1233%"
  }
];
```

### FeedbackPerspective (피드백 관점)

```typescript
interface FeedbackPerspective {
  id: string;
  name: string;
  icon: string; // Emoji or icon class
  description: string;
  examples: string[];
}
```

**Instances**:
```typescript
const FEEDBACK_PERSPECTIVES: FeedbackPerspective[] = [
  {
    id: "format",
    name: "문서 형식",
    icon: "📄",
    description: "읽기 쉽고 스캔하기 좋은 구조인가",
    examples: ["단락 길이", "불릿 포인트 구조", "공백 활용"]
  },
  {
    id: "technical",
    name: "기술 검증",
    icon: "🔧",
    description: "기술 스택과 역량이 명확한가",
    examples: ["기술 키워드 배치", "프로젝트 기술 설명", "트러블슈팅 사례"]
  },
  {
    id: "quantification",
    name: "수치 증명",
    icon: "📊",
    description: "성과가 구체적 숫자로 증명되는가",
    examples: ["성능 개선 %", "비용 절감액", "처리량 증가"]
  },
  {
    id: "soft-skills",
    name: "소프트 스킬",
    icon: "🤝",
    description: "협업과 커뮤니케이션 역량이 보이는가",
    examples: ["팀 협업 사례", "갈등 해결", "멘토링 경험"]
  },
  {
    id: "business-impact",
    name: "비즈니스 임팩트",
    icon: "💰",
    description: "비즈니스 가치 기여가 드러나는가",
    examples: ["매출 기여", "사용자 증가", "비용 절감"]
  }
];
```

### Principle (원칙)

```typescript
interface Principle {
  id: string;
  name: string;
  shortName: string;
  description: string;
  benefit: string;
}
```

**Instances**:
```typescript
const PRINCIPLES: Principle[] = [
  {
    id: "no-perfection",
    name: "완벽 금지",
    shortName: "80%면 제출",
    description: "완벽해질 때까지 기다리면 영원히 시작 못합니다",
    benefit: "빠른 피드백 → 빠른 개선"
  },
  {
    id: "must-submit",
    name: "제출 필수",
    shortName: "매주 과제",
    description: "매주 과제를 제출해야 다음 단계로 진행합니다",
    benefit: "데드라인이 실력을 만듭니다"
  },
  {
    id: "rejection-data",
    name: "거절=데이터",
    shortName: "거절도 자산",
    description: "불합격도 다음 지원을 위한 귀중한 데이터입니다",
    benefit: "거절에서 배운 것이 합격으로 연결"
  }
];
```

### FAQItem (FAQ 항목)

```typescript
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}
```

**Instances**:
```typescript
const FAQ_ITEMS: FAQItem[] = [
  {
    id: "beginner",
    question: "주니어/신입도 참여할 수 있나요?",
    answer: "네, 1~5년차 개발자를 주요 대상으로 합니다. 신입이라도 프로젝트 경험이 있다면 충분히 참여 가능합니다.",
    category: "eligibility"
  },
  {
    id: "refund",
    question: "환불 정책은 어떻게 되나요?",
    answer: "첫 번째 세션 전까지 100% 환불 가능합니다. 첫 세션 이후에는 진행된 세션 수를 제외한 금액을 환불해드립니다.",
    category: "payment"
  },
  {
    id: "time-commitment",
    question: "주당 얼마나 시간을 투자해야 하나요?",
    answer: "4주 프로그램 기준 주당 5~10시간을 권장합니다. 1:1 멘토링 1시간 + 과제 작성 및 수정 4~9시간입니다.",
    category: "program"
  },
  {
    id: "guarantee",
    question: "합격을 보장하나요?",
    answer: "합격을 보장하지는 않습니다. 하지만 78%의 서류 통과율과 4.2배의 면접 전환율이 프로그램의 효과를 증명합니다.",
    category: "results"
  }
];
```

### WeeklyCurriculum (주차별 커리큘럼)

```typescript
interface WeekContent {
  week: number;
  title: string;
  focus: string;
  deliverables: string[];
}
```

**Instances**:
```typescript
const WEEKLY_CURRICULUM: WeekContent[] = [
  {
    week: 1,
    title: "현황 분석 & V0 작성",
    focus: "현재 이력서 분석, 템플릿 기반 V0 작성",
    deliverables: ["현황 분석 리포트", "V0 이력서"]
  },
  {
    week: 2,
    title: "V1~V3 반복 수정",
    focus: "5가지 관점 피드백 → 수정 → 재피드백",
    deliverables: ["V1~V3 이력서", "피드백 반영 기록"]
  },
  {
    week: 3,
    title: "면접 답변 프레임",
    focus: "자주 묻는 질문별 답변 프레임 완성",
    deliverables: ["면접 답변 문서", "포트폴리오 피드백"]
  },
  {
    week: 4,
    title: "V4~V5 & 지원 전략",
    focus: "최종 이력서 완성, 타겟 기업 지원 전략",
    deliverables: ["V5 최종 이력서", "지원 전략 문서"]
  }
];
```

### CompanyName (합격 기업)

```typescript
interface Company {
  name: string;
  category: 'tech' | 'fintech' | 'commerce' | 'other';
}
```

**Instances**:
```typescript
const COMPANIES: Company[] = [
  { name: "쿠팡", category: "commerce" },
  { name: "토스", category: "fintech" },
  { name: "네이버", category: "tech" },
  { name: "오늘의집", category: "commerce" },
  { name: "크림", category: "commerce" },
  { name: "강남언니", category: "other" },
  { name: "마이리얼트립", category: "other" },
  { name: "리디", category: "tech" }
];
```

## Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        Landing Page                              │
├─────────────────────────────────────────────────────────────────┤
│ Hero Section                                                     │
│   └── Loop Visualization (V0 → V1 → ... → V5)                   │
├─────────────────────────────────────────────────────────────────┤
│ Metrics Section                                                  │
│   ├── Metric[] (합격자, 기업, 통과율, 전환율)                     │
│   └── ChangeMetric[] (before/after 데이터)                       │
├─────────────────────────────────────────────────────────────────┤
│ Target Audience Section                                          │
│   └── Static content (직군, 경력, 고통점)                        │
├─────────────────────────────────────────────────────────────────┤
│ Feedback Section                                                 │
│   └── FeedbackPerspective[] (5가지 관점)                         │
├─────────────────────────────────────────────────────────────────┤
│ Principles Section                                               │
│   └── Principle[] (3가지 원칙)                                   │
├─────────────────────────────────────────────────────────────────┤
│ Pricing Section                                                  │
│   └── Product[] (3가지 상품)                                     │
│       └── WeeklyCurriculum[] (4주 프로그램용)                     │
├─────────────────────────────────────────────────────────────────┤
│ Companies Section                                                │
│   └── Company[] (합격 기업 목록)                                 │
├─────────────────────────────────────────────────────────────────┤
│ FAQ Section                                                      │
│   └── FAQItem[] (질문/답변)                                      │
└─────────────────────────────────────────────────────────────────┘
```

## State Management

All data is static. No dynamic state management required except:

1. **Inflearn availability flag**: `const INFLEARN_LIVE = false;`
2. **FAQ accordion state**: Native `<details>` element handles this
3. **Animation triggers**: Framer Motion `useInView` for scroll-triggered animations
4. **Countdown timer**: Client-side state for countdown display

## Validation Rules

Not applicable - all data is hardcoded and type-checked at compile time.

## Notes

- All prices are in KRW
- All text content is in Korean
- URLs for CTAs are placeholders (marked with `// TODO`)
- Company list can be updated without code changes if moved to config
