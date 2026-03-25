"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { AnimatedSection, ScrollProgress } from "@/components/landing/ui";
import { Footer } from "@/components/landing/sections";
import {
  PRODUCT_CARDS,
  GARAGE_INFO,
} from "@/lib/constants";

const WORKER_URL =
  process.env.NEXT_PUBLIC_SUBSCRIBE_WORKER_URL ||
  "https://october-subscribe.sparkling-moon-3d5b.workers.dev";

export default function HubPage() {
  const [leagueEmail, setLeagueEmail] = useState("");
  const [leagueSubmitted, setLeagueSubmitted] = useState(false);
  const [leagueLoading, setLeagueLoading] = useState(false);
  const [leagueError, setLeagueError] = useState<string | null>(null);

  const handleLeagueWaitlist = async (e: FormEvent) => {
    e.preventDefault();
    if (!leagueEmail || leagueLoading) return;

    setLeagueLoading(true);
    setLeagueError(null);

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leagueEmail, type: "league" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "등록 중 오류가 발생했습니다");
      }

      setLeagueSubmitted(true);
      setLeagueEmail("");
    } catch (err) {
      setLeagueError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다"
      );
    } finally {
      setLeagueLoading(false);
    }
  };

  return (
    <>
      <main>
        <ScrollProgress />

        {/* ============================================ */}
        {/* HERO */}
        {/* ============================================ */}
        <section className="section-dark loop-section-bg min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
            <div className="mb-4">
              <span className="inline-block bg-accent text-white px-3 py-1 text-sm font-mono font-bold">
                OCTOBER ACADEMY
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              AI Agent가 코드를 쓰는 시대,
              <br />
              <span className="text-highlight">개발자의 가치</span>는
              <br />
              어디서 오는가?
            </h1>

            <p className="mt-8 text-lg text-gray-400 max-w-2xl leading-relaxed">
              코드를 작성하는 능력은 더 이상 희소하지 않습니다.
              <br />
              <span className="text-white font-medium">
                풀 문제를 선택하는 판단
              </span>
              이 진짜 가치입니다.
            </p>

            <div className="mt-10">
              <a
                href="#products"
                className="btn-primary inline-block"
              >
                나에게 맞는 경로 찾기 →
              </a>
              <p className="mt-4 font-mono text-sm text-gray-600">
                멘토링 · Agentic30 · League
              </p>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SOLUTION — 제품 허브 */}
        {/* ============================================ */}
        <section id="products" className="section-dark py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="font-mono text-sm text-accent tracking-widest mb-4 block">
                  YOUR PATH
                </span>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  <a href="https://agentic30.app/blog/agentic-engineer" target="_blank" rel="noopener noreferrer" className="text-highlight hover:opacity-80 transition-opacity">Agentic Engineer</a>로의
                  3가지 경로
                </h2>
                <p className="text-gray-400">
                  당신의 상황에 맞는 경로를 선택하세요.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {PRODUCT_CARDS.map((product) => (
                <AnimatedSection key={product.id}>
                  <div
                    className={`brutal-card-dark p-6 flex flex-col h-full ${
                      product.id === "agentic30" ? "border-accent shadow-[4px_4px_0px_#FF6B35]" : ""
                    } relative`}
                  >
                    {product.id === "agentic30" && (
                      <div className="absolute -top-3 left-4">
                        <span className="bg-accent text-black text-xs font-bold px-3 py-1">
                          RECOMMEND
                        </span>
                      </div>
                    )}
                    {"isComingSoon" in product && product.isComingSoon && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 border border-gray-600">
                          COMING SOON
                        </span>
                      </div>
                    )}

                    {product.posterImage && (
                      <div
                        className="flex justify-center items-center py-6 mb-4 rounded-sm"
                        style={{ background: product.posterGlow }}
                      >
                        <img
                          src={product.posterImage}
                          alt={`${product.name} 포스터`}
                          width={160}
                          height={160}
                          className="w-[140px] h-[140px] md:w-[160px] md:h-[160px] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="mb-4">
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-accent text-sm font-medium">
                        {product.tagline.includes("Agentic Engineer") ? (
                          <>
                            <a href="https://agentic30.app/blog/agentic-engineer" target="_blank" rel="noopener noreferrer" className="text-highlight hover:opacity-80 transition-opacity">Agentic Engineer</a>
                            {product.tagline.split("Agentic Engineer")[1]}
                          </>
                        ) : product.tagline}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm mb-6 whitespace-pre-line">
                      {product.description.includes("Agentic Engineer") ? (
                        <>
                          {product.description.split("Agentic Engineer")[0]}
                          <a href="https://agentic30.app/blog/agentic-engineer" target="_blank" rel="noopener noreferrer" className="text-highlight hover:opacity-80 transition-opacity">Agentic Engineer</a>
                          {product.description.split("Agentic Engineer")[1]}
                        </>
                      ) : product.description}
                    </p>

                    {product.metric.value && product.metric.label && (
                      <div className="mb-6 p-3 bg-gray-800/50">
                        <span className="font-mono text-2xl font-bold text-accent">
                          {product.metric.value}
                        </span>
                        <span className="text-gray-400 text-sm ml-2">
                          {product.metric.label}
                        </span>
                      </div>
                    )}

                    <div className="mt-auto">
                    {product.isExternal ? (
                      <a
                        href={product.cta.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                          product.id === "agentic30"
                            ? "btn-primary"
                            : "btn-outline"
                        } btn-block py-3 text-center`}
                      >
                        {product.cta.text}
                      </a>
                    ) : product.id === "league" ? (
                      leagueSubmitted ? (
                        <div className="text-center text-green-400 font-bold py-3">
                          ✓ 등록 완료! 론칭 시 알려드리겠습니다.
                        </div>
                      ) : (
                        <form onSubmit={handleLeagueWaitlist} className="flex flex-col gap-2">
                          <div className="flex w-full">
                            <input
                              type="email"
                              value={leagueEmail}
                              onChange={(e) => setLeagueEmail(e.target.value)}
                              placeholder="이메일 주소"
                              required
                              disabled={leagueLoading}
                              className="min-w-0 flex-1 px-3 border-3 border-black bg-white text-black focus:outline-none focus:border-accent text-sm placeholder:text-gray-400 disabled:opacity-50 h-[54px]"
                            />
                            <button
                              type="submit"
                              disabled={leagueLoading}
                              className="bg-accent text-white px-4 font-bold border-3 border-black border-l-0 hover:brightness-110 transition-colors cursor-pointer disabled:opacity-70 text-sm whitespace-nowrap h-[54px] flex-shrink-0"
                            >
                              {leagueLoading ? "..." : "대기자 등록"}
                            </button>
                          </div>
                          {leagueError && (
                            <div className="text-red-500 text-xs">{leagueError}</div>
                          )}
                        </form>
                      )
                    ) : (
                      <Link
                        href={product.cta.href}
                        className="btn-primary btn-block py-3 text-center"
                      >
                        {product.cta.text}
                      </Link>
                    )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>


        {/* ============================================ */}
        {/* COMMUNITY — Agentic Garage */}
        {/* ============================================ */}
        <section className="section-light py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="font-mono text-sm text-accent tracking-widest">
                    COMMUNITY
                  </span>
                  <a href="https://posthog.com/" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 border border-gray-300 px-2 py-0.5 hover:text-accent transition-colors">
                    Supported by {GARAGE_INFO.poweredBy}
                  </a>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  {GARAGE_INFO.name}
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  {GARAGE_INFO.tagline}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="brutal-card p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Poster */}
                  <div className="flex-shrink-0 mx-auto md:mx-0">
                    <img
                      src={GARAGE_INFO.posterImage}
                      alt="Agentic Garage Seoul #1 — Build, Ship, Repeat"
                      width={200}
                      height={200}
                      className="border-3 border-black shadow-[4px_4px_0px_#000] w-[160px] md:w-[200px]"
                      loading="lazy"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex flex-col">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {GARAGE_INFO.description}
                    </p>

                    <div className="text-sm text-gray-500 space-y-1 mb-4">
                      {GARAGE_INFO.targetAudience.map((item, i) => (
                        <div key={i} className="flex items-start gap-1.5">
                          <span className="text-accent">·</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Session flow - inline */}
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-4">
                      {GARAGE_INFO.sessionStructure.map((session, i) => (
                        <span key={i} className="flex items-center gap-2">
                          <span><span className="text-accent font-bold">{session.duration}</span> {session.activity}</span>
                          {i < GARAGE_INFO.sessionStructure.length - 1 && (
                            <span className="text-accent">→</span>
                          )}
                        </span>
                      ))}
                    </div>

                    {/* Event info + CTA */}
                    <div className="mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200">
                      <div className="text-sm">
                        <span className="font-bold">{GARAGE_INFO.nextEvent.date}</span>
                        <span className="text-gray-400 mx-2">·</span>
                        <span className="text-gray-500">{GARAGE_INFO.nextEvent.location}</span>
                      </div>
                      <a
                        href={GARAGE_INFO.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline-dark px-6 py-2"
                      >
                        참가 신청 →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>


        {/* ============================================ */}
        {/* FINAL CTA — 카카오톡 상담 */}
        {/* ============================================ */}
        <section className="section-dark cta-section-bg py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">
                  어디서 시작해야 할지
                  <br />
                  <span className="text-highlight">모르겠다면</span>
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                  1:1 멘토링, Agentic30, Agentic League — 어떤 경로가 나에게 맞는지
                  <br />
                  대표 멘토가 직접 안내해드립니다.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <a
                    href="https://open.kakao.com/o/sXxBmmoh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary px-10 py-5 text-xl"
                  >
                    카카오톡으로 1:1 상담 →
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
