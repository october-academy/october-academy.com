"use client";

import { Fragment, useEffect, useRef } from "react";
import posthog from "posthog-js";
import HeroShader from "./HeroShader";
import { AGX_HERO, AGX_CONSOLE } from "@/lib/constants";

export default function AgenticHero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // 콘솔 셋업 타이프라이터 (원본: 라벨 고정 + 값 순차 타이핑 + 블록 커서)
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const pre = root.querySelector(".console pre");
    if (!pre) return;
    const vals = Array.from(pre.querySelectorAll("b"));
    const cur = document.createElement("span");
    cur.className = "cur";
    const rmc = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rmc || !vals.length) {
      vals.forEach((b) => {
        b.textContent = b.dataset.v ?? "";
      });
      if (vals.length) vals[vals.length - 1].after(cur);
      return () => {
        cur.remove();
      };
    }
    let timer: number | undefined;
    let vi = 0;
    function typeNext() {
      if (vi >= vals.length) return; /* 커서는 마지막 값 뒤에서 정지 */
      const b = vals[vi++];
      const v = b.dataset.v ?? "";
      let i = 0;
      b.after(cur);
      (function step() {
        b.textContent = v.slice(0, ++i);
        if (i < v.length) timer = window.setTimeout(step, 14 + Math.random() * 26);
        else timer = window.setTimeout(typeNext, 110);
      })();
    }
    timer = window.setTimeout(typeNext, 500);
    return () => {
      window.clearTimeout(timer);
      cur.remove();
    };
  }, []);

  // 스크램블 디코드 (등장 시 900ms + mouseenter 시 420ms)
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const rms = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (rms) return;
    const LAT = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*!/_";
    const KOR = "옥토버아카데미프로그램문의모임오프라인교육기관";
    const rafs = new Set<number>();
    const cleanups: Array<() => void> = [];
    root.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el) => {
      const fin = el.textContent ?? "";
      const CH = /[가-힣]/.test(fin) ? KOR : LAT;
      let running = false;
      function run(dur: number) {
        if (running) return;
        running = true;
        const t0 = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          rafs.delete(raf);
          const k = Math.min(1, (now - t0) / dur);
          let s = "";
          for (let i = 0; i < fin.length; i++)
            s += fin[i] === " " ? " " : i / fin.length < k ? fin[i] : CH[(Math.random() * CH.length) | 0];
          el.textContent = s;
          if (k < 1) {
            raf = requestAnimationFrame(tick);
            rafs.add(raf);
          } else {
            el.textContent = fin;
            running = false;
          }
        };
        tick(t0);
      }
      run(900);
      const host = el.closest("a") || el;
      const onEnter = () => run(420);
      host.addEventListener("mouseenter", onEnter);
      cleanups.push(() => {
        host.removeEventListener("mouseenter", onEnter);
        el.textContent = fin;
      });
    });
    return () => {
      rafs.forEach((id) => cancelAnimationFrame(id));
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const track = (section: string, label: string) => {
    posthog.capture("landing_cta_clicked", { section, label, page: "hub" });
  };

  return (
    <section className="hero" id="top" ref={sectionRef}>
      {/* 라인 시스템: agenticui 원본 SVG 지오메트리 그대로 */}
      <div className="fx-hud" aria-hidden="true">
        <svg className="hud-m" viewBox="0 0 360 800" preserveAspectRatio="none">
          <path d="M 180 800 L 180 0" fill="none" stroke="#fff" />
          <path d="M 0 316 L 360 316" fill="none" stroke="#fff" opacity="0.3" />
        </svg>
        <svg className="hud-diag-m diag" viewBox="0 0 360 800" preserveAspectRatio="none">
          <path d="M 360 0 L 0 800" fill="none" stroke="#fff" />
          <path d="M 0 0 L 360 800" fill="none" stroke="#fff" />
        </svg>
        <svg className="hud-d" viewBox="0 0 1200 802.349" preserveAspectRatio="none">
          <path d="M 600.048 802.349 L 600.048 0" fill="none" stroke="#fff" strokeMiterlimit="10" />
          <path d="M 1 400.803 L 1197.826 400.803" fill="none" stroke="#fff" strokeMiterlimit="10" opacity="0.3" />
        </svg>
        <svg className="hud-diag-d diag" viewBox="0 0 1200 802.349" preserveAspectRatio="none">
          <path d="M 1198.058 0.278 L 0 801" fill="none" stroke="#fff" strokeMiterlimit="10" />
          <path d="M 0 1 L 1200 800.676" fill="none" stroke="#fff" strokeMiterlimit="10" />
        </svg>
        <i className="fx-ring r1"></i>
        <i className="fx-ring r2"></i>
        <i className="fx-vrail lo"></i>
        <i className="fx-vrail li"></i>
        <i className="fx-vrail ri"></i>
        <i className="fx-vrail ro"></i>
        <i className="fx-hrail t1"></i>
        <i className="fx-hrail t2"></i>
        <i className="fx-hrail b1"></i>
        <i className="fx-hrail b2"></i>
      </div>
      <i className="fx-fade ft" aria-hidden="true"></i>
      <i className="fx-fade fb" aria-hidden="true"></i>
      <i className="fx-fade fl" aria-hidden="true"></i>
      <i className="fx-fade fr" aria-hidden="true"></i>
      <HeroShader />
      {/* 코너 브래킷 4 + 중앙 엣지 틱 2 (원본 16×16 SVG) */}
      <span className="fx-mark tl" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M 0 0 L 1.333 0 L 1.333 16 L 0 16 Z" fill="#fff" />
          <path d="M 0 1.333 L 0 0 L 16 0 L 16 1.333 Z" fill="#fff" />
        </svg>
      </span>
      <span className="fx-mark tr" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M 0 0 L 1.333 0 L 1.333 16 L 0 16 Z" fill="#fff" />
          <path d="M 0 1.333 L 0 0 L 16 0 L 16 1.333 Z" fill="#fff" />
        </svg>
      </span>
      <span className="fx-mark bl" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M 0 0 L 1.333 0 L 1.333 16 L 0 16 Z" fill="#fff" />
          <path d="M 0 1.333 L 0 0 L 16 0 L 16 1.333 Z" fill="#fff" />
        </svg>
      </span>
      <span className="fx-mark br" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M 0 0 L 1.333 0 L 1.333 16 L 0 16 Z" fill="#fff" />
          <path d="M 0 1.333 L 0 0 L 16 0 L 16 1.333 Z" fill="#fff" />
        </svg>
      </span>
      <span className="fx-mark ml" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M 0 0 L 1.25 0 L 1.25 16 L 0 16 Z" fill="#fff" />
          <path d="M 0 8.385 L 0 7.385 L 16 7.385 L 16 8.385 Z" fill="#fff" />
        </svg>
      </span>
      <span className="fx-mark mr" aria-hidden="true">
        <svg viewBox="0 0 16 16">
          <path d="M 0 0 L 1.25 0 L 1.25 16 L 0 16 Z" fill="#fff" />
          <path d="M 0 8.385 L 0 7.385 L 16 7.385 L 16 8.385 Z" fill="#fff" />
        </svg>
      </span>
      {/* 콘솔 셋업 블록 (라벨 dim / 값은 JS 타이핑) — 001 리스트 시작 = 14번째 행 */}
      <div className="console" aria-hidden="true">
        <pre>
          {"CONSOLE SETUP\n\n-----------------\n\n"}
          {AGX_CONSOLE.status.map(([label, value]) => (
            <Fragment key={label}>
              {label + " "}
              <b data-v={value} />
              {"\n"}
            </Fragment>
          ))}
          {"\n\n\n\n"}
          {AGX_CONSOLE.items.map(([num, value]) => (
            <Fragment key={num}>
              {num + "  "}
              <b data-v={value} />
              {"\n"}
            </Fragment>
          ))}
          {"\n\n\n"}
          {AGX_CONSOLE.welcome}
        </pre>
      </div>
      {/* 우상단 브래킷 링크 */}
      <nav className="toplinks" aria-label="주 메뉴">
        <a
          className="tlink"
          href={AGX_HERO.contact.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("nav", AGX_HERO.contact.label)}
        >
          <i className="bo"></i>
          <span data-scramble>{AGX_HERO.contact.label}</span>
          <i className="bc"></i>
        </a>
      </nav>
      {/* 하단 센터 스택 */}
      <div className="hero-stack stagger">
        <h1>
          {AGX_HERO.title[0]}
          <br />
          {AGX_HERO.title[1]}
        </h1>
        <p className="hero-sub">{AGX_HERO.subtitle}</p>
        <div className="hero-cta-row">
          <a
            className="mono-btn solid"
            href={AGX_HERO.primaryCta.href}
            onClick={() => track("hero", AGX_HERO.primaryCta.label)}
          >
            <span data-scramble>{AGX_HERO.primaryCta.label}</span>
          </a>
          <a
            className="mono-btn ghost"
            href={AGX_HERO.secondaryCta.href}
            onClick={() => track("hero", AGX_HERO.secondaryCta.label)}
          >
            <span data-scramble>{AGX_HERO.secondaryCta.label}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
