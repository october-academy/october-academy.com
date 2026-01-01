"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

function Countdown({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3 md:gap-4">
      {[
        { value: timeLeft.days, label: "일" },
        { value: timeLeft.hours, label: "시간" },
        { value: timeLeft.minutes, label: "분" },
        { value: timeLeft.seconds, label: "초" },
      ].map((item, i) => (
        <div key={i} className="countdown-box px-3 py-2 md:px-4 md:py-3 text-center">
          <div className="font-mono text-2xl md:text-4xl font-bold text-[#FF6B35]">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs md:text-sm text-gray-400">{item.label}</div>
        </div>
      ))}
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

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref} className={`animate-on-scroll ${isVisible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color?: string }[] }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="space-y-4">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{item.label}</span>
            <span className="font-mono">{item.value}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill transition-all duration-1000"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                background: item.color || "#FF6B35",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart() {
  const points = [
    { x: 0, y: 15 },
    { x: 1, y: 22 },
    { x: 2, y: 35 },
    { x: 3, y: 45 },
    { x: 4, y: 62 },
    { x: 5, y: 78 },
  ];

  return (
    <div className="relative h-48 w-full brutal-card-dark p-4">
      <div className="absolute bottom-8 left-12 right-4 top-4">
        <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#FF6B35"
            strokeWidth="2"
            points={points.map((p) => `${p.x * 20},${60 - p.y * 0.7}`).join(" ")}
          />
          {points.map((p, i) => (
            <circle key={i} cx={p.x * 20} cy={60 - p.y * 0.7} r="3" fill="#FF6B35" />
          ))}
        </svg>
      </div>
      <div className="absolute bottom-2 left-12 right-4 flex justify-between text-xs text-gray-400 font-mono">
        <span>V1</span>
        <span>V2</span>
        <span>V3</span>
        <span>V4</span>
        <span>V5</span>
        <span>V6</span>
      </div>
      <div className="absolute left-2 bottom-8 top-4 flex flex-col justify-between text-xs text-gray-400 font-mono">
        <span>80%</span>
        <span>40%</span>
        <span>0%</span>
      </div>
      <div className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-gray-500">서류 통과율</div>
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
              합격은 보통,
              <br />
              <span className="text-[#FF6B35]">이력서 V4와 V5</span> 사이에서
              <br />
              일어납니다.
            </h1>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
              그런데 대부분은
              <br />
              V1조차 제출하지 않은 채
              <br />
              계속 준비만 합니다.
            </p>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <div className="brutal-card-dark p-6 max-w-xl">
              <p className="text-gray-300">
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
                <div className="text-gray-500 text-sm mb-1">정가</div>
                <div className="font-mono text-xl strikethrough text-gray-500">₩1,290,000</div>
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
                    <span className={i === 3 ? "font-medium" : "text-gray-600"}>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-4 bg-gray-100 brutal-border">
                <p className="font-medium">이건 의지 문제가 아니라 구조의 문제입니다.</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="brutal-card p-6">
                <h3 className="font-mono text-sm text-gray-500 mb-4">준비 활동 실행률</h3>
                <BarChart
                  data={[
                    { label: "코딩 테스트 풀이", value: 85, color: "#333" },
                    { label: "강의/스터디 참여", value: 78, color: "#333" },
                    { label: "사이드 프로젝트", value: 65, color: "#333" },
                    { label: "이력서 제출", value: 23, color: "#FF6B35" },
                  ]}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SECTION 3: Loop Explanation */}
      <section className="section-dark py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-12">합격은 루프에서 만들어집니다</h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="brutal-card-dark p-6 md:p-8 overflow-x-auto">
              <div className="flex items-center gap-2 md:gap-4 min-w-max text-sm md:text-base">
                {[
                  "V1 제출",
                  "→",
                  "피드백",
                  "→",
                  "V2~V4",
                  "→",
                  "V5",
                  "→",
                  "지원",
                  "→",
                  "거절 분석",
                  "→",
                  "반복",
                ].map((item, i) =>
                  item === "→" ? (
                    <span key={i} className="text-[#FF6B35] font-mono">
                      →
                    </span>
                  ) : (
                    <span
                      key={i}
                      className={`px-3 py-2 border-2 border-white ${
                        item === "V5" ? "bg-[#FF6B35] text-black border-[#FF6B35]" : ""
                      }`}
                    >
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="flex flex-wrap gap-4">
              {[
                { text: "완벽 금지", emoji: "🚫" },
                { text: "제출 필수", emoji: "📤" },
                { text: "거절 = 데이터", emoji: "📊" },
              ].map((badge, i) => (
                <div
                  key={i}
                  className="px-4 py-2 border-2 border-[#FF6B35] text-[#FF6B35] font-mono text-sm"
                >
                  {badge.emoji} {badge.text}
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <h3 className="text-lg font-medium mb-4 text-gray-400">제출 횟수와 서류 통과율 상관관계</h3>
            <LineChart />
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 4: Opinionated Council */}
      <section className="section-light py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              하나의 정답 대신,
              <br />
              <span className="text-[#FF6B35]">다섯 개의 관점</span>을 받습니다
            </h2>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Formatter",
                  desc: "읽기 쉬운 구조와 형식으로 정리합니다",
                  icon: "📐",
                },
                {
                  title: "Technician",
                  desc: "기술 스택과 경험의 깊이를 검증합니다",
                  icon: "⚙️",
                },
                {
                  title: "Number Scientist",
                  desc: "정량화된 성과와 수치를 보강합니다",
                  icon: "📊",
                },
                {
                  title: "Soft Skill Reviewer",
                  desc: "협업, 커뮤니케이션 역량을 부각합니다",
                  icon: "🤝",
                },
                {
                  title: "Valuation Reviewer",
                  desc: "회사 관점에서 ROI를 평가합니다",
                  icon: "💰",
                },
              ].map((card, i) => (
                <div key={i} className="brutal-card p-6 hover:translate-x-1 hover:translate-y-1 transition-transform">
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h3 className="font-mono font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16">
            <h3 className="font-mono text-sm text-gray-500 mb-4">비교</h3>
            <div className="brutal-card overflow-hidden">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b-3 border-black bg-gray-100">
                    <th className="p-4 text-left"></th>
                    <th className="p-4 text-left">일반 이력서 첨삭</th>
                    <th className="p-4 text-left bg-[#FF6B35] text-black">옥토버 코드</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["피드백 관점", "1개", "5개"],
                    ["피드백 횟수", "1~2회", "무제한"],
                    ["제출 강제성", "없음", "있음"],
                    ["거절 피드백 분석", "없음", "포함"],
                    ["8주 후 이력서 버전", "V1~V2", "V4~V5"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-200">
                      <td className="p-4 font-medium">{row[0]}</td>
                      <td className="p-4 text-gray-500">{row[1]}</td>
                      <td className="p-4 font-mono font-bold">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 5: After State */}
      <section className="section-dark py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-12">
              8주 후, 당신에게 남는 것
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "V4~V5 수준의 이력서 보유",
                "기업 맞춤 제출 경험 최소 5회 이상",
                "최소 1회 이상 면접 전환",
                "다음 수정 포인트를 스스로 설명 가능",
              ].map((item, i) => (
                <div key={i} className="brutal-card-dark p-5 flex items-center gap-4">
                  <span className="text-[#FF6B35] font-mono text-xl">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="max-w-2xl">
              <p className="text-gray-400 text-lg">
                합격을 약속하지 않습니다.
                <br />
                <span className="text-white font-medium">
                  합격이 나올 수밖에 없는 상태를 만듭니다.
                </span>
              </p>
            </div>
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

          <AnimatedSection>
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
              ].map((person, i) => (
                <div key={i} className="brutal-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 brutal-border flex items-center justify-center font-mono font-bold">
                      {person.name[0]}
                    </div>
                    <div>
                      <div className="font-bold">{person.name}</div>
                      <div className="text-sm text-gray-500">{person.role}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "지원", before: person.before.apply, after: person.after.apply },
                      { label: "회신", before: person.before.response, after: person.after.response },
                      { label: "면접", before: person.before.interview, after: person.after.interview },
                    ].map((stat, j) => (
                      <div key={j} className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{stat.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gray-400">{stat.before}</span>
                          <span className="text-[#FF6B35]">→</span>
                          <span className="font-mono font-bold text-lg">{stat.after}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="brutal-card p-6">
              <h3 className="font-mono text-sm text-gray-500 mb-6">평균 변화 (8주 프로그램)</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "지원 수", before: 2.3, after: 17.6, unit: "건" },
                  { label: "회신율", before: 8, after: 42, unit: "%" },
                  { label: "면접 전환", before: 0.3, after: 4, unit: "회" },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-sm text-gray-500 mb-2">{stat.label}</div>
                    <div className="font-mono text-gray-400 line-through text-sm">
                      {stat.before}{stat.unit}
                    </div>
                    <div className="font-mono text-2xl md:text-3xl font-bold text-[#FF6B35]">
                      {stat.after}{stat.unit}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 7: Not For Everyone */}
      <section className="section-dark py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-12">
              이 프로그램은
              <br />
              모두를 위한 것은 아닙니다
            </h2>
          </AnimatedSection>

          <AnimatedSection>
            <div className="space-y-4 max-w-2xl">
              {[
                "듣기만 원하는 사람",
                "미완성을 제출할 수 없는 사람",
                "결과를 보장받고 싶은 사람",
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 border-2 border-gray-700 flex items-center gap-4"
                >
                  <span className="text-red-500 font-mono text-xl">✗</span>
                  <span className="text-gray-400">{item}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-8">
            <p className="text-gray-500">
              미완성이라도 제출하고,
              <br />
              피드백을 받고,
              <br />
              수정하고 다시 제출할 준비가 된 분만 신청해 주세요.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* SECTION 8: Final CTA */}
      <section id="final-cta" className="section-light py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-4xl font-bold mb-6">
              준비를 멈추고,
              <br />
              <span className="text-[#FF6B35]">제출을 시작할 때</span>입니다
            </h2>
          </AnimatedSection>

          <AnimatedSection className="mt-12">
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
              <form onSubmit={handleSubmit} className="brutal-card p-8">
                <label className="block text-left mb-2 font-medium">이메일</label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 px-4 py-3 brutal-border font-mono focus:outline-none focus:border-[#FF6B35]"
                  />
                  <button
                    type="submit"
                    className="brutal-btn bg-[#FF6B35] text-black px-6 py-3 font-bold whitespace-nowrap"
                  >
                    합격 루프 대기 명단 등록
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  * 스팸 메일을 보내지 않습니다. 오픈 안내만 발송됩니다.
                </p>
              </form>
            )}
          </AnimatedSection>

          <AnimatedSection className="mt-12">
            <div className="text-sm text-gray-500">
              <span className="font-mono text-[#FF6B35]">₩890,000</span> 얼리버드 가격은
              <br />
              카운트다운 종료 후 정가로 변경됩니다.
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Sticky CTA Bar */}
      <div
        className={`sticky-cta py-3 px-6 transition-transform duration-300 ${
          showStickyCTA ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden md:block">
            <span className="font-mono text-sm text-gray-500 line-through mr-2">₩1,290,000</span>
            <span className="font-mono font-bold text-lg">₩890,000</span>
          </div>
          <div className="flex-1 md:flex-none">
            <button
              onClick={scrollToCTA}
              className="brutal-btn bg-[#FF6B35] text-black px-6 py-2 font-bold w-full md:w-auto text-sm md:text-base"
            >
              합격 루프에 들어가기 →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
