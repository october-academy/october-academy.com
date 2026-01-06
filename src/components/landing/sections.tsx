"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { useScrollAnimation } from "@/lib/hooks";
import { AnimatedCounter, TextLogo } from "./ui";
import {
  METRICS,
  COMPANIES,
  FAQ_ITEMS,
  PLACEHOLDER_DATA,
  getTiersWithStatus,
  getCurrentPrice,
  getNextPrice,
  CURRENT_PRICING_SLOT,
  COMMUNITY,
  getCommunityRemainingSeats,
  getCommunityProgress,
  YOUTUBE_VIDEOS,
  getYouTubeThumbnail,
} from "@/lib/constants";
import type { BarChartItem, YouTubeVideo } from "@/lib/types";

// =============================================================================
// SECTION COMPONENTS
// =============================================================================

/**
 * PercentageChangeCard - Large percentage change display (+667%, etc.)
 */
export function PercentageChangeCard({
  label,
  before,
  after,
  unit = "",
}: {
  label: string;
  before: number;
  after: number;
  unit?: string;
}) {
  const { ref, isVisible } = useScrollAnimation();
  const percentChange =
    before === 0
      ? Math.round(after * 100)
      : Math.round(((after - before) / before) * 100);

  return (
    <div
      ref={ref}
      className={`percentage-card-dark p-6 text-center stagger-item ${
        isVisible ? "visible" : ""
      }`}
    >
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div
        className={`font-mono text-4xl md:text-5xl font-bold text-[#FF6B35] mb-4 ${
          isVisible ? "percentage-pop" : "opacity-0"
        }`}
      >
        +<AnimatedCounter end={percentChange} duration={1200} suffix="%" />
      </div>
      <div className="flex items-center justify-center gap-3 text-sm">
        <span className="text-gray-400 font-mono">
          {before}
          {unit}
        </span>
        <span className="text-[#FF6B35] delta-arrow">→</span>
        <span className="text-white font-mono font-bold">
          {after}
          {unit}
        </span>
      </div>
    </div>
  );
}

/**
 * BarChart - Horizontal bar chart component
 */
export function BarChart({
  data,
  isVisible = true,
}: {
  data: BarChartItem[];
  isVisible?: boolean;
}) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, i) => {
        const isHighlight = item.highlight || item.color === "#FF6B35";
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className={isHighlight ? "font-bold text-[#FF6B35]" : ""}>
                {item.label}
              </span>
              <div className="flex items-center gap-2">
                {isHighlight && isVisible && item.comparisonBadge && (
                  <span className="comparison-badge hidden md:inline font-bold">
                    {item.comparisonBadge}
                  </span>
                )}
                <span className={`font-mono ${isHighlight ? "font-bold" : ""}`}>
                  {isVisible ? (
                    <AnimatedCounter
                      end={item.value}
                      duration={1000 + i * 200}
                      suffix="%"
                    />
                  ) : (
                    "0%"
                  )}
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill transition-all duration-1000 ease-out ${
                  isHighlight && isVisible ? "highlight-pulse" : ""
                }`}
                style={{
                  width: isVisible ? `${(item.value / maxValue) * 100}%` : "0%",
                  background: item.color || "#FF6B35",
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * AnimatedBarChart - Wrapper for BarChart with scroll animation
 */
export function AnimatedBarChart({
  data,
}: {
  data: BarChartItem[];
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "visible" : ""}`}
    >
      <div className="brutal-card p-6">
        <h3 className="font-mono text-sm text-gray-600 mb-4">
          이직/취업 준비 실행률
        </h3>
        <BarChart data={data} isVisible={isVisible} />
      </div>
    </div>
  );
}

/**
 * TrustMetrics - Trust indicator cards
 */
