"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  Countdown,
  CountdownCompact,
  AnimatedSection,
  ScrollProgress,
  Tooltip,
} from "@/components/landing/ui";
import {
  TrustMetrics,
  PriceComparison,
  AnimatedBarChart,
  PercentageChangeCard,
  EfficiencyLineChart,
  ResumeComparisonSlider,
  ChatStyleTestimonials,
  SuccessScreenshots,
  FAQ,
  MidCTA,
  CommunityProgress,
  TieredPricingTable,
  YouTubeVideoSection,
  MentorProfileSection,
} from "@/components/landing/sections";
import {
  CHANGE_METRICS,
  PRINCIPLES,
  WEEKLY_CURRICULUM,
  PRODUCTS,
  INFLEARN_LIVE,
  getCurrentPrice,
  getCommunityRemainingSeats,
  TEMPLATE_DEADLINE,
  isDeadlinePassed,
} from "@/lib/constants";

const WORKER_URL = process.env.NEXT_PUBLIC_SUBSCRIBE_WORKER_URL || "https://october-subscribe.sparkling-moon-3d5b.workers.dev";

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStickyCTA, setShowStickyCTA] = useState(false);
  const [highlightCTA, setHighlightCTA] = useState(false);

  // 인프런 대기 등록 상태
  const [inflearnEmail, setInflearnEmail] = useState("");
  const [isInflearnSubmitted, setIsInflearnSubmitted] = useState(false);
  const [isInflearnLoading, setIsInflearnLoading] = useState(false);
  const [inflearnError, setInflearnError] = useState<string | null>(null);
  const [earlybirdDeadline] = useState(
    () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyCTA(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "구독 처리 중 오류가 발생했습니다");
      }

      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInflearnSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inflearnEmail || isInflearnLoading) return;

    setIsInflearnLoading(true);
    setInflearnError(null);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inflearnEmail, type: "inflearn" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "대기 등록 처리 중 오류가 발생했습니다");
      }

      setIsInflearnSubmitted(true);
      setInflearnEmail("");
    } catch (err) {
      setInflearnError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
      );
    } finally {
      setIsInflearnLoading(false);
    }
  };

  const scrollToCTA = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });

    // 스크롤 완료 후 하이라이트 트리거
    setTimeout(() => {
      setHighlightCTA(true);
      // 애니메이션 완료 후 상태 리셋
      setTimeout(() => setHighlightCTA(false), 1500);
    }, 500);
  };

  const scrollToPricing = () => {
    document
      .getElementById("pricing")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="pb-20">
      {/* Scroll Progress Bar */}
      <ScrollProgress />

      {/* SECTION 1: HERO */}
      <section className="section-dark min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
          <AnimatedSection>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              개발자 취업/이직은 보통
              <br />
              <span className="text-[#FF6B35]">이력서 V4</span>와{" "}
              <span className="text-[#FF6B35]">V5</span> 사이에서
              <br />
              <span className="text-highlight">최종 합격</span>이 결정됩니다.
            </h1>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <p className="text-base text-gray-400 max-w-2xl">
              그런데 대부분은
              <br />
              <b>이력서 초안</b>조차 준비하지 않은 채
              <br />
              계속 <span className="text-strikethrough">완벽한 준비</span>만을
              하면서 <span className="text-highlight text-white">합격</span>을
              기다립니다.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <div className="brutal-card-dark p-6 max-w-xl">
              <p className="text-gray-400">
                옥토버 코드는
                <br />
                <span className="text-white font-medium text-highlight">
                  제출 → 피드백 → 수정 → 재제출
                </span>
                <br />이 루프를 실제로 돌게 만드는 프로그램입니다.
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                숫자로 증명합니다
              </h2>
              <p className="text-base text-gray-400">옥토버 코드 참여자들의 실제 성과</p>
            </div>
            <TrustMetrics />
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="mb-4 text-sm text-gray-400">얼리버드 마감까지</div>
            <Countdown targetDate={earlybirdDeadline} />
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <PriceComparison />
          </AnimatedSection>

          <AnimatedSection className="mt-10">
            <button
              onClick={scrollToPricing}
              className="brutal-btn bg-[#FF6B35] text-white px-8 py-4 text-lg font-bold"
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
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              준비를 안 하는 건 아닙니다
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <AnimatedSection>
              <ul className="space-y-4 text-lg">
                {[
                  "코딩 테스트는 풉니다",
                  "사이드 프로젝트도 만듭니다",
                  "짬짬이 CS 스터디 합니다",
                  "하지만 정작 이력서 제출은 미뤄집니다",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="font-mono text-xl text-[#FF6B35]">
                      {i < 3 ? "✓" : "✗"}
                    </span>
                    {i === 3 ? (
                      <span className="text-highlight">{item}</span>
                    ) : (
                      <span className="text-gray-600">{item}</span>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-6 bg-gray-100 brutal-border">
                <p className="font-medium">
                  이건 <span className="text-strikethrough">의지 문제</span>가
                  아니라 <span className="text-highlight">구조의 문제</span>
                  입니다.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedBarChart
              data={[
                { label: "코딩 테스트 풀이", value: 85, color: "#333" },
                { label: "강의/스터디 참여", value: 78, color: "#333" },
                { label: "사이드 프로젝트", value: 65, color: "#333" },
                { label: "이력서 제출", value: 23, color: "#FF6B35", comparisonBadge: "3.7x 낮음" },
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
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                합격은 <span className="text-[#FF6B35]">루프</span>에서
                만들어집니다
              </h2>
              <p className="text-base text-gray-400">
                일방적인 준비가 아닌, 피드백과 수정의 순환 구조
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            {/* Desktop: 1열 4단계 레이아웃 */}
            <div className="hidden md:flex items-center justify-center gap-4">
              {/* 1. V0 템플릿 */}
              <a
                href="https://drive.google.com/drive/folders/1VBJrhcU-jRULmgkReH6xd2TDUeMTQYov?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="loop-card loop-card-sm loop-card-dashed loop-card-clickable"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="loop-card-icon"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="loop-card-label">V0</span>
                <span className="loop-card-sublabel">템플릿</span>
              </a>

              <span className="loop-arrow">→</span>

              {/* 2. 루프 박스 (V1~V4 ⟲ 피드백) */}
              <div className="loop-container relative flex items-center px-6 py-4 border-2 border-dashed border-[#FF6B35] rounded-lg">
                {/* 루프 라벨 - 상단 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3">
                  <span className="text-xs text-[#FF6B35] font-mono flex items-center gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-3 h-3"
                    >
                      <path d="M17 1l4 4-4 4" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <path d="M7 23l-4-4 4-4" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                    반복
                  </span>
                </div>

                {/* V1~V4 ⟲ 피드백 */}
                <div className="flex items-center gap-3">
                  <div className="loop-card loop-card-sm loop-card-dashed">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="loop-card-icon"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="loop-card-label">V1~V4</span>
                    <span className="loop-card-sublabel">수정</span>
                  </div>

                  <span className="loop-arrow-cycle">⟲</span>

                  <div className="loop-card loop-card-sm">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="loop-card-icon"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="loop-card-label">피드백</span>
                    <span className="loop-card-sublabel">반복</span>
                  </div>
                </div>

                {/* 하단: 거절 분석 및 반복 */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3">
                  <span className="text-xs text-[#FF6B35]">거절 분석 및 반복</span>
                </div>
              </div>

              <span className="loop-arrow">→</span>

              {/* 3. V5 최종 */}
              <div className="loop-card loop-card-sm loop-card-filled">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="loop-card-icon"
                >
                  <circle cx="12" cy="12" r="10" fill="#FF6B35" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="loop-card-label">V5</span>
                <span className="loop-card-sublabel">최종</span>
              </div>

              <span className="loop-arrow">→</span>

              {/* 4. 합격 */}
              <a
                href="https://zettalyst.notion.site/22971085f62f8007b6ebdfc184be98ea?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="loop-card loop-card-sm loop-card-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="loop-card-icon"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="loop-card-label">합격</span>
                <span className="loop-card-sublabel">목표 달성</span>
              </a>
            </div>

            {/* Mobile: 세로 4단계 레이아웃 */}
            <div className="flex md:hidden flex-col items-center gap-3">
              {/* 1. V0 템플릿 */}
              <a
                href="https://drive.google.com/drive/folders/1VBJrhcU-jRULmgkReH6xd2TDUeMTQYov?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="loop-card loop-card-dashed loop-card-clickable"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="loop-card-icon"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span className="loop-card-label">V0</span>
                <span className="loop-card-sublabel">템플릿</span>
              </a>
              <span className="loop-arrow">↓</span>

              {/* 2. 루프 박스 (V1~V4 ⟲ 피드백) */}
              <div className="loop-container-mobile relative w-full max-w-xs px-4 py-6 border-2 border-dashed border-[#FF6B35] rounded-lg">
                {/* 루프 라벨 */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0a0a0a] px-3">
                  <span className="text-xs text-[#FF6B35] font-mono flex items-center gap-1">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-3 h-3"
                    >
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
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="loop-card-icon"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    <span className="loop-card-label">V1~V4</span>
                    <span className="loop-card-sublabel">수정</span>
                  </div>

                  <span className="loop-arrow-cycle text-2xl">⟲</span>

                  <div className="loop-card">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="loop-card-icon"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="loop-card-label">피드백</span>
                    <span className="loop-card-sublabel">반복</span>
                  </div>

                  {/* 하단: 거절 분석 및 반복 */}
                  <div className="border border-gray-600 px-3 py-1 mt-2">
                    <span className="text-xs text-[#FF6B35]">거절 분석 및 반복</span>
                  </div>
                </div>
              </div>
              <span className="loop-arrow">↓</span>

              {/* 3. V5 최종 */}
              <div className="loop-card loop-card-filled">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="loop-card-icon"
                >
                  <circle cx="12" cy="12" r="10" fill="#FF6B35" />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="loop-card-label">V5</span>
                <span className="loop-card-sublabel">최종</span>
              </div>
              <span className="loop-arrow">↓</span>

              {/* 4. 합격 */}
              <a
                href="https://zettalyst.notion.site/22971085f62f8007b6ebdfc184be98ea?source=copy_link"
                target="_blank"
                rel="noopener noreferrer"
                className="loop-card loop-card-white"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="loop-card-icon"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="loop-card-label">합격</span>
                <span className="loop-card-sublabel">목표 달성</span>
              </a>
            </div>

            {/* 3개 원칙 카드 */}
            <div className="mt-16 flex flex-col items-center">
              <div className="flex flex-col md:flex-row justify-center gap-4">
                {PRINCIPLES.map((principle, i) => (
                  <div
                    key={principle.id}
                    className="bg-[#FF6B35] text-white px-5 py-3 flex items-center gap-2 font-medium"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill={i === 2 ? "currentColor" : "none"}
                      stroke={i === 2 ? "none" : "currentColor"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {i === 0 && (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </>
                      )}
                      {i === 1 && (
                        <>
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </>
                      )}
                      {i === 2 && (
                        <>
                          <rect x="4" y="4" width="16" height="4" rx="1" />
                          <rect x="4" y="10" width="16" height="4" rx="1" />
                          <rect x="4" y="16" width="16" height="4" rx="1" />
                        </>
                      )}
                    </svg>
                    <Tooltip content={principle.description}>
                      <span>{principle.name}</span>
                    </Tooltip>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Mid CTA #1 */}
          <AnimatedSection className="mt-16">
            <MidCTA />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 4: Opinionated Council */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">
              <span className="text-strikethrough">하나의 정답</span> 대신,
              <br />
              <span className="bg-[#FF6B35] text-white px-2">
                다섯 개의 관점
              </span>
              을 받습니다
            </h2>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "1. 문서 형식 피드백",
                  subtitle: "구조 설계",
                  desc: "가독성과 구조를 점검합니다. 읽히지 않는 이력서는 평가받지 못합니다.",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="2"
                    >
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="15" y2="12" />
                      <line x1="3" y1="18" x2="18" y2="18" />
                    </svg>
                  ),
                },
                {
                  title: "2. 기술 검증 피드백",
                  subtitle: "기술 검증",
                  desc: "기술 스택의 적합성과 깊이를 분석합니다. 나열이 아닌 맥락을 봅니다.",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="2"
                    >
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                },
                {
                  title: "3. 수치 증명 피드백",
                  subtitle: "수치 증명",
                  desc: "정량적 임팩트를 추출합니다. 숫자가 없으면 만들어내는 방법을 제시합니다.",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="2"
                    >
                      <rect x="3" y="12" width="4" height="9" />
                      <rect x="10" y="8" width="4" height="13" />
                      <rect x="17" y="4" width="4" height="17" />
                    </svg>
                  ),
                },
                {
                  title: "4. 소프트 스킬 피드백",
                  subtitle: "협업 역량",
                  desc: "협업, 문제 해결, 커뮤니케이션 역량이 드러나는지 확인합니다.",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="2"
                    >
                      <circle cx="9" cy="7" r="3" />
                      <circle cx="15" cy="7" r="3" />
                      <circle cx="6" cy="17" r="3" />
                      <circle cx="18" cy="17" r="3" />
                      <circle cx="12" cy="17" r="3" />
                    </svg>
                  ),
                },
                {
                  title: "5. 비즈니스 임팩트 피드백",
                  subtitle: "시장 가치",
                  desc: "채용 관점에서 당신의 시장 가치를 평가합니다. 합격 가능성을 진단합니다.",
                  icon: (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FF6B35"
                      strokeWidth="2"
                    >
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" strokeWidth="3" />
                    </svg>
                  ),
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="brutal-card overflow-hidden hover:translate-x-1 hover:translate-y-1 transition-transform"
                >
                  <div className="px-6 pt-6">
                    <div className="w-12 h-12 brutal-border bg-white flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>
                  <div className="px-6 pt-4 pb-6">
                    <h3 className="font-bold text-lg mb-1">
                      {card.title}{" "}
                      <span className="text-gray-600 font-normal">
                        ({card.subtitle})
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16">
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              같은 첨삭, <span className="text-[#FF6B35]">다른 결과</span>
            </h2>
            {/* Desktop: 테이블 */}
            <div className="brutal-card overflow-hidden hidden md:block">
              <table className="w-full text-base">
                <thead>
                  <tr className="border-b-3 border-black bg-gray-100">
                    <th className="py-5 px-6 text-left border-r border-gray-300"></th>
                    <th className="py-5 px-6 text-center font-semibold">
                      일반 이력서 첨삭
                    </th>
                    <th className="py-5 px-6 text-center bg-[#FF6B35] text-black font-semibold">
                      옥토버 코드
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "피드백 관점",
                      before: "1개 (일반적인 형식 혹은 구조 피드백)",
                      after: "5개 (형식, 기술, 수치, 소프트 스킬, 임팩트)",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      ),
                    },
                    {
                      label: "피드백 횟수",
                      before: "1~2회",
                      after: "무제한 (제출 기한 내)",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                      ),
                    },
                    {
                      label: "제출 강제성",
                      before: "없음",
                      after: "있음",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      ),
                    },
                    {
                      label: "거절 피드백 분석",
                      before: "없음",
                      after: "포함",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="18" y1="20" x2="18" y2="10" />
                          <line x1="12" y1="20" x2="12" y2="4" />
                          <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                      ),
                    },
                    {
                      label: "4주 후 이력서 버전",
                      before: "V1~V2",
                      after: "V4~V5",
                      icon: (
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      ),
                    },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-100 comparison-row"
                    >
                      <td className="py-5 px-6 font-medium border-r border-gray-300">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600">{row.icon}</span>
                          {row.label}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-gray-600 text-center">
                        {row.before}
                      </td>
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
                {
                  label: "4주 후 이력서 버전",
                  before: "V1~V2",
                  after: "V4~V5",
                },
              ].map((row, i) => (
                <div key={i} className="brutal-card p-6">
                  <div className="font-medium text-sm mb-3">{row.label}</div>
                  <div className="flex justify-between items-center">
                    <div className="text-center flex-1">
                      <div className="text-xs text-gray-400 mb-1">
                        일반 첨삭
                      </div>
                      <div className="text-gray-600">{row.before}</div>
                    </div>
                    <div className="text-[#FF6B35] font-mono mx-2 delta-arrow">
                      →
                    </div>
                    <div className="text-center flex-1 bg-[#FF6B35]/10 py-2 -my-1">
                      <div className="text-xs text-gray-600 mb-1">
                        옥토버 코드
                      </div>
                      <div className="font-mono font-bold">
                        <span className="text-highlight">{row.after}</span>
                      </div>
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
            <h2 className="text-2xl md:text-4xl font-bold mb-6 text-center">
              실제 변화
            </h2>
            <p className="text-center text-base text-gray-400 mb-12">
              4주 프로그램 참여자들의 평균 데이터
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {CHANGE_METRICS.map((metric) => (
              <PercentageChangeCard
                key={metric.id}
                label={metric.label}
                before={metric.before}
                after={metric.after}
                unit={metric.id !== "applications" ? "%" : ""}
              />
            ))}
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
                <span className="text-highlight">이력서 개선 횟수</span>가 많을수록
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

      {/* SECTION 6: Social Proof - Redesigned */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          {/* Before/After 이력서 비교 - Image Comparison Slider */}
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                <span className="text-highlight">5번의 피드백</span>으로
                달라지는 이력서
              </h2>
              <p className="text-base text-gray-600">
                마우스를 움직여 V1과 V5를 비교해보세요
              </p>
            </div>
            <ResumeComparisonSlider />
          </AnimatedSection>

          {/* 채팅 스타일 후기 */}
          <AnimatedSection className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                <span className="text-highlight">합격자</span>들의 실제 메시지
              </h2>
              <p className="text-base text-gray-600">
                카카오톡, 슬랙에서 받은 실제 합격 소식
              </p>
            </div>
            <ChatStyleTestimonials />
            <div className="text-center mt-8">
              <a
                href="https://zettalyst.notion.site/22971085f62f8007b6ebdfc184be98ea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border-3 border-black bg-white hover:bg-gray-100 font-bold transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                style={{ boxShadow: "4px 4px 0px #000" }}
              >
                더 많은 합격 후기 보러가기
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 6.5: 실제 합격 스크린샷 */}
      <section className="section-dark py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-white">
                실제로 받은 <span className="text-highlight">합격 메시지</span>
              </h2>
              <p className="text-base text-gray-400">
                카카오톡으로 전달받은 실제 합격 소식들
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <SuccessScreenshots />
          </AnimatedSection>

          {/* YouTube 무료 자료 섹션 */}
          <AnimatedSection>
            <YouTubeVideoSection />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 7: Combined Outcome Section - 4주 후 + Not For Everyone */}
      <section className="striped-bg py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                <span className="text-highlight">4주 후,</span> 당신에게 남는 것
              </h2>
              <p className="text-base text-gray-600">
                기대 결과 <span className="font-mono">vs</span> 제외 기준
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="outcome-container">
              {/* Left Panel - What You Get */}
              <div className="outcome-left">
                <div className="outcome-header outcome-header-dark">
                  <span className="text-white text-highlight">
                    4주 후 당신이 얻는 것
                  </span>
                  <svg
                    className="outcome-check-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
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
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
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
                <div
                  className="outcome-header outcome-header-light"
                  style={{ borderBottomColor: "rgba(0,0,0,0.1)" }}
                >
                  <span className="text-strikethrough">
                    이런 분은 맞지 않습니다
                  </span>
                  <svg
                    className="outcome-no-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                  </svg>
                </div>
                <div>
                  {[
                    {
                      text: "주도력 없이 수동적으로 시키는 것만 하는 사람",
                      sub: "(Follower Mode)",
                    },
                    {
                      text: "미완성을 제출할 수 없는 사람",
                      sub: "(Perfectionism)",
                    },
                    {
                      text: "실행과 노력조차 없이 합격 100%를 보장받고 싶은 사람",
                      sub: "(Magic Pill Mentality)",
                    },
                  ].map((item, i) => (
                    <div key={i} className="outcome-item outcome-item-light">
                      <div className="outcome-x">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </div>
                      <div>
                        <span className="outcome-text outcome-text-light">
                          {item.text}
                        </span>
                        {item.sub && (
                          <div className="outcome-subtext">{item.sub}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Mid CTA #2 */}
          <AnimatedSection className="mt-12">
            <MidCTA />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION: Mentor Profile */}
      <MentorProfileSection />

      {/* Pricing Section */}
      <section id="pricing" className="section-dark py-20 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                어디서 시작해야 할지 모르겠다면
              </h2>
              <p className="text-base text-gray-400">
                진단 → 사고체계 → 결과물. 단계별로 선택하세요.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan 1: [인프런] 이력서 강의 */}
              <div className="brutal-card-dark p-6 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-1">[인프런] 이력서 강의</h3>
                  <p className="text-sm text-gray-400">
                    채용자의 판단 구조를 먼저 이해해야 한다
                  </p>
                </div>

                <div className="mb-2">
                  <span className="font-mono text-3xl font-bold text-[#FF6B35]">
                    ₩33,000
                  </span>
                  <span className="text-gray-400 text-sm ml-2">/ 2시간</span>
                </div>

                {!INFLEARN_LIVE && (
                  <div className="mb-4">
                    <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1">
                      📌 이력서 강의 1월 중 오픈 예정
                    </span>
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-4">
                  경험은 있지만, 그걸 어떻게 말해야 하는지 모르는 사람
                </p>

                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    "채용자가 이력서를 읽는 3단계 판단 구조",
                    "경험을 '성과 언어'로 변환하는 프레임",
                    "JD 해석법: 기업이 실제로 원하는 것",
                    "면접 질문의 숨은 의도 파악법",
                    "멘토링 공통 언어 기초 체계",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-gray-500 mb-4">
                  이력서 강의 1월 중 오픈 예정, 대기 등록 시 50% 할인
                </p>

                <a
                  href="https://www.inflearn.com/course/%EC%8B%A0%EC%9E%85-%EB%B2%A1%EC%97%94%EB%93%9C-%EC%9E%90%EC%86%8C%EC%84%9C-%EB%A9%B4%EC%A0%91-%EC%B9%98%ED%8A%B8%ED%82%A4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 mb-3 hover:opacity-80 transition-opacity"
                >
                  <span className="bg-[#FF6B35] text-white text-xs font-bold px-2 py-0.5">
                    FREE
                  </span>
                  <span className="text-white text-sm">
                    자기소개서 작성 강의 먼저 보기
                  </span>
                </a>

                {INFLEARN_LIVE ? (
                  <a
                    href={PRODUCTS[1].cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 bg-[#FF6B35] text-black font-bold hover:bg-[#ff8555] transition-colors text-center"
                  >
                    강의 바로가기
                  </a>
                ) : isInflearnSubmitted ? (
                  <div className="text-center py-3 bg-green-900/30 border-2 border-green-500">
                    <p className="text-green-400 font-bold text-sm">대기 등록 완료!</p>
                    <p className="text-gray-400 text-xs mt-1">이메일을 확인해주세요</p>
                  </div>
                ) : (
                  <form onSubmit={handleInflearnSubmit}>
                    <div className="flex gap-0">
                      <input
                        type="email"
                        placeholder="이메일 주소"
                        value={inflearnEmail}
                        onChange={(e) => setInflearnEmail(e.target.value)}
                        required
                        disabled={isInflearnLoading}
                        className="flex-1 px-3 py-3 bg-transparent border-2 border-white text-white text-sm focus:outline-none focus:border-[#FF6B35] disabled:opacity-50"
                      />
                      <button
                        type="submit"
                        disabled={isInflearnLoading}
                        className="px-4 py-3 bg-[#FF6B35] text-white font-bold text-sm border-2 border-[#FF6B35] hover:bg-[#ff8555] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isInflearnLoading ? "처리 중..." : "대기 등록"}
                      </button>
                    </div>
                    {inflearnError && (
                      <p className="text-red-400 text-xs mt-2">{inflearnError}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Plan 2: 1회 온라인 멘토링 (Recommend) */}
              <div className="brutal-card-dark p-6 flex flex-col border-[#FF6B35] relative">
                <div className="absolute -top-3 left-4">
                  <span className="bg-[#FF6B35] text-black text-xs font-bold px-3 py-1">
                    RECOMMEND
                  </span>
                </div>

                <div className="mb-4 pt-2">
                  <h3 className="text-lg font-bold mb-1">1회 온라인 멘토링</h3>
                  <p className="text-sm text-gray-400">
                    왜 떨어지는지 30분 만에 알게 된다
                  </p>
                </div>

                <div className="mb-6">
                  <span className="font-mono text-3xl font-bold text-[#FF6B35]">
                    ₩30,000
                  </span>
                  <span className="text-gray-400 text-sm ml-2">/ 30분</span>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  서류·면접에서 반복 탈락하지만 원인을 모르는 사람
                </p>

                <ul className="space-y-3 mb-6 flex-1">
                  {[
                    "이력서·경험 설명 방식의 구조적 문제 진단",
                    "채용자 관점 vs 지원자 관점 간극 확인",
                    "다음 30일 집중해야 할 로드맵 제시",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <svg
                        className="w-4 h-4 text-[#FF6B35] mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-gray-300 mb-4">
                  누적 <span className="text-highlight">30회+</span> 멘토링
                  진행
                </p>

                <a
                  href="https://mentoring.inflearn.com/mentors/2754"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 border-2 border-white text-white font-bold hover:bg-white hover:text-black transition-colors text-center"
                >
                  진단 신청
                </a>
              </div>

              {/* Plan 3: 4주 정기 멘토링 */}
              <div className="brutal-card-dark p-6 flex flex-col relative">
                {/* 가격 라벨 - 동적 가격 */}
                <div className="absolute -right-8 -top-3 bg-[#FF6B35] text-white px-4 py-3 rotate-12 shadow-lg z-10">
                  <div className="text-xs">1개월 프로그램</div>
                  <div className="font-mono text-xl font-bold">
                    {getCurrentPrice()?.priceDisplay || "마감"}
                  </div>
                  <div className="text-xs">주 1회 1시간 멘토링</div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-1">4주 정기 멘토링</h3>
                  <p className="text-sm text-gray-400">
                    4주 후, 제출 가능한 결과물을 들고 나간다
                  </p>
                </div>

                {/* 단계별 가격표 */}
                <div className="mb-4">
                  <TieredPricingTable />
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  혼자서는 정리가 안 되고, 마감과 피드백이 있어야 움직이는 사람
                </p>

                <div className="mb-4 text-sm">
                  <div className="text-gray-400 mb-2 font-mono text-xs">
                    주차별 변화
                  </div>
                  <div className="space-y-2">
                    {WEEKLY_CURRICULUM.map((item) => (
                      <div key={item.week} className="flex items-center gap-2">
                        <span className="font-mono text-[#FF6B35] text-xs w-8">
                          W{item.week}
                        </span>
                        <span className="text-gray-300 text-xs">
                          {item.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6 p-3 bg-gray-800/50 flex-1">
                  <div className="text-xs text-gray-400 mb-2">
                    수료 시 산출물
                  </div>
                  <ul className="space-y-1 text-xs text-gray-300">
                    <li>• 리빌딩된 이력서 최종본 (PDF)</li>
                    <li>• 면접 답변 프레임 시트 (30개)</li>
                    <li>• 1:1 피드백 기록 전문</li>
                  </ul>
                </div>

                <p className="text-xs text-gray-300 mb-4">
                  누적 <span className="text-highlight">15명</span> 수료,{" "}
                  <span className="text-highlight">12명</span> 최종 합격
                </p>

                <a
                  href="https://open.kakao.com/o/sXxBmmoh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#FF6B35] text-white font-bold hover:bg-[#ff8555] transition-colors text-center"
                >
                  4주 프로그램 상담
                </a>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-8">
              어느 단계부터 시작해야 할지 모르겠다면,{" "}
              <span className="text-highlight text-white">
                <a
                  href="https://mentoring.inflearn.com/mentors/2754"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-highlight"
                >
                  1회 온라인 멘토링
                </a>
              </span>
              을 먼저 신청하세요.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <FAQ />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 8: Final CTA - 비공개 단톡방 */}
      <section id="final-cta" className="section-dark py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div className="text-center mb-8">
              {/* 타겟 배지 */}
              <div className="mb-4">
                <span className="inline-block text-sm md:text-base text-gray-300 font-medium">
                  개발자 취업 준비 중이라면
                </span>
              </div>

              {/* 헤드라인 */}
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                <span className="text-strikethrough">방향 없이 혼자서</span> 3개월 준비한 이력서가
                <br />
                기술 면접관에게는{" "}
                <span className="text-[#FF6B35]">&apos;1분 컷&apos;</span>
                이라는 사실,
                <br className="hidden md:block" />
                알고 계셨나요?
              </h2>

              {/* 강조 메시지 */}
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white inline-block transform -rotate-1">
                <span className="text-highlight">
                  대표멘토가 직접 알려드립니다.
                </span>
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            {isSubmitted ? (
              <div className="brutal-card-dark p-8 text-center">
                <div className="text-5xl mb-4">📧</div>
                <h3 className="text-2xl font-bold mb-3 text-white">이메일을 확인하세요!</h3>
                <p className="text-gray-300 text-lg">
                  5분 내로 템플릿과
                  <br />
                  단톡방 입장 링크가 도착합니다.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  스팸함도 확인해주세요
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Free badge */}
                <div className="absolute top-0 -right-2 md:-top-2 md:-right-4 z-10 transform rotate-6">
                  <div className="bg-[#22c55e] text-white px-4 py-3 md:px-6 md:py-4 shadow-lg border-3 border-white">
                    <div className="font-mono text-2xl md:text-3xl font-bold text-center">
                      무료
                    </div>
                    <div className="text-xs md:text-sm text-center opacity-90">
                      100명 한정
                    </div>
                  </div>
                </div>

                {/* Mentor badge - 2개로 축소 */}
                <div className="mb-6 flex flex-wrap gap-2 justify-center">
                  <span className="inline-flex items-center gap-1 bg-[#0a0a0a] border-2 border-white px-3 py-1 text-sm font-medium text-white">
                    <span className="text-green-400">✓</span> 전 네이버 기술
                    면접관
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#0a0a0a] border-2 border-white px-3 py-1 text-sm font-medium text-white">
                    <span className="text-green-400">✓</span> 현 SW마에스트로
                    멘토
                  </span>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className={`brutal-card-dark p-6 md:p-8 ${highlightCTA ? "cta-highlight" : ""}`}
                >
                  {/* 메인 오퍼 - 이력서 템플릿 강조 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">★</span>
                      <span className="text-sm font-medium text-[#FF6B35]">
                        무료 제공
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                      면접관 시점 이력서 템플릿+포트폴리오 샘플
                    </h3>
                    <p className="text-gray-300 text-sm">
                      · 즉시 다운로드 가능
                    </p>
                  </div>

                  {/* 구분선 */}
                  <div className="border-t border-gray-600 my-4" />

                  {/* 보조 혜택 */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-2">
                      + 추가로 드리는 것들
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-gray-200 text-sm">
                        <span className="text-[#FF6B35]">✓</span>
                        <span>합격자 포트폴리오 레퍼런스</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-200 text-sm">
                        <span className="text-[#FF6B35]">✓</span>
                        <span>멘토 무료 Q&A 단톡방</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-0">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="이메일 주소를 입력하세요"
                      required
                      disabled={isLoading}
                      className="flex-1 px-4 py-4 border-3 border-white bg-transparent text-white focus:outline-none focus:border-[#FF6B35] text-base md:text-lg placeholder:text-gray-400 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-[#FF6B35] text-white px-6 py-4 font-bold text-base md:text-lg border-3 border-white md:border-l-0 hover:bg-[#e55a2b] transition-colors whitespace-nowrap cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "처리 중..." : "이메일만 입력하면 바로 받기"}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 gap-4">
                    <CommunityProgress />
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <span className="text-xs">
                        스팸 없음 · 언제든 구독 취소 가능
                      </span>
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
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 md:gap-4">
          {/* 상단 행: 텍스트 + 카운트다운 (왼쪽 정렬) */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2">
              <span className="bg-[#22c55e] text-white px-2 py-0.5 text-xs font-bold rounded">
                무료
              </span>
              <span className="text-xs md:text-sm text-gray-600">
                이력서 템플릿+포트폴리오 샘플
              </span>
            </div>

            {/* 데스크탑: 카운트다운 + 남은 자리 (왼쪽에 붙음) */}
            {!isDeadlinePassed() && (
              <div className="hidden md:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">마감까지</span>
                  <CountdownCompact targetDate={TEMPLATE_DEADLINE} />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">남은 자리</span>
                  <span className="font-mono font-bold text-[#FF6B35]">
                    {getCommunityRemainingSeats()}명
                  </span>
                </div>
              </div>
            )}

            {/* 데스크탑: 마감 후 */}
            {isDeadlinePassed() && (
              <div className="hidden md:flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-red-500">1기 마감</span>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={scrollToCTA}
              className="brutal-btn bg-[#FF6B35] text-white px-4 md:px-6 py-2 font-bold text-xs md:text-base whitespace-nowrap"
            >
              {isDeadlinePassed() ? "다음 기수 알림 받기 →" : "바로 받기 →"}
            </button>
          </div>

          {/* 모바일: 하단 행에 카운트다운 + 남은 자리 */}
          {!isDeadlinePassed() && (
            <div className="w-full flex md:hidden items-center justify-center gap-3 text-xs pt-1 border-t border-gray-200 mt-1">
              <CountdownCompact targetDate={TEMPLATE_DEADLINE} />
              <span className="text-gray-300">|</span>
              <span className="text-gray-500">
                남은 자리{" "}
                <span className="font-bold text-[#FF6B35]">
                  {getCommunityRemainingSeats()}명
                </span>
              </span>
            </div>
          )}

          {/* 모바일: 마감 후 */}
          {isDeadlinePassed() && (
            <div className="w-full flex md:hidden items-center justify-center text-xs pt-1 border-t border-gray-200 mt-1">
              <span className="font-mono font-bold text-red-500">1기 마감</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
