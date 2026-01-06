# 랜딩 페이지 디자인 개선 - 구현 가이드

## 배경
현재 옥토버 코드 랜딩 페이지를 참고 이미지(성공적인 한국 IT 교육 랜딩 페이지)와 비교 분석하여 디자인 개선점을 도출함. 기존 neo-brutalist 테마와 구조를 유지하면서 시각적 임팩트와 전환율을 향상시키는 것이 목표.

## 제약 조건
- 현재 섹션 순서 및 구조 유지
- 멘토 소개 섹션 위치 유지 (Hero로 이동 X)
- 모든 후기 섹션 유지
- 3개 상품 가격 구조 유지
- Neo-brutalist 디자인 테마 유지

---

## 구현 우선순위

### Phase 1: High Impact (먼저 구현)

#### 1.1 Hero 섹션 긴급성 배너 추가

**파일**: `src/app/page.tsx`
**위치**: Hero 섹션 시작 부분 (line 90 근처)

```tsx
{/* Hero 섹션 내부, 상단에 추가 */}
<section className="section-dark min-h-screen flex items-center relative">
  {/* 긴급성 배너 - NEW */}
  <div className="absolute top-0 left-0 right-0 bg-[#FF6B35] py-2 px-4 text-center z-10">
    <span className="text-black font-bold text-sm md:text-base">
      🔥 1기 얼리버드 마감 임박 · 현재 가격 ₩{getCurrentPrice()?.priceDisplay} → 다음 가격 ₩{getNextPrice()?.priceDisplay}
    </span>
  </div>

  {/* 기존 콘텐츠 - pt 추가하여 배너 공간 확보 */}
  <div className="max-w-5xl mx-auto px-6 py-20 md:py-32 pt-28 md:pt-36">
    {/* ... 기존 내용 ... */}
  </div>
</section>
```

**참고**: `getNextPrice()` 함수가 없다면 `src/lib/constants.ts`에 추가 필요:
```ts
export function getNextPrice(): PricingTier | null {
  const tiers = getTiersWithStatus();
  const nextTier = tiers.find(t => t.status === "upcoming");
  return nextTier || null;
}
```

#### 1.2 CTA 버튼 Glow 애니메이션 추가

**파일**: `src/app/globals.css`
**위치**: 파일 끝에 추가

```css
/* ========================================
   HERO CTA GLOW ANIMATION
   ======================================== */

.hero-cta-primary {
  animation: cta-glow 2s ease-in-out infinite;
}

@keyframes cta-glow {
  0%, 100% {
    box-shadow: 4px 4px 0px #000;
  }
  50% {
    box-shadow: 6px 6px 0px #000, 0 0 25px rgba(255, 107, 53, 0.5);
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .hero-cta-primary {
    animation: none;
  }
}
```

**파일**: `src/app/page.tsx`
**위치**: Hero CTA 버튼 (line 142 근처)

변경 전:
```tsx
<button
  onClick={scrollToPricing}
  className="brutal-btn bg-[#FF6B35] text-black px-8 py-4 text-lg font-bold"
>
```

변경 후:
```tsx
<button
  onClick={scrollToPricing}
  className="brutal-btn hero-cta-primary bg-[#FF6B35] text-black px-8 py-4 text-lg font-bold"
>
```

#### 1.3 Final CTA 섹션 배경 효과 추가

**파일**: `src/app/globals.css`
**위치**: 파일 끝에 추가

```css
/* ========================================
   FINAL CTA BACKGROUND EFFECT
   ======================================== */

.final-cta-bg {
  position: relative;
  overflow: hidden;
}

.final-cta-bg::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255, 107, 53, 0.08) 0%, transparent 50%);
  animation: cta-bg-rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes cta-bg-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .final-cta-bg::before {
    animation: none;
  }
}
```

**파일**: `src/app/page.tsx`
**위치**: Final CTA 섹션 (line 1425 근처)

변경 전:
```tsx
<section id="final-cta" className="section-dark py-20 md:py-32">
```

변경 후:
```tsx
<section id="final-cta" className="section-dark final-cta-bg py-20 md:py-32">
```

---

### Phase 2: Medium Impact

#### 2.1 타이포그래피 스케일 시스템 추가

**파일**: `src/app/globals.css`
**위치**: `:root` 변수 다음에 추가

```css
/* ========================================
   TYPOGRAPHY SCALE
   ======================================== */

.text-display-1 {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.text-display-2 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.01em;
}

.section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 0.75rem;
  display: block;
}
```