export function TrustMetrics() {
  return (
    <div className="trust-metrics-grid">
      {METRICS.map((metric) => (
        <div key={metric.id} className="trust-metric-card">
          <div className="trust-metric-value">
            <AnimatedCounter
              end={metric.value}
              duration={1500}
              decimals={metric.decimals ?? 0}
            />
            <span className="trust-metric-unit">
              {metric.prefix ?? ""}
              {metric.unit}
            </span>
          </div>
          <div className="trust-metric-label">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}

/**
 * PriceComparison - Price comparison table
 */
export function PriceComparison() {
  const currentPrice = getCurrentPrice();
  const priceDisplay = currentPrice?.priceDisplay || "₩500,000";
  const savings = 4000000 - (currentPrice?.price || 500000);
  const savingsDisplay = `₩${savings.toLocaleString()} 절약`;

  return (
    <div className="price-comparison">
      <div className="price-comparison-header">
        <span className="price-comparison-badge">최대 90% 저렴</span>
        <span className="price-comparison-title">
          동일한 주 1회 1시간 멘토링, 10배 가성비
        </span>
      </div>
      <div className="price-comparison-body">
        <div className="price-comparison-row price-comparison-row-dim">
          <div className="price-comparison-label">다른 멘토링 프로그램</div>
          <div className="price-comparison-detail">
            <span>주 1회 1시간 × 4개월</span>
            <span className="price-comparison-calc">
              16회 = <strong>₩4,000,000</strong>
            </span>
          </div>
        </div>
        <div className="price-comparison-divider" />
        <div className="price-comparison-row price-comparison-row-highlight">
          <div className="price-comparison-label">옥토버 코드</div>
          <div className="price-comparison-detail">
            <span className="price-comparison-feature">
              주 1회 1시간 × 1개월 + 무제한 피드백
            </span>
            <div className="price-comparison-price">
              <span className="font-mono text-3xl font-bold text-[#FF6B35]">
                {priceDisplay}
              </span>
              <span className="price-comparison-saving">{savingsDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SeatProgress - Remaining seats progress bar (Legacy - for mentoring program)
 */
export function SeatProgress() {
  const { current, total } = PLACEHOLDER_DATA.seats;
  const percentage = (current / total) * 100;
  const isUrgent = current <= 5;

  return (
    <div className={`seat-progress ${isUrgent ? "seat-progress-urgent" : ""}`}>
      <div className="seat-progress-header">
        <span
          className={`seat-progress-dot ${
            isUrgent ? "seat-progress-dot-urgent" : ""
          }`}
        />
        <span className="seat-progress-label">
          1기 잔여석 <strong>{total - current}자리</strong>
        </span>
      </div>
      <div className="seat-progress-bar-container">
        <div
          className="seat-progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="seat-progress-text">
        {total - current}/{total} 남음
      </div>
    </div>
  );
}

/**
 * CommunityProgress - Community membership progress bar (100명 한정)
 */
export function CommunityProgress() {
  const remaining = getCommunityRemainingSeats();
  const percentage = getCommunityProgress();
  const isUrgent = remaining <= 20;

  return (
    <div className={`seat-progress ${isUrgent ? "seat-progress-urgent" : ""}`}>
      <div className="seat-progress-header">
        <span
          className={`seat-progress-dot ${
            isUrgent ? "seat-progress-dot-urgent" : ""
          }`}
        />
        <span className="seat-progress-label">
          <strong>{COMMUNITY.currentMembers}명</strong> 참여 중 /{" "}
          {COMMUNITY.maxMembers}명 한정
        </span>
      </div>
      <div className="seat-progress-bar-container">
        <div
          className="seat-progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="seat-progress-text">
        {remaining}자리 남음
      </div>
    </div>
  );
}

/**
 * TieredPricingTable - Dynamic pricing table with tier progression
 */
export function TieredPricingTable() {
  const tiers = getTiersWithStatus();
  const currentPrice = getCurrentPrice();
  const nextPrice = getNextPrice();
  const isSoldOut = CURRENT_PRICING_SLOT > 5;

  const getBadgeText = (status: "sold" | "current" | "upcoming") => {
    switch (status) {
      case "sold":
        return "마감";
      case "current":
        return "현재 가격";
      case "upcoming":
        return "예정";
    }
  };

  return (
    <div className="space-y-4">
      {/* Urgency Banner */}
      {currentPrice && nextPrice && (
        <div className="urgency-banner">
          <svg
            className="urgency-banner-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="urgency-banner-text">
            지금 신청하면 <strong>{currentPrice.priceDisplay}</strong>
          </span>
          <span className="urgency-banner-arrow">→</span>
          <span className="urgency-banner-text">
            다음 가격 <strong>{nextPrice.priceDisplay}</strong>
          </span>
        </div>
      )}

      {/* Sold Out Banner */}
      {isSoldOut && (
        <div className="urgency-banner" style={{ borderColor: "#dc2626" }}>
          <span className="urgency-banner-text" style={{ color: "#dc2626" }}>
            1기 모집 마감 - 2기 오픈 시 알림 신청
          </span>
        </div>
      )}

      {/* Pricing Table */}
      <div className="tiered-pricing">
        <div className="tiered-pricing-header">
          <span>4주 정기 멘토링 가격표</span>
          <span className="text-sm font-normal">선착순 5명</span>
        </div>

        {/* 설명 문구 + 프로그레스 바 */}
        <div className="tiered-pricing-info">
          <p className="tiered-pricing-description">
            먼저 등록할수록 저렴해요!
          </p>
          <div className="tiered-pricing-progress">
            <div className="progress-bar">
              {[1, 2, 3, 4, 5].map((slot) => (
                <div
                  key={slot}
                  className={`progress-slot ${slot < CURRENT_PRICING_SLOT ? "filled" : ""}`}
                />
              ))}
            </div>
            <span className="progress-text">
              {CURRENT_PRICING_SLOT - 1}/5 자리 판매 완료
            </span>
          </div>
        </div>

        <div className="tiered-pricing-body">
          {tiers.map((tier) => (
            <div
              key={tier.slot}
              className={`pricing-tier-row ${tier.status}`}
            >
              <span className="pricing-tier-slot">{tier.slot}번째 등록자</span>
              <span className="pricing-tier-price">{tier.priceDisplay}</span>
              <span className={`pricing-tier-badge ${tier.status}`}>
                {getBadgeText(tier.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * UrgencyPriceBanner - Compact urgency banner for sticky CTA
 */
export function UrgencyPriceBanner() {
  const currentPrice = getCurrentPrice();
  const nextPrice = getNextPrice();

  if (!currentPrice) {
    return <span className="font-bold text-[#dc2626]">마감</span>;
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="font-mono font-bold text-[#FF6B35]">
        {currentPrice.priceDisplay}
      </span>
      {nextPrice && (
        <>
          <span className="text-gray-400">→</span>
          <span className="text-gray-500 text-xs">
            다음 {nextPrice.priceDisplay}
          </span>
        </>
      )}
    </span>
  );
}

/**
 * CompanyLogos - Infinite scrolling company logos marquee
 */
export function CompanyLogos() {
  const companyNames = COMPANIES.map((c) => c.name);

  return (
    <div className="company-logos-section">
      <div className="company-logos-label">참가자들이 합격한 기업들</div>
      <div className="company-logos-marquee">
        <div className="company-logos-track">
          {/* 무한 스크롤을 위해 로고를 2번 반복 */}
          {[...companyNames, ...companyNames].map((company, i) => (
            <div key={i} className="company-logo-item">
              <TextLogo name={company} />
            </div>
          ))}
        </div>
      </div>
      <div className="company-logos-note">
        * 참가자 동의 하에 공개된 정보입니다
      </div>
    </div>
  );
}

/**
 * StatsHero - Large stats display with animated numbers
 */
export function StatsHero() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`stats-hero animate-on-scroll ${isVisible ? "visible" : ""}`}
    >
      {METRICS.map((metric, i) => {
        const suffix =
          metric.id === "hires"
            ? "+"
            : metric.id === "interview-rate"
            ? "x"
            : metric.unit;
        return (
          <div key={metric.id} className="stats-hero-item">
            <div className="stats-hero-number">
              {isVisible ? (
                <AnimatedCounter
                  end={metric.value}
                  duration={1200 + i * 150}
                  suffix={suffix}
                  decimals={metric.value % 1 !== 0 ? 1 : 0}
                />
              ) : (
                `0${suffix}`
              )}
            </div>
            <div className="stats-hero-label">{metric.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * ChatStyleTestimonials - KakaoTalk-style chat testimonials
 */
export function ChatStyleTestimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const testimonials: {
    company: string;
    initial: string;
    color: string;
    type: string;
    review: React.ReactNode;
    time: string;
  }[] = [
    {
      company: "쿠팡 이츠 테크",
      initial: "C",
      color: "#00C73C",
      type: "신입",
      review: (
        <>
          처음 멘토랑 해주셨을때 들었던 코멘트들 덕분에 여러번 면접에{" "}
          <span className="text-highlight">
            떨어졌을때에도 자신감을 갖고 계속 도전
          </span>{" "}
          할 수 있었던 것 같습니다!
        </>
      ),
      time: "오후 2:34",
    },
    {
      company: "토스",
      initial: "T",
      color: "#0064FF",
      type: "경력 이직",
      review: (
        <>
          멘토링해주신 이후로 참 많이 도움도 자극도 받아서 정신없이 이직 준비를
          하게 되었는데요 이번에 좋은 기회로{" "}
          <span className="text-highlight">토스 팀에 합류</span>하게 되었습니다.
        </>
      ),
      time: "오후 3:12",
    },
    {
      company: "네이버",
      initial: "N",
      color: "#03C75A",
      type: "신입 공채",
      review: (
        <>
          <span className="text-highlight">네이버 합격</span>했습니다!!!!
          멘토님의 가르침 덕에 최종합격 했습니다!
        </>
      ),
      time: "오후 4:07",
    },
    {
      company: "크림",
      initial: "K",
      color: "#000",
      type: "경력 이직",
      review: (
        <>
          <span className="text-highlight">크림 되었습니다!</span> 판교로
          갑니다. 호균님 덕분입니다 ㅠㅠ 네이버 복지를 다 제공하더라요.
        </>
      ),
      time: "오후 5:23",
    },
    {
      company: "오늘의집",
      initial: "O",
      color: "#35C5F0",
      type: "정규직 전환",
      review: (
        <>
          오늘의집에서 좋게봐주셔서{" "}
          <span className="text-highlight">정규직 전환</span>하게 됐습니다!
          여기서 힘차게 성장해보겠습니다.
        </>
      ),
      time: "오후 6:45",
    },
  ];

  // Container variants - stagger effect
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  // Message variants - cascading effect
  const messageVariants = {
    hidden: {
      opacity: 0,
      y: -80,
      scale: 0.8,
      rotate: -3,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="kakao-chat-list"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {testimonials.map((item, i) => (
        <motion.div
          key={i}
          variants={messageVariants}
          className="kakao-message-row"
        >
          {/* Avatar */}
          <div className="kakao-avatar" style={{ backgroundColor: item.color }}>
            <span className="kakao-avatar-initial">{item.initial}</span>
          </div>

          {/* Message content */}
          <div className="kakao-message-content">
            {/* Sender name + badge */}
            <div className="kakao-sender">
              <span className="kakao-sender-name">{item.company}</span>
              <span className="kakao-sender-badge">{item.type}</span>
            </div>

            {/* Message bubble + time */}
            <div className="kakao-bubble-row">
              <div className="kakao-bubble">
                <div className="kakao-bubble-tail" />
                {item.review}
              </div>
              <span className="kakao-time">{item.time}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

/**
 * SuccessScreenshots - Masonry layout of success message screenshots
 */
export function SuccessScreenshots() {
  const screenshots = [
    { src: "/assets/success_1.png", alt: "리디 합격 후기 - 카카오톡 대화" },
    { src: "/assets/success_8.png", alt: "합격 후기 - 카카오톡 대화" },
    {
      src: "/assets/success_2.png",
      alt: "네이버/카카오 합격 후기 - 카카오톡 대화",
    },
    {
      src: "/assets/success_3.png",
      alt: "쿠팡 테크 합격 후기 - 카카오톡 대화",
    },
  ];

  return (
    <div className="columns-1 md:columns-3 gap-6">
      {screenshots.map((img, i) => (
        <div
          key={i}
          className="break-inside-avoid mb-6 border-3 border-black bg-white overflow-hidden transition-transform hover:-translate-y-1"
          style={{ boxShadow: "4px 4px 0px #000" }}
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={400}
            height={800}
            className="w-full h-auto"
          />
        </div>
      ))}
    </div>
  );
}

/**
 * SingleResumeSlider - Hover-based image comparison slider
 */
function SingleResumeSlider({
  beforeSrc,
  afterSrc,
  label,
  showHint = false,
}: {
  beforeSrc: string;
  afterSrc: string;
  label: string;
  showHint?: boolean;
}) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSliderPosition = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100)
    );
    container.style.setProperty("--slider-pos", `${x}%`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateSliderPosition(e.clientX);
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    updateSliderPosition(e.touches[0].clientX);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <div
      ref={containerRef}
      className={`resume-slider-container ${hasInteracted ? "interacted" : ""}`}
      style={{ "--slider-pos": "50%" } as React.CSSProperties}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      role="img"
      aria-label={`${label} V1과 V5 비교`}
    >
      <Image
        src={afterSrc}
        alt={`${label} V1`}
        width={800}
        height={1131}
        className="resume-slider-after"
        draggable={false}
      />
      <div
        className={`resume-slider-before ${
          showHint && !hasInteracted ? "with-animation" : ""
        }`}
      >
        <Image
          src={beforeSrc}
          alt={`${label} V5`}
          width={800}
          height={1131}
          draggable={false}
        />
      </div>
      <div
        className={`resume-slider-line ${
          showHint && !hasInteracted ? "with-animation" : ""
        }`}
      >
        <span className="resume-slider-label left">V5</span>
        <div className="resume-slider-handle" />
        <span className="resume-slider-label right">V1</span>
      </div>
      {showHint && !hasInteracted && (
        <div className="resume-slider-hint">마우스를 올려보세요</div>
      )}
    </div>
  );
}

/**
 * ResumeComparisonSlider - 3-column grid of resume comparison sliders
 */
export function ResumeComparisonSlider() {
  const resumes = [
    { id: 1, label: "이력서 1" },
    { id: 2, label: "이력서 2" },
    { id: 3, label: "이력서 3" },
  ];

  return (
    <div className="resume-slider-grid">
      {resumes.map((resume) => (
        <SingleResumeSlider
          key={resume.id}
          beforeSrc={`/assets/resume_${resume.id}_v5.png`}
          afterSrc={`/assets/resume_${resume.id}_v1.png`}
          label={resume.label}
          showHint={resume.id === 2}
        />
      ))}
    </div>
  );
}

/**
 * FAQ - Accordion-style FAQ section
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="faq-section">
      <h2 className="faq-title">자주 묻는 질문</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <div
            key={item.id}
            className={`faq-item ${openIndex === i ? "faq-item-open" : ""}`}
          >
            <button
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span>Q. {item.question}</span>
              <svg
                className={`faq-icon ${openIndex === i ? "faq-icon-open" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={`faq-answer ${
                openIndex === i ? "faq-answer-open" : ""
              }`}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * MidCTA - Mid-page call-to-action button
 */
export function MidCTA() {
  const scrollToCTA = () => {
    document
      .getElementById("final-cta")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mid-cta-container">
      <button
        onClick={scrollToCTA}
        className="brutal-btn bg-[#FF6B35] text-black px-8 py-4 text-lg font-bold"
      >
        합격 루프에 들어가기 →
      </button>
    </div>
  );
}

/**
 * EfficiencyLineChart - Line chart showing efficiency over iterations
 */
export function EfficiencyLineChart() {
  const { ref, isVisible } = useScrollAnimation();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const points = [
    { x: 0, y: 8, label: "8%" },
    { x: 1, y: 12, label: "12%" },
    { x: 2, y: 18, label: "18%" },
    { x: 3, y: 26, label: "26%" },
    { x: 4, y: 33, label: "33%" },
    { x: 5, y: 38, label: "38%" },
  ];

  const xLabels = ["V1", "V2", "V3", "V4", "V5", "V6+"];

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
    }
  }, []);

  // Chart dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const padding = { top: 60, right: 40, bottom: 40, left: 50 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (i: number) =>
    padding.left + (i / (points.length - 1)) * innerWidth;
  const yScale = (v: number) =>
    chartHeight - padding.bottom - (v / 45) * innerHeight;

  // SVG path generation
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.y)}`)
    .join(" ");

  // Area path for gradient fill
  const areaD = `${pathD} L ${xScale(points.length - 1)} ${
    chartHeight - padding.bottom
  } L ${padding.left} ${chartHeight - padding.bottom} Z`;

  return (
    <div ref={ref} className="brutal-card p-0 relative overflow-hidden">
      {/* Orange corner accent */}
      <div className="absolute top-0 right-0 w-4 h-full bg-[#FF6B35]" />

      <div className="p-6 pr-10">
        {/* Legend */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#FF6B35] border-2 border-black" />
          <span className="text-sm text-gray-600">통과율 (%)</span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top - 10}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="black"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right + 10}
            y2={chartHeight - padding.bottom}
            stroke="black"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 10, 20, 30, 40].map((v, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={yScale(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-gray-500 font-mono"
              fontSize="11"
            >
              {v}%
            </text>
          ))}

          {/* X-axis labels */}
          {xLabels.map((label, i) => (
            <text
              key={i}
              x={xScale(i)}
              y={chartHeight - padding.bottom + 25}
              textAnchor="middle"
              className="text-xs fill-gray-600 font-mono"
              fontSize="12"
            >
              {label}
            </text>
          ))}

          {/* Area fill with gradient */}
          <path
            d={areaD}
            fill="url(#areaGradient)"
            className={`transition-opacity duration-1000 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "500ms" }}
          />

          {/* Animated line */}
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="#FF6B35"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-1500 ease-out`}
            style={{
              strokeDasharray: pathLength || 1000,
              strokeDashoffset: isVisible ? 0 : pathLength || 1000,
            }}
          />

          {/* Data points and labels */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Data label box */}
              <g
                className={`transition-all duration-300 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
                style={{ transitionDelay: `${800 + i * 100}ms` }}
              >
                <rect
                  x={xScale(i) - 22}
                  y={yScale(p.y) - 35}
                  width="44"
                  height="22"
                  fill="black"
                  stroke="black"
                  strokeWidth="2"
                />
                <text
                  x={xScale(i)}
                  y={yScale(p.y) - 20}
                  textAnchor="middle"
                  fill="white"
                  className="font-mono font-bold"
                  fontSize="12"
                >
                  {p.label}
                </text>
              </g>

              {/* Data point */}
              <circle
                cx={xScale(i)}
                cy={yScale(p.y)}
                r="6"
                fill="#FF6B35"
                stroke="black"
                strokeWidth="2"
                className={`transition-all duration-300 ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"
                }`}
                style={{
                  transitionDelay: `${800 + i * 100}ms`,
                  transformOrigin: `${xScale(i)}px ${yScale(p.y)}px`,
                }}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

/**
 * YouTubeVideoCard - Individual video card with thumbnail + lazy iframe
 */
function YouTubeVideoCard({ video }: { video: YouTubeVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePlay();
    }
  };

  return (
    <div className="youtube-video-card">
      <div
        className="youtube-thumbnail-container"
        onClick={handlePlay}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${video.title} 영상 재생하기`}
      >
        {isPlaying ? (
          <div className="youtube-iframe-container">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <>
            <Image
              src={getYouTubeThumbnail(video.id)}
              alt={video.title}
              width={480}
              height={360}
              className="youtube-thumbnail"
              loading="lazy"
            />
            <div className="youtube-play-button">
              <div className="youtube-play-icon" />
            </div>
          </>
        )}
      </div>
      <div className="youtube-video-info">
        <h3 className="youtube-video-title">{video.title}</h3>
        {video.description && (
          <p className="youtube-video-description">{video.description}</p>
        )}
        {(video.views || video.uploadedAgo) && (
          <p className="youtube-video-meta">
            {video.views && <span>조회수 {video.views}</span>}
            {video.views && video.uploadedAgo && <span> · </span>}
            {video.uploadedAgo && <span>{video.uploadedAgo}</span>}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * YouTubeVideoSection - Free resource video section
 */
export function YouTubeVideoSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      className={`animate-on-scroll ${isVisible ? "visible" : ""} mt-20 p-6 md:p-10 border-3 border-white bg-zinc-900 shadow-[4px_4px_0px_rgba(255,255,255,0.3)]`}
    >
      <div className="text-center mb-8">
        <div className="youtube-section-header justify-center mb-3">
          <span className="youtube-section-badge">FREE RESOURCE</span>
        </div>
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-white">
          누적 <span className="text-[#FF6B35]">100+명</span>을 컨설팅한 <a href="https://www.linkedin.com/in/yuhogyun/" target="_blank" rel="noopener noreferrer" className="text-highlight hover:opacity-80 transition-opacity">대표 멘토</a>가 직접 알려주는 <span className="text-[#FF6B35]">취업 팁</span>
        </h3>
        <p className="text-gray-400 text-sm">
          유튜브에서 무료로 확인하세요
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {YOUTUBE_VIDEOS.map((video) => (
          <YouTubeVideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MENTOR PROFILE SECTION
// =============================================================================

interface MentorHighlightStat {
  value: string;
  label: string;
}

interface CareerItem {
  period: string;
  role: string;
  company: string;
  highlights?: string[];
}

interface ActivityItem {
  type: "speaking" | "mentoring" | "award";
  title: string;
  detail?: string;
}

interface GalleryItem {
  label: string;
  description: string;
  image?: string;
}

interface SpeakingItem {
  type: "conference" | "article" | "lecture";
  title: string;
  detail: string;
  link?: string;
}

const MENTOR_HIGHLIGHT_STATS: MentorHighlightStat[] = [
  { value: "9년차", label: "前 NAVER 검색 SRE 리더" },
  { value: "100+", label: "누적 코칭 인원" },
  { value: "5회", label: "NAVER MVP 수상" },
];

const MENTOR_CAREER: CareerItem[] = [
  {
    period: "2025.01 – 현재",
    role: "대표 멘토",
    company: "옥토버 아카데미",
    highlights: ["現 SW 마에스트로 멘토", "인프런, SW 마에스트로, 삼성 SSAFY, 멋쟁이사자처럼 등 100+ 코칭"],
  },
  {
    period: "2024.06 – 2025.01",
    role: "LLM Product Engineer",
    company: "GenAI Labs (프리랜서)",
    highlights: ["초기 창업 패키지 MVP 제품 개발", "Langchain, Langsmith, ChromaDB"],
  },
  {
    period: "2018.10 – 2023.07",
    role: "SRE Engineer → Team Leader",
    company: "NAVER 검색",
    highlights: ["8인 팀 리딩, 1차 기술 면접관", "장애 인지 시간 1시간→5분 단축", "월간 MVP 5회 수상"],
  },
  {
    period: "2017.07 – 2018.02",
    role: "SW Engineer (인턴)",
    company: "Mondrian AI",
    highlights: ["5인 스타트업 초기 멤버, 핵심 SI 제품 개발", "InBody Wear 앱, KT 생활인구 데이터 시각화"],
  },
];

const MENTOR_ACTIVITIES: ActivityItem[] = [
  { type: "speaking", title: "DEVIEW 2019, 2020, 2023", detail: "컨퍼런스 스피커" },
  { type: "mentoring", title: "SW 마에스트로", detail: "2년 연속 멘토" },
  { type: "award", title: "Gallup CliftonStrengths", detail: "Coach 자격" },
];

const MENTOR_GALLERY: GalleryItem[] = [
  { label: "DEVIEW 발표", description: "네이버 개발 컨퍼런스", image: "/assets/mentor/deview.jpg" },
  { label: "멘토링 세션", description: "1:1 이력서 코칭", image: "/assets/mentor/mentoring.jpg" },
  { label: "SW 마에스트로", description: "국가 인재 양성", image: "/assets/mentor/swmaestro.jpg" },
  { label: "D2 기고", description: "기술 블로그 작성", image: "/assets/mentor/d2.jpg" },
];

const MENTOR_SPEAKING: SpeakingItem[] = [
  { type: "conference", title: "DEVIEW 2019, 2020, 2023", detail: "네이버 개발 컨퍼런스 강연", link: "https://deview.kr/" },
  { type: "conference", title: "AWS Summit Seoul 2018", detail: "서버리스 이미지 크롤링 강연" },
  { type: "article", title: "NAVER D2 Hello World", detail: "SRE 관련 기술 아티클 기고", link: "https://d2.naver.com/helloworld/2047663" },
  { type: "lecture", title: "Kernel360, SSAFY, JSCODE", detail: "부트캠프/교육기관 초청 강연" },
];

// Activity type icons
function SpeakingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
  );
}

function MentoringIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}

function CertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

function PhotoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function getActivityIcon(type: ActivityItem["type"]) {
  switch (type) {
    case "speaking":
      return SpeakingIcon;
    case "mentoring":
      return MentoringIcon;
    case "award":
      return AwardIcon;
    default:
      return AwardIcon;
  }
}

/**
 * MentorProfileSection - Mentor credentials and experience showcase
 */
export function MentorProfileSection() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="section-light py-20 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        {/* Badge + Headline */}
        <div
          ref={ref}
          className={`animate-on-scroll ${isVisible ? "visible" : ""} text-center mb-12`}
        >
          <div className="mb-4">
            <span className="mentor-badge">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              TOP OF TOP
            </span>
          </div>
          <h2 className="mentor-headline">
            <span className="text-[#FF6B35]">9년차</span> 백엔드 엔지니어
            <br />
            前 NAVER 검색 SRE 리더, 現 SW 마에스트로 멘토가
            <br />
            직접 이력서를 고쳐드립니다
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Quote Card */}
            <div className="mentor-quote-card">
              <p className="text-base leading-relaxed pl-6">
                기술 면접관으로 수많은 이력서를 검토했습니다.
                <br />
                왜 떨어지는지, 어떻게 통과하는지 압니다.
                <br />
                <span className="text-highlight">제출 → 피드백 → 수정</span> 루프를 함께 돌며
                <br />
                합격하는 이력서를 만들어드립니다.
              </p>
              <p className="mt-4 text-sm text-gray-500 pl-6">
                — 유호균 (Hogyun Yu)
              </p>
            </div>

            {/* Photo Gallery */}
            <div className="mentor-photo-gallery">
              {MENTOR_GALLERY.map((item, index) => (
                <div key={index} className="mentor-photo-item">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.label}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div className={`mentor-photo-placeholder ${item.image ? "hidden" : ""}`}>
                    <PhotoIcon />
                    <span className="font-medium">{item.label}</span>
                    <span className="text-xs opacity-70">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Certification Badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="mentor-cert-badge">
                <CertIcon />
                Gallup CliftonStrengths Coach
              </span>
              <a
                href="https://www.linkedin.com/in/yuhogyun/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-[#FF6B35] transition-colors underline"
              >
                LinkedIn 프로필 →
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Highlight Stats */}
            <div className="mentor-stat-grid">
              {MENTOR_HIGHLIGHT_STATS.map((stat, index) => (
                <div key={index} className="mentor-stat-card">
                  <div className="mentor-stat-value">{stat.value}</div>
                  <div className="mentor-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Career Timeline */}
            <div className="mentor-timeline">
              {MENTOR_CAREER.map((career, index) => (
                <div key={index} className="mentor-timeline-item">
                  <div className="mentor-timeline-period">{career.period}</div>
                  <div className="mentor-timeline-role">{career.role}</div>
                  <div className="mentor-timeline-company">{career.company}</div>
                  {career.highlights && (
                    <ul className="mentor-timeline-highlights">
                      {career.highlights.map((highlight, hIndex) => (
                        <li key={hIndex}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* Activities */}
            <div className="mentor-activity-list">
              {MENTOR_ACTIVITIES.map((activity, index) => {
                const IconComponent = getActivityIcon(activity.type);
                return (
                  <div key={index} className="mentor-activity-item">
                    <IconComponent className="mentor-activity-icon" />
                    <div className="mentor-activity-content">
                      <div className="mentor-activity-title">{activity.title}</div>
                      {activity.detail && (
                        <div className="mentor-activity-detail">{activity.detail}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Speaking & Writing Section */}
        <div className="mt-12 pt-10 border-t-3 border-black">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#FF6B35]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
            강연 & 글쓰기
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MENTOR_SPEAKING.map((item, index) => (
              <div key={index} className="mentor-speaking-card">
                <div className="mentor-speaking-type">
                  {item.type === "conference" && "컨퍼런스"}
                  {item.type === "article" && "기술 블로그"}
                  {item.type === "lecture" && "초청 강연"}
                </div>
                <div className="mentor-speaking-title">{item.title}</div>
                <div className="mentor-speaking-detail">{item.detail}</div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mentor-speaking-link"
                  >
                    자세히 보기 →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
