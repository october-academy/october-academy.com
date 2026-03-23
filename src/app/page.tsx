"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import { AnimatedSection, ScrollProgress } from "@/components/landing/ui";
import { Footer } from "@/components/landing/sections";
import {
  PROBLEM_CASES,
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
        body: JSON.stringify({ email: leagueEmail }),
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
        <section className="section-dark min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
            <AnimatedSection>
              <div className="mb-4">
                <span className="inline-block bg-accent text-white px-3 py-1 text-sm font-mono font-bold">
                  OCTOBER ACADEMY
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                AI Agent가 코드를 쓰는 시대,
                <br />
                <span className="text-highlight">개발자의 가치</span>는
                <br />
                어디서 오는가?
              </h1>
            </AnimatedSection>

            <AnimatedSection className="mt-8">
              <p className="text-lg text-gray-400 max-w-2xl leading-relaxed">
                코드를 작성하는 능력은 더 이상 희소하지 않습니다.
                <br />
                <span className="text-white font-medium">
                  풀 문제를 선택하는 판단
                </span>
                이 진짜 가치입니다.
              </p>
            </AnimatedSection>

            <AnimatedSection className="mt-10">
              <a
                href="#products"
                className="btn-primary inline-block"
              >
                나에게 맞는 경로 찾기 →
              </a>
            </AnimatedSection>
          </div>
        </section>

        {/* ============================================ */}
        {/* PROBLEM — 사례 중심 증거 */}
        {/* ============================================ */}
        <section className="section-light py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <AnimatedSection>
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                채용 시장이{" "}
                <span className="text-accent">이미 바뀌고 있습니다</span>
              </h2>
              <p className="text-gray-600 mb-12">
                2026년, 기업들은 코딩 능력이 아닌{" "}
                <span className="text-highlight">AI 활용 역량</span>을
                평가합니다.
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-3 gap-6">
              {PROBLEM_CASES.map((item) => (
                <AnimatedSection key={item.name}>
                  <div className="brutal-card p-6 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-accent text-white text-xs font-bold px-2 py-0.5">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-accent hover:underline"
                      >
                        자세히 보기 →
                      </a>
                      {"problemUrl" in item && item.problemUrl && (
                        <a
                          href={item.problemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold bg-accent text-white px-3 py-1 hover:brightness-110 transition-colors"
                        >
                          문제
                        </a>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
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
                  <span className="text-highlight">Agentic Engineer</span>로의
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
                      product.id === "agentic30" ? "border-accent" : ""
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
                        <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1">
                          COMING SOON
                        </span>
                      </div>
                    )}

                    <div className="mb-4 pt-2">
                      <h3 className="text-xl font-bold mb-1">{product.name}</h3>
                      <p className="text-accent text-sm font-medium">
                        {product.tagline}
                      </p>
                    </div>

                    <p className="text-gray-400 text-sm mb-6">
                      {product.description}
                    </p>

                    {product.metric.label && (
                      <div className="mb-6 p-3 bg-gray-800/50">
                        <span className="font-mono text-2xl font-bold text-accent">
                          {product.metric.value}
                        </span>
                        {product.metric.label && (
                          <span className="text-gray-400 text-sm ml-2">
                            {product.metric.label}
                          </span>
                        )}
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
                          <div className="flex gap-0">
                            <input
                              type="email"
                              value={leagueEmail}
                              onChange={(e) => setLeagueEmail(e.target.value)}
                              placeholder="이메일 주소"
                              required
                              disabled={leagueLoading}
                              className="flex-1 px-3 py-3 border-3 border-black bg-white text-black focus:outline-none focus:border-accent text-sm placeholder:text-gray-400 disabled:opacity-50"
                            />
                            <button
                              type="submit"
                              disabled={leagueLoading}
                              className="bg-accent text-white px-4 py-3 font-bold border-3 border-black border-l-0 hover:brightness-110 transition-colors cursor-pointer disabled:opacity-70 text-sm whitespace-nowrap"
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
        <section className="section-dark py-20 md:py-32">
          <div className="max-w-5xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center mb-12">
                <div className="mb-4 flex items-center justify-center gap-2">
                  <span className="font-mono text-sm text-accent tracking-widest">
                    COMMUNITY
                  </span>
                  <span className="text-xs text-gray-500 border border-gray-600 px-2 py-0.5">
                    Powered by {GARAGE_INFO.poweredBy}
                  </span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  {GARAGE_INFO.name}
                </h2>
                <p className="text-xl text-gray-300">
                  {GARAGE_INFO.tagline}
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="brutal-card-dark p-6 md:p-8">
                <p className="text-gray-400 mb-8 text-center max-w-2xl mx-auto whitespace-pre-line">
                  {GARAGE_INFO.description}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {GARAGE_INFO.sessionStructure.map((session, i) => (
                    <div
                      key={i}
                      className="p-4 border border-gray-700 text-center"
                    >
                      <div className="font-mono text-accent text-sm mb-1">
                        {session.duration}
                      </div>
                      <div className="text-white text-sm font-medium">
                        {session.activity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{GARAGE_INFO.location}</span>
                    <span>|</span>
                    <span>{GARAGE_INFO.schedule}</span>
                  </div>
                  <a
                    href={GARAGE_INFO.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline px-6 py-2"
                  >
                    참가 신청 →
                  </a>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>


        {/* ============================================ */}
        {/* FINAL CTA — 카카오톡 상담 */}
        {/* ============================================ */}
        <section className="section-dark py-20 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center">
                <h2 className="text-2xl md:text-4xl font-bold mb-6">
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
                    className="btn-primary px-8 py-4 text-lg"
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