#### 2.2 섹션 라벨 추가

**파일**: `src/app/page.tsx`

각 주요 섹션에 라벨 추가:

**Problem Recognition Section (line 153 근처)**:
```tsx
<AnimatedSection>
  <span className="section-label">문제 인식</span>
  <h2 className="text-2xl md:text-4xl font-bold mb-12">
    준비를 안 하는 건 아닙니다
  </h2>
</AnimatedSection>
```

**실제 변화 Section (line 873 근처)**:
```tsx
<AnimatedSection>
  <span className="section-label">실제 성과</span>
  <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">
    실제 변화
  </h2>
  {/* ... */}
</AnimatedSection>
```

**Social Proof Section (line 926 근처)**:
```tsx
<AnimatedSection>
  <div className="text-center mb-8">
    <span className="section-label">검증된 결과</span>
    <h2 className="text-2xl md:text-4xl font-bold mb-3">
      숫자로 증명합니다
    </h2>
    {/* ... */}
  </div>
</AnimatedSection>
```

#### 2.3 실제 변화 섹션 hover 효과

**파일**: `src/app/globals.css`
**위치**: `.percentage-card-dark` 스타일 다음에 추가 (line 448 근처)

```css
.percentage-card-dark {
  /* 기존 스타일 유지 */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.percentage-card-dark:hover {
  transform: translateY(-4px);
  box-shadow: 4px 8px 0px rgba(255, 255, 255, 0.3);
}

@media (prefers-reduced-motion: reduce) {
  .percentage-card-dark:hover {
    transform: none;
  }
}
```

#### 2.4 모바일 최적화

**파일**: `src/app/globals.css`
**위치**: 파일 끝에 추가

```css
/* ========================================
   MOBILE OPTIMIZATION
   ======================================== */

@media (max-width: 768px) {
  /* 섹션 패딩 조정 */
  .section-dark,
  .section-light {
    padding-top: 3rem;
    padding-bottom: 3rem;
  }

  /* 터치 타겟 크기 보장 */
  .brutal-btn {
    min-height: 48px;
    min-width: 48px;
  }

  /* Sticky CTA 최적화 */
  .sticky-cta {
    padding: 0.5rem 1rem;
  }

  /* Hero 배너 폰트 크기 */
  .hero-urgency-banner {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}
```

---

### Phase 3: Polish

#### 3.1 비교 테이블 시각적 개선

**파일**: `src/app/page.tsx`
**위치**: 비교 테이블 섹션 (line 709 근처)

테이블 헤더의 "옥토버 코드" 열 강조:
```tsx
<th className="py-5 px-6 text-center bg-[#FF6B35] text-black font-semibold relative">
  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-0.5">
    추천
  </span>
  옥토버 코드
</th>
```

---

## 수정 대상 파일 요약

| 파일 | 변경 내용 |
|------|----------|
| `src/app/globals.css` | 애니메이션 keyframes, 타이포그래피 스케일, hover 효과, 모바일 최적화 |
| `src/app/page.tsx` | Hero 긴급성 배너, 섹션 라벨, CTA 클래스, Final CTA 배경 |
| `src/lib/constants.ts` | `getNextPrice()` 함수 추가 (선택적) |

---

## 테스트 체크리스트

구현 후 확인 사항:
- [ ] Hero 배너가 모바일/데스크톱에서 올바르게 표시되는지
- [ ] CTA 버튼 glow 애니메이션이 작동하는지
- [ ] Final CTA 배경 효과가 표시되는지
- [ ] 모든 섹션 라벨이 올바르게 표시되는지
- [ ] hover 효과가 데스크톱에서 작동하는지
- [ ] `prefers-reduced-motion` 설정 시 애니메이션이 비활성화되는지
- [ ] 모바일에서 터치 타겟이 충분히 큰지 (48px 이상)
- [ ] 타입 에러 없이 빌드되는지 (`bun run typecheck`)
- [ ] 린트 에러 없는지 (`bun run lint`)

---

## 실행 명령어

```bash
# 개발 서버 실행
bun dev

# 타입 체크
bun run typecheck

# 린트
bun run lint

# 빌드 테스트
bun run build
```

---

## 참고 자료

- 계획 파일: `/Users/yuhogyun/.claude/plans/giggly-painting-hartmanis.md`
- 현재 페이지 스크린샷: `.playwright-mcp/current-landing-full.png`
- 디자인 시스템: Neo-brutalist (3px 테두리, 4px 그림자, #FF6B35 액센트)
