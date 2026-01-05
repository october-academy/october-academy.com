// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  priceDisplay: string;
  duration: string;
  description: string;
  features: string[];
  cta: {
    text: string;
    url: string;
    badge?: string;
  };
  isPopular?: boolean;
}

export interface Metric {
  id: string;
  value: number;
  unit: string;
  label: string;
  decimals?: number;
  prefix?: string;
  description?: string;
}

export interface ChangeMetric {
  id: string;
  label: string;
  before: number;
  after: number;
  changePercent: number;
  displayChange: string;
}

export interface Principle {
  id: string;
  name: string;
  shortName: string;
  description: string;
  benefit: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface WeekContent {
  week: number;
  title: string;
  focus: string;
  deliverables: string[];
}

export interface Company {
  name: string;
  category: "tech" | "fintech" | "commerce" | "other";
}

export interface BarChartItem {
  label: string;
  value: number;
  color?: string;
  highlight?: boolean;
  comparisonBadge?: string;
}

export interface PlaceholderData {
  participants: number;
  satisfaction: number;
  interviewRate: number;
  seats: { current: number; total: number };
  companies: string[];
}
