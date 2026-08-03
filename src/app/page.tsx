"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

import AgenticHero from "@/components/landing/agentic/AgenticHero";
import { AGX_PRODUCTS, AGX_GARAGE, AGX_HERO, BUSINESS_INFO, FOOTER_LINKS } from "@/lib/constants";

function useSectionTracker<T extends HTMLElement = HTMLElement>(
  sectionName: string
) {
  const ref = useRef<T>(null);
  const tracked = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true;
          posthog.capture("landing_section_viewed", {
            section: sectionName,
            page: "hub",
          });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionName]);

  return ref;
}

/* 크레스트 SVG — 목업 verbatim (React 카멜케이스 변환) */
function Crest({ variant }: { variant: "mentoring" | "agentic30" }) {
  if (variant === "mentoring") {
    return (
      <svg
        viewBox="0 0 200 224"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="1:1 멘토링 크레스트"
      >
        <polygon points="38,38 178,38 178,158 108,198 38,158" fill="#FF8806" />
        <rect x="18" y="14" width="164" height="14" fill="#000000" />
        <polygon
          points="30,30 170,30 170,150 100,190 30,150"
          fill="#000000"
          stroke="#616161"
          strokeWidth="6"
        />
        <text
          x="100"
          y="62"
          textAnchor="middle"
          fontFamily="'JetBrains Mono',ui-monospace,monospace"
          fontWeight="800"
          fontSize="17"
          letterSpacing="3"
          fill="#F4EDDE"
        >
          AGENTIC
        </text>
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fontFamily="'JetBrains Mono',ui-monospace,monospace"
          fontWeight="800"
          fontSize="52"
          fill="#FF8806"
        >
          1:1
        </text>
        <rect x="34" y="127" width="132" height="23" fill="#FF8806" />
        <text
          x="100"
          y="142.5"
          textAnchor="middle"
          fontFamily="'JetBrains Mono',ui-monospace,monospace"
          fontWeight="800"
          fontSize="12"
          letterSpacing="1.5"
          fill="#000000"
        >
          MENTORING
        </text>
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 200 224"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Agentic30 크레스트"
    >
      <polygon points="38,38 178,38 178,158 108,198 38,158" fill="#FF8806" />
      <rect x="18" y="14" width="164" height="14" fill="#000000" />
      <polygon
        points="30,30 170,30 170,150 100,190 30,150"
        fill="#000000"
        stroke="#616161"
        strokeWidth="6"
      />
      <text
        x="100"
        y="62"
        textAnchor="middle"
        fontFamily="'JetBrains Mono',ui-monospace,monospace"
        fontWeight="800"
        fontSize="17"
        letterSpacing="3"
        fill="#F4EDDE"
      >
        AGENTIC
      </text>
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontFamily="'JetBrains Mono',ui-monospace,monospace"
        fontWeight="800"
        fontSize="52"
        fill="#FF8806"
      >
        30
      </text>
      <rect x="34" y="127" width="132" height="23" fill="#FF8806" />
      <text
        x="100"
        y="142.5"
        textAnchor="middle"
        fontFamily="'JetBrains Mono',ui-monospace,monospace"
        fontWeight="800"
        fontSize="8.4"
        fill="#000000"
      >
        100 USERS · FIRST REVENUE
      </text>
    </svg>
  );
}

export default function HubPage() {
  const heroRef = useSectionTracker<HTMLDivElement>("hero");
  const productsRef = useSectionTracker("products");
  const communityRef = useSectionTracker("community");
  const finalCtaRef = useSectionTracker("final_cta");

  useEffect(() => {
    posthog.capture("landing_viewed", { page: "hub" });
  }, []);

  /* 스크롤 리빌 — 목업 스크립트와 동일 (reduced-motion이면 전부 .in) */
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".agx .reveal")
    );
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rm || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const trackCta = (section: string, label: string) => {
    posthog.capture("landing_cta_clicked", { section, label, page: "hub" });
  };

  return (
    <>
      <div className="agx">
        <main>
          {/* ============================================ */}
          {/* HERO */}
          {/* ============================================ */}
          <div ref={heroRef}>
            <AgenticHero />
          </div>

          {/* ============================================ */}
          {/* PRODUCTS — 교육 프로그램 */}
          {/* ============================================ */}
          <section ref={productsRef} className="sec" id="products">
            <div className="container">
              <div className="sec-head reveal">
                <span className="sec-label">Curriculum</span>
                <h2>교육 프로그램</h2>
                <p>나에게 맞는 과정부터 시작하세요.</p>
              </div>

              <div className="cards">
                {AGX_PRODUCTS.map((product) => {
                  const isExternal = product.cta.href.startsWith("http");
                  return (
                    <article
                      key={product.id}
                      className={`card${product.recommend ? " card-recommend" : ""} reveal`}
                    >
                      {product.recommend && (
                        <span className="card-flag flag-reco">RECOMMEND</span>
                      )}
                      <div className="crest">
                        <Crest variant={product.crest} />
                      </div>
                      <h3>{product.name}</h3>
                      <p className="card-tag">{product.tag}</p>
                      <p className="card-for">
                        <b>이런 분께</b>
                        <span className="tx">
                          <span className="bk">[</span> {product.forWhom}{" "}
                          <span className="bk">]</span>
                        </span>
                      </p>
                      <ul>
                        {product.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                      {product.proof && (
                        <p className="card-proof">
                          {product.proof.map((seg, i) =>
                            "strong" in seg && seg.strong ? (
                              <b key={i}>{seg.text}</b>
                            ) : (
                              <Fragment key={i}>{seg.text}</Fragment>
                            )
                          )}
                        </p>
                      )}
                      {isExternal ? (
                        <a
                          className="ag-btn ag-btn-primary ag-btn-block"
                          href={product.cta.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackCta(`product_${product.id}`, product.cta.label)
                          }
                        >
                          {product.cta.label}
                        </a>
                      ) : (
                        <Link
                          className="ag-btn ag-btn-secondary ag-btn-block"
                          href={product.cta.href}
                          onClick={() =>
                            trackCta(`product_${product.id}`, product.cta.label)
                          }
                        >
                          {product.cta.label}
                        </Link>
                      )}
                    </article>
                  );
                })}
              </div>

              <p className="choose-help reveal">
                뭘 골라야 할지 모르겠다면 —{" "}
                <a
                  href={AGX_HERO.contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackCta("products", "카카오톡으로 바로 물어보세요")
                  }
                >
                  카카오톡으로 바로 물어보세요 →
                </a>
              </p>
            </div>
          </section>

          {/* ============================================ */}
          {/* COMMUNITY — Agentic Garage */}
          {/* ============================================ */}
          <section ref={communityRef} className="sec" id="community">
            <div className="container">
              <div className="sec-head reveal">
                <span className="sec-label">Community</span>
                <a
                  className="posthog-chip"
                  href="https://posthog.com/ko"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Supported by PostHog
                </a>
                <h2>Agentic Garage Seoul</h2>
                <p>동료 사이에서 성장하는 자리</p>
              </div>

              <div className="gcard reveal">
                <div className="gposter">
                  <svg
                    viewBox="0 0 240 240"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Agentic Garage Seoul 포스터"
                  >
                    <rect width="240" height="240" fill="#000000" />
                    <rect x="0" y="0" width="240" height="10" fill="#FF8806" />
                    <text
                      x="22"
                      y="66"
                      fontFamily="'JetBrains Mono',ui-monospace,monospace"
                      fontWeight="800"
                      fontSize="30"
                      fill="#FF8806"
                    >
                      AGENTIC
                    </text>
                    <text
                      x="22"
                      y="102"
                      fontFamily="'JetBrains Mono',ui-monospace,monospace"
                      fontWeight="800"
                      fontSize="30"
                      fill="#F4EDDE"
                    >
                      GARAGE
                    </text>
                    <rect x="22" y="120" width="104" height="26" fill="#FF8806" />
                    <text
                      x="30"
                      y="139"
                      fontFamily="'JetBrains Mono',ui-monospace,monospace"
                      fontWeight="800"
                      fontSize="15"
                      fill="#000000"
                    >
                      SEOUL #1
                    </text>
                    <text
                      x="22"
                      y="186"
                      fontFamily="'JetBrains Mono',ui-monospace,monospace"
                      fontWeight="700"
                      fontSize="13"
                      fill="#8F8F8F"
                    >
                      BUILD. SHIP.
                    </text>
                    <text
                      x="22"
                      y="206"
                      fontFamily="'JetBrains Mono',ui-monospace,monospace"
                      fontWeight="700"
                      fontSize="13"
                      fill="#8F8F8F"
                    >
                      REPEAT.
                    </text>
                    <rect x="0" y="230" width="240" height="10" fill="#FF8806" />
                  </svg>
                </div>
                <div>
                  <p className="lead">
                    {AGX_GARAGE.lead[0]}
                    <br />
                    {AGX_GARAGE.lead[1]}
                  </p>
                  <ul>
                    {AGX_GARAGE.targetAudience.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <div className="gflow">
                    {AGX_GARAGE.sessionFlow.map(([duration, activity], i) => (
                      <Fragment key={`${duration}-${activity}`}>
                        <span className="step">
                          <b>{duration}</b> {activity}
                        </span>
                        {i < AGX_GARAGE.sessionFlow.length - 1 && (
                          <span className="arr">→</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                  <div className="gmeta">
                    <p className="facts">
                      {AGX_GARAGE.facts.location} ·{" "}
                      <b>{AGX_GARAGE.facts.capacity}</b>
                      <br />
                      {AGX_GARAGE.facts.deposit}{" "}
                      <b>{AGX_GARAGE.facts.depositNote}</b>
                    </p>
                    <a
                      className="ag-btn ag-btn-primary"
                      href={AGX_GARAGE.ctaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackCta("community", "참가 신청")}
                    >
                      참가 신청
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* FINAL CTA — 카카오톡 상담 */}
          {/* ============================================ */}
          <section ref={finalCtaRef} className="final">
            <div className="container reveal">
              <h2>
                어디서 시작해야 할지 <span className="ag-accent">모르겠다면</span>
              </h2>
              <p>
                어떤 과정이 지금 나에게 맞는지, 직접 물어보세요.
                <br />
                옥토버 아카데미가 답해드립니다.
              </p>
              <a
                className="ag-btn ag-btn-primary ag-btn-lg"
                href={AGX_HERO.contact.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta("final_cta", "문의하기")}
              >
                문의하기
              </a>
            </div>
          </section>

          {/* ============================================ */}
          {/* FOOTER — 다크 (목업 이식) */}
          {/* ============================================ */}
          <footer>
            <div className="container">
              <div className="foot-top">
                <div className="foot-brand">
                  <span className="logo">
                    <Image src="/assets/logo-mark.png" alt="" width={100} height={96} style={{ width: "auto", height: 24 }} />
                    <span>October Academy</span>
                  </span>
                  <small><b>Agentic Engineer</b> 양성 교육기관</small>
                </div>
                <div className="foot-links">
                  {FOOTER_LINKS.legal.map((link) => (
                    <Link key={link.label} href={link.href}>{link.label}</Link>
                  ))}
                </div>
              </div>
              <div className="foot-biz">
                대표: {BUSINESS_INFO.ceo} | 개인정보보호책임자: {BUSINESS_INFO.privacyOfficer}<br />
                사업자등록번호: {BUSINESS_INFO.businessNumber} | 통신판매업신고: {BUSINESS_INFO.ecommerceNumber}{" "}
                <a href={BUSINESS_INFO.businessLookupUrl} target="_blank" rel="noreferrer">사업자 정보 확인 ↗</a><br />
                {BUSINESS_INFO.address}<br />
                전화: {BUSINESS_INFO.phone} | 이메일:{" "}
                <a href={`mailto:${BUSINESS_INFO.email}`}>{BUSINESS_INFO.email}</a>
              </div>
              <p className="foot-copy">{BUSINESS_INFO.copyright}</p>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}
