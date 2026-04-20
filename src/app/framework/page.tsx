"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

import { AnimatedSection, ScrollProgress } from "@/components/landing/ui";
import { Footer } from "@/components/landing/sections";
import { FRAMEWORK_COMPETENCIES } from "@/lib/constants";

export default function FrameworkPage() {
  useEffect(() => {
    posthog.capture("landing_viewed", { page: "framework" });
  }, []);

  return (
    <>
      <main>
        <ScrollProgress />

        {/* ============================================ */}
        {/* HERO */}
        {/* ============================================ */}
        <section className="section-dark min-h-[70vh] flex items-center">
          <div className="max-w-5xl mx-auto px-6 py-20 md:py-32">
            <div className="mb-4">
              <span className="inline-block bg-accent text-white px-3 py-1 text-sm font-mono font-bold">
                FRAMEWORK
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              우리가 <span className="text-highlight">훈련</span>하는 다섯 가지
            </h1>
            <p className="mt-8 text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              엔지니어에게 지혜란 훈련 가능한 영역이다.
              <br />
              <span className="text-white font-medium">
                이 가설 위에 다섯 개의 역량이 있습니다.
              </span>
            </p>
          </div>
        </section>

        {/* ============================================ */}
        {/* HYPOTHESIS */}
        {/* ============================================ */}
        <section className="section-light py-20 md:py-28">
          <div className="max-w-3xl mx-auto px-6">
            <AnimatedSection>
              <span className="font-mono text-sm text-accent tracking-widest mb-4 block">
                HYPOTHESIS
              </span>
              <h2 className="text-2xl md:text-4xl font-bold mb-6">
                판단은 기술, 지혜는 인격.
              </h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                판단은 한 순간의 선택입니다. 제출과 피드백의 반복으로 단련할 수 있습니다.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
                지혜는 누적된 판단에서 자라납니다. 태도, 겸손, 책임감으로 드러납니다.
                코드를 쓰는 기술만으로는 닿을 수 없는 자리입니다.
              </p>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                옥토버 아카데미는 판단과 지혜를 투 트랙으로 훈련합니다.
                아래 다섯 개의 역량은 그 훈련의 지도입니다.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* ============================================ */}
        {/* COMPETENCIES */}
        {/* ============================================ */}
        <section className="section-dark py-20 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="font-mono text-sm text-accent tracking-widest mb-4 block">
                  5 COMPETENCIES
                </span>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">
                  다섯 개의 훈련 축
                </h2>
                <p className="text-gray-400">
                  사고 습관이 측정 가능한 역량으로 이어집니다.
                </p>
              </div>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FRAMEWORK_COMPETENCIES.map((c, i) => (
                <AnimatedSection key={c.id}>
                  <div className="brutal-card-dark p-6 flex flex-col h-full">
                    <div className="font-mono text-xs text-accent mb-3">
                      0{i + 1} · {c.en}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3">{c.ko}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {c.summary}
                    </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
