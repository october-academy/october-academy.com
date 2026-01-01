"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [prevSeconds, setPrevSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const newSeconds = Math.floor((distance % (1000 * 60)) / 1000);
        setPrevSeconds(timeLeft.seconds);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: newSeconds,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timeLeft.seconds]);

  return (
    <div className="flex gap-3 md:gap-4">
      {[
        { value: timeLeft.days, label: "일" },
        { value: timeLeft.hours, label: "시간" },
        { value: timeLeft.minutes, label: "분" },
        { value: timeLeft.seconds, label: "초" },
      ].map((item, i) => (
        <div key={i} className="countdown-box px-3 py-2 md:px-4 md:py-3 text-center min-w-[60px] md:min-w-[80px]">
          <div className="font-mono text-2xl md:text-4xl font-bold text-[#FF6B35] countdown-number">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

function Tooltip({ children, content }: { children: React.ReactNode; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="tooltip-trigger relative inline-flex items-center gap-1"
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      <svg
        onClick={handleClick}
        className="tooltip-icon"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      <div className={`brutal-tooltip ${isOpen ? 'is-open' : ''}`}>
        {content}
      </div>
    </div>
  );
}

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

// AnimatedCounter: 숫자가 0에서 목표값까지 카운트업되는 애니메이션
function AnimatedCounter({
  end,
  duration = 1500,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollAnimation();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(end * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="counter-value">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
}

// PercentageChangeCard: +667%, +425% 같은 대형 퍼센트 변화 표시
function PercentageChangeCard({
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
  const percentChange = before === 0
    ? Math.round(after * 100)
    : Math.round(((after - before) / before) * 100);

  return (
    <div
      ref={ref}
      className={`percentage-card-dark p-6 text-center stagger-item ${isVisible ? "visible" : ""}`}
    >
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className={`font-mono text-4xl md:text-5xl font-bold text-[#FF6B35] mb-4 ${isVisible ? "percentage-pop" : "opacity-0"}`}>
        +<AnimatedCounter end={percentChange} duration={1200} suffix="%" />
      </div>
      <div className="flex items-center justify-center gap-3 text-sm">
        <span className="text-gray-400 font-mono">{before}{unit}</span>
        <span className="text-[#FF6B35] delta-arrow">→</span>
        <span className="text-white font-mono font-bold">{after}{unit}</span>
      </div>
    </div>
  );
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-on-scroll ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function BarChart({ data, isVisible = true }: { data: { label: string; value: number; color?: string; highlight?: boolean }[]; isVisible?: boolean }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, i) => {
        const isHighlight = item.highlight || item.color === "#FF6B35";
        return (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span className={isHighlight ? "font-bold text-[#FF6B35]" : ""}>{item.label}</span>
              <div className="flex items-center gap-2">
                {isHighlight && isVisible && (
                  <span className="comparison-badge hidden md:inline font-bold">
                    3.7x 낮음
                  </span>
                )}
                <span className={`font-mono ${isHighlight ? "font-bold" : ""}`}>
                  {isVisible ? (
                    <AnimatedCounter end={item.value} duration={1000 + i * 200} suffix="%" />
                  ) : (
                    "0%"
                  )}
                </span>
              </div>
            </div>
            <div className="progress-bar">
              <div
                className={`progress-fill transition-all duration-1000 ease-out ${isHighlight && isVisible ? "highlight-pulse" : ""}`}
                style={{
                  width: isVisible ? `${(item.value / maxValue) * 100}%` : '0%',
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

function AnimatedBarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-on-scroll ${isVisible ? "visible" : ""}`}>
      <div className="brutal-card p-6">
        <h3 className="font-mono text-sm text-gray-600 mb-4">준비 활동 실행률</h3>
        <BarChart data={data} isVisible={isVisible} />
      </div>
    </div>
  );
}

function LineChart() {
  const { ref, isVisible } = useScrollAnimation();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  const points = [
    { x: 0, y: 15, label: "15%" },
    { x: 1, y: 22, label: "22%" },
    { x: 2, y: 35, label: "35%" },
    { x: 3, y: 45, label: "45%" },
    { x: 4, y: 62, label: "62%" },
    { x: 5, y: 78, label: "78%" },
  ];

  const xLabels = ["V1", "V2", "V3", "V4", "V5", "V6"];

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
  const xScale = (i: number) => padding.left + (i / (points.length - 1)) * innerWidth;
  const yScale = (v: number) => chartHeight - padding.bottom - (v / 100) * innerHeight;

  // SVG path 생성
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.y)}`)
    .join(" ");

  // Area path for gradient fill
  const areaD = `${pathD} L ${xScale(points.length - 1)} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

  return (
    <div ref={ref} className="brutal-card-dark p-0 relative overflow-hidden">
      {/* Orange corner accent */}
      <div className="absolute top-0 right-0 w-4 h-full bg-[#FF6B35]" />

      <div className="p-6 pr-10">
        {/* Legend */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#FF6B35] border-2 border-white" />
          <span className="text-sm text-gray-400">서류 통과율 (%)</span>
        </div>

        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="lineChartGradient" x1="0" y1="0" x2="0" y2="1">
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
            stroke="white"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right + 10}
            y2={chartHeight - padding.bottom}
            stroke="white"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {[0, 20, 40, 60, 80].map((v, i) => (
            <text
              key={i}
              x={padding.left - 10}
              y={yScale(v)}
              textAnchor="end"
              dominantBaseline="middle"
              className="text-xs fill-gray-400 font-mono"
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
              className="text-xs fill-gray-400 font-mono"
              fontSize="12"
            >
              {label}
            </text>
          ))}

          {/* Area fill with gradient */}
          <path
            d={areaD}
            fill="url(#lineChartGradient)"
            className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
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
            className="transition-all duration-1500 ease-out"
            style={{
              strokeDasharray: pathLength || 1000,
              strokeDashoffset: isVisible ? 0 : pathLength || 1000,
            }}
          />

          {/* Data points and labels */}
          {points.map((p, i) => {
            // 첫 번째 포인트는 라벨을 오른쪽에 배치 (Y축 겹침 방지)
            const isFirst = i === 0;
            const labelX = isFirst ? xScale(i) + 30 : xScale(i);
            const labelY = isFirst ? yScale(p.y) : yScale(p.y) - 35;
            const textY = isFirst ? yScale(p.y) + 5 : yScale(p.y) - 20;

            return (
              <g key={i}>
                {/* Data label box */}
                <g
                  className={`transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
                  style={{ transitionDelay: `${800 + i * 100}ms` }}
                >
                  <rect
                    x={labelX - 22}
                    y={labelY - (isFirst ? 11 : 0)}
                    width="44"
                    height="22"
                    fill="white"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={labelX}
                    y={textY}
                    textAnchor="middle"
                    fill="black"
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
                  stroke="white"
                  strokeWidth="2"
                  className={`transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                  style={{
                    transitionDelay: `${800 + i * 100}ms`,
                    transformOrigin: `${xScale(i)}px ${yScale(p.y)}px`
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function AverageChangeChart() {
  const { ref, isVisible } = useScrollAnimation();

  const data = [
    { label: "지원 수", percent: 312 },
    { label: "회신 수", percent: 780 },
    { label: "면접 수", percent: 850 },
  ];

  const maxPercent = Math.max(...data.map(d => d.percent));
  const totalEfficiency = 647;

  return (
    <div ref={ref} className="brutal-card p-0 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left: Text Info */}
        <div className="p-6 md:p-8 md:w-1/3 bg-[#F5F5F0]">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
            평균
            <br />
            변화율
          </h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            참가자 평균 데이터.
            <br />
            이력서 V4 도달 시점 기준
            <br />
            전월 대비 증가율입니다.
          </p>
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <div className="font-mono text-4xl md:text-5xl font-bold text-[#FF6B35]">
              +<AnimatedCounter end={totalEfficiency} duration={1500} suffix="%" />
            </div>
            <div className="text-sm text-gray-400 mt-1">전체 효율 향상</div>
          </div>
        </div>

        {/* Right: Bar Chart */}
        <div className="flex-1 p-6 md:p-8 border-t-3 md:border-t-0 md:border-l-3 border-black">
          <div className="h-64 md:h-72 flex items-end justify-around gap-4 md:gap-8">
            {data.map((item, i) => {
              const barHeight = (item.percent / maxPercent) * 100;
              return (
                <div key={i} className="flex flex-col items-center flex-1 h-full justify-end">
                  {/* Percentage label */}
                  <div
                    className={`font-mono text-base md:text-xl font-bold mb-2 transition-all duration-700 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
                    }`}
                    style={{ transitionDelay: `${800 + i * 200}ms` }}
                  >
                    +<AnimatedCounter end={item.percent} duration={1200 + i * 200} suffix="%" />
                  </div>

                  {/* Bar */}
                  <div
                    className="w-full max-w-[100px] md:max-w-[120px] bg-[#FF6B35] border-3 border-black transition-all duration-1000 ease-out"
                    style={{
                      height: isVisible ? `${barHeight}%` : '0%',
                      transitionDelay: `${i * 200}ms`
                    }}
                  />

                  {/* Label */}
                  <div className="text-sm md:text-base text-gray-600 mt-3 font-medium">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function EfficiencyLineChart() {
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
  const xScale = (i: number) => padding.left + (i / (points.length - 1)) * innerWidth;
  const yScale = (v: number) => chartHeight - padding.bottom - (v / 45) * innerHeight;

  // SVG path 생성
  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(p.y)}`)
    .join(" ");

  // Area path for gradient fill
  const areaD = `${pathD} L ${xScale(points.length - 1)} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`;

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
            className={`transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
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
                className={`transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
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
                className={`transition-all duration-300 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
                style={{
                  transitionDelay: `${800 + i * 100}ms`,
                  transformOrigin: `${xScale(i)}px ${yScale(p.y)}px`
                }}
              />
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  const earlybirdDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
    }
  };

  const scrollToCTA = () => {
    document.getElementById("final-cta")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="pb-20">
      {/* SECTION 1: HERO */}
      <section className="section-dark min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
          <AnimatedSection>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              취업/이직은 보통
              <br />
              <span className="text-[#FF6B35]">이력서 V4</span>와 <span className="text-[#FF6B35]">V5</span> 사이에서
              <br />
              최종 합격이 결정됩니다.
            </h1>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
              그런데 대부분은
              <br />
              V0 초안조차 준비하지 않은 채
              <br />
              계속 준비만 합니다.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <div className="brutal-card-dark p-6 max-w-xl">
              <p className="text-gray-400">
                옥토버 코드는
                <br />
                <span className="text-white font-medium">제출 → 피드백 → 수정 → 재제출</span>
                <br />이 루프를 실제로 돌게 만드는 프로그램입니다.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="mb-4 text-sm text-gray-400">얼리버드 마감까지</div>
            <Countdown targetDate={earlybirdDeadline} />
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div>
                <div className="text-gray-400 text-sm mb-1">정가</div>
                <div className="font-mono text-xl strikethrough text-gray-400">₩1,290,000</div>
              </div>
              <div>
                <div className="text-[#FF6B35] text-sm mb-1">얼리버드</div>
                <div className="font-mono text-3xl md:text-4xl font-bold text-white">₩890,000</div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-10">
            <button
              onClick={scrollToCTA}
              className="brutal-btn bg-[#FF6B35] text-black px-8 py-4 text-lg font-bold"
            >
              합격 루프에 들어가기 →
            </button>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 2: Problem Recognition */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-12">준비를 안 하는 건 아닙니다</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <ul className="space-y-4 text-lg">
                {[
                  "코딩 테스트는 풉니다",
                  "사이드 프로젝트도 만듭니다",
                  "공부도 합니다",
                  "하지만 이력서 제출은 미뤄집니다",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-[#FF6B35] mt-1">{i < 3 ? "✓" : "✗"}</span>
                    {i === 3 ? (
                      <span className="text-highlight">{item}</span>
                    ) : (
                      <span className="text-gray-600">{item}</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-6 bg-gray-100 brutal-border">
                <p className="font-medium">이건 <span className="line-through text-red-500 font-bold">의지 문제</span>가 아니라 <span className="text-highlight">구조의 문제</span>입니다.</p>
              </div>
            </AnimatedSection>

            <AnimatedBarChart
              data={[
                { label: "코딩 테스트 풀이", value: 85, color: "#333" },
                { label: "강의/스터디 참여", value: 78, color: "#333" },
                { label: "사이드 프로젝트", value: 65, color: "#333" },
                { label: "이력서 제출", value: 23, color: "#FF6B35" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: Loop Explanation */}
      <section className="section-dark loop-section-bg py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <span className="font-mono text-sm text-[#FF6B35] tracking-widest mb-4 block">
                시스템 구조
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                합격은 <span className="text-[#FF6B35]">루프</span>에서 만들어집니다
              </h2>
              <p className="text-gray-400">
                일방적인 준비가 아닌, 피드백과 수정의 순환 구조
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            {/* Desktop: 1열 4단계 레이아웃 */}
            <div className="hidden md:flex items-center justify-center gap-4">
              {/* 1. V0 템플릿 */}
              <div className="loop-card loop-card-sm loop-card-dashed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="loop-card-label">V0</span>
                <span className="loop-card-sublabel">템플릿</span>
              </div>

              <span className="loop-arrow">→</span>

              {/* 2. 루프 박스 (V1~V4 ⟲ 피드백) */}
              <div className="loop-container relative flex items-center gap-3 px-6 py-4 border-2 border-dashed border-[#FF6B35] rounded-lg">
                {/* 루프 라벨 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3">
                  <span className="text-xs text-[#FF6B35] font-mono flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    반복
                  </span>
                </div>

                <div className="loop-card loop-card-sm loop-card-dashed">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span className="loop-card-label">V1~V4</span>
                  <span className="loop-card-sublabel">수정</span>
                </div>

                <span className="loop-arrow-cycle">⟲</span>

                <div className="loop-card loop-card-sm">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span className="loop-card-label">피드백</span>
                  <span className="loop-card-sublabel">반복</span>
                </div>
              </div>

              <span className="loop-arrow">→</span>

              {/* 3. V5 최종 */}
              <div className="loop-card loop-card-sm loop-card-filled">
                <svg viewBox="0 0 24 24" fill="currentColor" className="loop-card-icon">
                  <circle cx="12" cy="12" r="10" fill="#FF6B35" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="loop-card-label">V5</span>
                <span className="loop-card-sublabel">최종</span>
              </div>

              <span className="loop-arrow">→</span>

              {/* 4. 합격 */}
              <div className="loop-card loop-card-sm loop-card-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="loop-card-label">합격</span>
                <span className="loop-card-sublabel">목표 달성</span>
              </div>
            </div>

            {/* Mobile: 세로 4단계 레이아웃 */}
            <div className="flex md:hidden flex-col items-center gap-3">
              {/* 1. V0 템플릿 */}
              <div className="loop-card loop-card-dashed">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="loop-card-label">V0</span>
                <span className="loop-card-sublabel">템플릿</span>
              </div>
              <span className="loop-arrow">↓</span>

              {/* 2. 루프 박스 (V1~V4 ⟲ 피드백) */}
              <div className="loop-container-mobile relative w-full max-w-xs px-4 py-6 border-2 border-dashed border-[#FF6B35] rounded-lg">
                {/* 루프 라벨 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3">
                  <span className="text-xs text-[#FF6B35] font-mono flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    반복
                  </span>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="loop-card loop-card-dashed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="loop-card-label">V1~V4</span>
                    <span className="loop-card-sublabel">수정</span>
                  </div>

                  <span className="loop-arrow-cycle text-2xl">⟲</span>

                  <div className="loop-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="loop-card-label">피드백</span>
                    <span className="loop-card-sublabel">반복</span>
                  </div>
                </div>
              </div>
              <span className="loop-arrow">↓</span>

              {/* 3. V5 최종 */}
              <div className="loop-card loop-card-filled">
                <svg viewBox="0 0 24 24" fill="currentColor" className="loop-card-icon">
                  <circle cx="12" cy="12" r="10" fill="#FF6B35" />
                  <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="loop-card-label">V5</span>
                <span className="loop-card-sublabel">최종</span>
              </div>
              <span className="loop-arrow">↓</span>

              {/* 4. 합격 */}
              <div className="loop-card loop-card-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="loop-card-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="loop-card-label">합격</span>
                <span className="loop-card-sublabel">목표 달성</span>
              </div>
            </div>

            {/* 거절 분석 및 반복 섹션 */}
            <div className="mt-16 flex flex-col items-center">
              {/* 라벨 */}
              <div className="border border-gray-600 px-4 py-2 mb-8">
                <span className="text-sm text-gray-400">거절 분석 및 반복</span>
              </div>

              {/* 3개 원칙 카드 */}
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <div className="bg-[#FF6B35] text-white px-5 py-3 flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                  <Tooltip content="완벽해질 때까지 기다리지 마세요. 80%만 완성되어도 제출하세요.">
                    <span>완벽 금지</span>
                  </Tooltip>
                </div>
                <div className="bg-[#FF6B35] text-white px-5 py-3 flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <Tooltip content="매주 과제를 제출해야 피드백을 받을 수 있습니다.">
                    <span>제출 필수</span>
                  </Tooltip>
                </div>
                <div className="bg-[#FF6B35] text-white px-5 py-3 flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="4" y="4" width="16" height="4" rx="1" />
                    <rect x="4" y="10" width="16" height="4" rx="1" />
                    <rect x="4" y="16" width="16" height="4" rx="1" />
                  </svg>
                  <Tooltip content="거절당한 경험은 다음 지원을 개선하는 데이터가 됩니다.">
                    <span>거절 = 데이터</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 4: Opinionated Council */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">
              하나의 정답 대신,
              <br />
              <span className="bg-[#FF6B35] text-white px-2">다섯 개의 관점</span>을 받습니다
            </h2>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "포맷터",
                  subtitle: "구조 설계",
                  desc: "가독성과 구조를 점검합니다. 읽히지 않는 이력서는 평가받지 못합니다.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="15" y2="12" />
                      <line x1="3" y1="18" x2="18" y2="18" />
                    </svg>
                  ),
                },
                {
                  title: "테크니션",
                  subtitle: "기술 검증",
                  desc: "기술 스택의 적합성과 깊이를 분석합니다. 나열이 아닌 맥락을 봅니다.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                },
                {
                  title: "넘버 사이언티스트",
                  subtitle: "수치 증명",
                  desc: "정량적 임팩트를 추출합니다. 숫자가 없으면 만들어내는 방법을 제시합니다.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                      <rect x="3" y="12" width="4" height="9" />
                      <rect x="10" y="8" width="4" height="13" />
                      <rect x="17" y="4" width="4" height="17" />
                    </svg>
                  ),
                },
                {
                  title: "소프트 스킬 리뷰어",
                  subtitle: "협업 역량",
                  desc: "협업, 문제 해결, 커뮤니케이션 역량이 드러나는지 확인합니다.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                      <circle cx="9" cy="7" r="3" />
                      <circle cx="15" cy="7" r="3" />
                      <circle cx="6" cy="17" r="3" />
                      <circle cx="18" cy="17" r="3" />
                      <circle cx="12" cy="17" r="3" />
                    </svg>
                  ),
                },
                {
                  title: "밸류에이션 리뷰어",
                  subtitle: "시장 가치",
                  desc: "채용 관점에서 당신의 시장 가치를 평가합니다. 합격 가능성을 진단합니다.",
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
                    </svg>
                  ),
                },
              ].map((card, i, arr) => (
                <div
                  key={i}
                  className={`brutal-card overflow-hidden hover:translate-x-1 hover:translate-y-1 transition-transform ${
                    i === arr.length - 1 ? "md:col-span-2 md:max-w-md md:mx-auto" : ""
                  }`}
                >
                  <div className="px-6 pt-6">
                    <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <h3 className="font-bold text-lg mb-1">
                      {card.title} <span className="text-gray-600 font-normal">({card.subtitle})</span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-8">
              같은 첨삭, <span className="text-[#FF6B35]">다른 결과</span>
            </h2>
            {/* Desktop: 테이블 */}
            <div className="brutal-card overflow-hidden hidden md:block">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b-3 border-black bg-gray-100">
                    <th className="py-5 px-6 text-left border-r border-gray-300"></th>
                    <th className="py-5 px-6 text-center font-semibold">일반 이력서 첨삭</th>
                    <th className="py-5 px-6 text-center bg-[#FF6B35] text-black font-semibold">옥토버 코드</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "피드백 관점", before: "1개", after: "5개", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                      </svg>
                    )},
                    { label: "피드백 횟수", before: "1~2회", after: "무제한", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                      </svg>
                    )},
                    { label: "제출 강제성", before: "없음", after: "있음", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    )},
                    { label: "거절 피드백 분석", before: "없음", after: "포함", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                    )},
                    { label: "8주 후 이력서 버전", before: "V1~V2", after: "V4~V5", icon: (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    )},
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 comparison-row">
                      <td className="py-5 px-6 font-medium border-r border-gray-300">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">{row.icon}</span>
                          {row.label}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-600 text-center">{row.before}</td>
                      <td className="py-5 px-6 text-center">
                        <span className="value-badge-large">{row.after}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile: 카드 리스트 */}
            <div className="md:hidden space-y-3">
              {[
                { label: "피드백 관점", before: "1개", after: "5개" },
                { label: "피드백 횟수", before: "1~2회", after: "무제한" },
                { label: "제출 강제성", before: "없음", after: "있음" },
                { label: "거절 피드백 분석", before: "없음", after: "포함" },
                { label: "8주 후 이력서 버전", before: "V1~V2", after: "V4~V5" },
              ].map((row, i) => (
                <div key={i} className="brutal-card p-6">
                  <div className="font-medium text-sm mb-3">{row.label}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400 mb-1">일반 첨삭</div>
                      <div className="text-gray-600">{row.before}</div>
                    </div>
                    <div className="text-[#FF6B35] font-mono mx-2 delta-arrow">→</div>
                    <div className="text-center flex-1 bg-[#FF6B35]/10 py-2 -my-1">
                      <div className="text-xs text-gray-600 mb-1">옥토버 코드</div>
                      <div className="font-mono font-bold"><span className="text-highlight">{row.after}</span></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 5: 실제 변화 */}
      <section className="section-dark py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">
              실제 변화
            </h2>
            <p className="text-center text-gray-400 mb-12">
              8주 프로그램 참여자들의 평균 데이터
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            <PercentageChangeCard
              label="지원 수"
              before={2.3}
              after={17.6}
              unit="건"
            />
            <PercentageChangeCard
              label="회신율"
              before={8}
              after={42}
              unit="%"
            />
            <PercentageChangeCard
              label="면접 전환"
              before={0.3}
              after={4}
              unit="회"
            />
          </div>
        </div>
      </section>

      {/* SECTION 5.6: 효율성 지표 */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="mb-6">
              <span className="inline-block bg-black text-white px-3 py-1 text-sm font-mono">
                효율성 지표
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
              <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                제출 횟수가 많을수록
                <br />
                통과율 상승
              </h2>
              <p className="text-gray-600 text-sm md:text-base italic">
                &quot;추가 공부가 아닌 반복에서 나오는 트렌드&quot;
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <EfficiencyLineChart />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 6: Social Proof */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-12">
              Before → After
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "K님",
                role: "프론트엔드 개발자",
                before: { apply: 2, response: 0, interview: 0 },
                after: { apply: 14, response: 6, interview: 3 },
              },
              {
                name: "L님",
                role: "백엔드 개발자",
                before: { apply: 5, response: 1, interview: 0 },
                after: { apply: 21, response: 9, interview: 5 },
              },
              {
                name: "P님",
                role: "풀스택 개발자",
                before: { apply: 0, response: 0, interview: 0 },
                after: { apply: 18, response: 7, interview: 4 },
              },
            ].map((person, i) => {
              const PersonCard = () => {
                const { ref, isVisible } = useScrollAnimation();
                return (
                  <div
                    ref={ref}
                    className={`brutal-card p-6 stagger-item ${isVisible ? "visible" : ""}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#FF6B35] brutal-border flex items-center justify-center font-mono font-bold text-black">
                        {person.name[0]}
                      </div>
                      <div>
                        <div className="font-bold">{person.name}</div>
                        <div className="text-sm text-gray-600">{person.role}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: "지원", before: person.before.apply, after: person.after.apply },
                        { label: "회신", before: person.before.response, after: person.after.response },
                        { label: "면접", before: person.before.interview, after: person.after.interview },
                      ].map((stat, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{stat.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-400 text-xs">{stat.before}</span>
                            <span className="text-[#FF6B35] animate-pulse-arrow">→</span>
                            <span className="font-mono font-bold text-lg text-[#FF6B35]">
                              {isVisible ? (
                                <AnimatedCounter end={stat.after} duration={1200 + j * 200} />
                              ) : (
                                "0"
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              };
              return <PersonCard key={i} />;
            })}
          </div>

          <AnimatedSection className="mt-12">
            <AverageChangeChart />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 7: Combined Outcome Section - 8주 후 + Not For Everyone */}
      <section className="striped-bg py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-3">
                8주 후, 당신에게 남는 것
              </h2>
              <p className="text-gray-600">
                기대 결과 <span className="font-mono">vs</span> 제외 기준
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="outcome-container">
              {/* Left Panel - What You Get */}
              <div className="outcome-left">
                <div className="outcome-header outcome-header-dark">
                  <span>8주 후 당신이 얻는 것</span>
                  <svg className="outcome-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  {[
                    "V4~V5 검증된 이력서",
                    "기업 맞춤형 제출 경험",
                    "최소 1회 이상 면접 전환",
                    "다음 수정 포인트를 설명 가능",
                  ].map((item, i) => (
                    <div key={i} className="outcome-item">
                      <div className="outcome-check">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="outcome-text">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel - Not For Everyone */}
              <div className="outcome-right">
                <div className="outcome-header outcome-header-light" style={{ borderBottomColor: 'rgba(0,0,0,0.1)' }}>
                  <span>이런 분은 맞지 않습니다</span>
                  <svg className="outcome-no-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <div>
                  {[
                    { text: "듣기만 원하는 사람", sub: null },
                    { text: "미완성을 제출할 수 없는 사람", sub: "(Perfectionism)" },
                    { text: "결과를 100% 보장받고 싶은 사람", sub: null },
                  ].map((item, i) => (
                    <div key={i} className="outcome-item outcome-item-light">
                      <div className="outcome-x">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                      <div>
                        <span className="outcome-text outcome-text-light">{item.text}</span>
                        {item.sub && <div className="outcome-subtext">{item.sub}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="text-center">
              <span className="outcome-badge">ASSET ACQUIRED</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 8: Final CTA */}
      <section id="final-cta" className="section-light py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
                준비를 멈추고,
              </h2>
              <div className="inline-block">
                <span className="inline-block bg-[#FF6B35] text-white text-3xl md:text-5xl lg:text-6xl font-bold px-4 py-2 transform -rotate-1">
                  제출을 시작하세요.
                </span>
              </div>
            </div>
            <p className="text-center text-gray-600 text-lg md:text-xl mb-12">
              합격은 반복된 수정과 제출 사이에서 일어납니다.
            </p>
          </AnimatedSection>

          <AnimatedSection>
              {isSubmitted ? (
                <div className="brutal-card p-8 bg-green-50">
                  <div className="text-4xl mb-4">✓</div>
                  <h3 className="text-xl font-bold mb-2">등록 완료</h3>
                  <p className="text-gray-600">
                    대기 명단에 등록되었습니다.
                    <br />
                    오픈 시 안내 메일을 보내드립니다.
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Price tag */}
                  <div className="absolute -top-6 -right-2 md:-top-8 md:-right-4 z-10 transform rotate-6">
                    <div className="bg-[#FF6B35] text-white px-4 py-3 md:px-6 md:py-4 shadow-lg">
                      <div className="text-xs md:text-sm text-center mb-1">얼리버드</div>
                      <div className="font-mono text-2xl md:text-3xl font-bold text-center">₩890,000</div>
                      <div className="font-mono text-sm md:text-base text-center line-through opacity-70">₩1,290,000</div>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="brutal-card p-6 md:p-8 pt-8 md:pt-10">
                    <div className="flex flex-col md:flex-row gap-0">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="이메일 주소를 입력하세요"
                        required
                        className="flex-1 px-4 py-4 border-3 border-black bg-white focus:outline-none focus:border-[#FF6B35] text-base md:text-lg"
                      />
                      <button
                        type="submit"
                        className="bg-black text-white px-6 py-4 font-bold text-base md:text-lg border-3 border-black md:border-l-0 hover:bg-gray-900 transition-colors whitespace-nowrap"
                      >
                        합격 루프 대기 명단 등록
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-3">
                      <div className="flex items-center gap-2 text-[#FF6B35]">
                        <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse"></span>
                        <span className="text-sm font-medium">4기 잔여석 단 12자리</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-sm">안전한 등록 및 결제</span>
                      </div>
                    </div>
                  </form>
                </div>
              )}
          </AnimatedSection>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div
        className={`sticky-cta py-3 px-4 md:px-6 transition-transform duration-300 ${
          showStickyCTA ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 md:gap-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <span className="font-mono text-xs md:text-sm text-gray-400 line-through mr-2">₩1,290,000</span>
            <span className="font-mono font-bold text-sm md:text-lg">₩890,000</span>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={scrollToCTA}
              className="brutal-btn bg-[#FF6B35] text-black px-4 md:px-6 py-2 font-bold text-xs md:text-base whitespace-nowrap"
            >
              합격 루프 신청 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
