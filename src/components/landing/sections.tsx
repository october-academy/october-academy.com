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
} from "@/lib/constants";
import type { BarChartItem } from "@/lib/types";

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
  data: { label: string; value: number; color?: string }[];
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
  return (
    <div className="price-comparison">
      <div className="price-comparison-header">
        <span className="price-comparison-badge">90% 저렴</span>
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
                ₩400,000
              </span>
              <span className="price-comparison-saving">₩3,600,000 절약</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * SeatProgress - Remaining seats progress bar
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={afterSrc}
        alt={`${label} V1`}
        className="resume-slider-after"
        draggable={false}
      />
      <div
        className={`resume-slider-before ${
          showHint && !hasInteracted ? "with-animation" : ""
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={beforeSrc} alt={`${label} V5`} draggable={false} />
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
