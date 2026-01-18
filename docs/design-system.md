# Neo-Brutalism 디자인 시스템

옥토버 아카데미 랜딩 페이지의 디자인 시스템 문서입니다.

## 1. 개요

### Neo-Brutalism 디자인 철학

Neo-Brutalism은 다음과 같은 특징을 가진 디자인 스타일입니다:

- **두꺼운 테두리**: 모든 UI 요소에 3px 검정색 테두리 적용
- **하드 섀도우**: 4px 오프셋의 단색 그림자 (부드러운 blur 없음)
- **높은 대비**: 검정/흰색 기반의 명확한 색상 대비
- **주황색 액센트**: `#FF6B35`를 포인트 색상으로 사용
- **의도적인 거칠함**: 부드러움보다 강렬함과 명확성 추구

### 핵심 디자인 토큰

| 토큰 | 값 | 설명 |
|------|-----|------|
| `--border-width` | `3px` | 기본 테두리 두께 |
| `--shadow-offset` | `4px` | 그림자 오프셋 |
| `--shadow-brutal` | `4px 4px 0px #000` | 기본 하드 섀도우 |
| `--accent` | `#FF6B35` | 주황색 액센트 |

---

## 2. 색상 시스템

### CSS 변수 정의

```css
:root {
  /* Base Colors */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --accent: #FF6B35;
  --dark-bg: #0a0a0a;
  --light-bg: #ffffff;

  /* Gray Scale */
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;

  /* Text Colors by Context */
  --text-muted-dark: var(--gray-400);   /* 다크 섹션 보조 텍스트 */
  --text-muted-light: var(--gray-600);  /* 라이트 섹션 보조 텍스트 */
}
```

### 색상 팔레트

| 이름 | HEX 값 | 용도 |
|------|--------|------|
| Accent | `#FF6B35` | CTA 버튼, 강조 요소, 하이라이트 |
| Dark BG | `#0a0a0a` | 다크 섹션 배경 |
| Light BG | `#ffffff` | 라이트 섹션 배경 |
| Gray 400 | `#9ca3af` | 다크 섹션 보조 텍스트 |
| Gray 500 | `#6b7280` | 중간 회색 텍스트 |
| Gray 600 | `#4b5563` | 라이트 섹션 보조 텍스트 |

### 섀도우 변형

```css
--shadow-brutal: 4px 4px 0px #000;         /* 기본 (라이트 배경용) */
--shadow-brutal-white: 4px 4px 0px #fff;   /* 다크 배경용 */
--shadow-brutal-accent: 4px 4px 0px var(--accent);  /* 액센트 강조용 */
```

### 컨텍스트별 색상 조합

| 컨텍스트 | 배경 | 텍스트 | 테두리 | 그림자 |
|----------|------|--------|--------|--------|
| 라이트 섹션 | `#fff` | `#0a0a0a` | `#000` | `#000` |
| 다크 섹션 | `#0a0a0a` | `#fff` | `#fff` | `#fff` 또는 `#333` |
| 액센트 강조 | `#FF6B35` | `#fff` 또는 `#000` | `#000` | `#000` |

---

## 3. 타이포그래피

### 폰트 패밀리

- **기본**: Inter (sans-serif)
- **모노스페이스**: JetBrains Mono (숫자, 가격, 코드)

```css
body {
  font-family: var(--font-inter), sans-serif;
}

.font-mono {
  font-family: var(--font-jetbrains), monospace;
}
```

### 타이포그래피 스케일 (반응형)

| 변수명 | 모바일 | 태블릿+ | 데스크톱+ | Tailwind |
|--------|--------|---------|-----------|----------|
| `--text-h1-mobile` | 1.875rem (30px) | - | - | text-3xl |
| `--text-h1-tablet` | - | 3rem (48px) | - | text-5xl |
| `--text-h1-desktop` | - | - | 3.75rem (60px) | text-6xl |
| `--text-h2-mobile` | 1.5rem (24px) | - | - | text-2xl |
| `--text-h2-desktop` | - | 2.25rem (36px) | - | text-4xl |
| `--text-h3` | 1.125rem (18px) | - | - | text-lg |
| `--text-body-lg` | 1.125rem (18px) | - | - | text-lg |
| `--text-body` | 1rem (16px) | - | - | text-base |
| `--text-body-sm` | 0.875rem (14px) | - | - | text-sm |
| `--text-caption` | 0.75rem (12px) | - | - | text-xs |

### 타이포그래피 클래스

#### `.heading-section` - 섹션 제목 (H2)
```css
.heading-section {
  font-size: 1.5rem;      /* 모바일 */
  font-weight: 700;
  margin-bottom: var(--heading-mb);  /* 1.5rem */
}

@media (min-width: 768px) {
  .heading-section {
    font-size: 2.25rem;   /* 데스크톱 */
  }
}
```

#### `.subtitle-section` - 섹션 서브타이틀
```css
.subtitle-section {
  font-size: 1rem;
  margin-bottom: 2rem;
}
```

#### `.heading-card` - 카드 제목 (H3)
```css
.heading-card {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
```

#### `.text-label` - 라벨/태그 텍스트
```css
.text-label {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.025em;
}
```

#### `.text-caption-style` - 캡션 텍스트
```css
.text-caption-style {
  font-size: 0.75rem;
}
```

#### 컨텍스트별 텍스트 색상
```css
.text-section-dark {
  color: var(--gray-400);   /* 다크 섹션 보조 텍스트 */
}

.text-section-light {
  color: var(--gray-600);   /* 라이트 섹션 보조 텍스트 */
}
```

---

## 4. 핵심 컴포넌트 클래스

### 버튼 (Buttons)

#### `.brutal-btn` - 기본 버튼 스타일
```css
.brutal-btn {
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  transition: all 0.15s ease;
  position: relative;
  overflow: hidden;
}

.brutal-btn:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
  filter: brightness(1.1);
}

.brutal-btn:active {
  transform: translate(4px, 4px);
  box-shadow: 0px 0px 0px #000;
  filter: brightness(0.95);
}

.brutal-btn:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
```

#### `.btn-primary` - 주요 CTA 버튼
```css
.btn-primary {
  background-color: var(--accent);
  color: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 700;
}
```

#### `.btn-secondary` - 보조 버튼
```css
.btn-secondary {
  background-color: #fff;
  color: #000;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
}
```

#### `.btn-outline` - 아웃라인 버튼 (다크 배경용)
```css
.btn-outline {
  background-color: transparent;
  color: #fff;
  border: 3px solid #fff;
  box-shadow: 4px 4px 0px #fff;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
}

.btn-outline:hover {
  background-color: #fff;
  color: #000;
}
```

#### `.btn-outline-dark` - 아웃라인 버튼 (라이트 배경용)
```css
.btn-outline-dark {
  background-color: transparent;
  color: #000;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
}

.btn-outline-dark:hover {
  background-color: #000;
  color: #fff;
}
```

#### 버튼 수식어

| 클래스 | 효과 |
|--------|------|
| `.btn-sm` | 작은 패딩 (0.5rem 1rem), 작은 폰트 (0.875rem) |
| `.btn-block` | 전체 너비 (width: 100%) |

### 카드 (Cards)

#### `.brutal-card` - 라이트 카드
```css
.brutal-card {
  background: #fff;
  border: 3px solid #000;
  box-shadow: 4px 4px 0px #000;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.brutal-card:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #000;
}
```

#### `.brutal-card-dark` - 다크 카드
```css
.brutal-card-dark {
  background: #0a0a0a;
  border: 3px solid #fff;
  box-shadow: 4px 4px 0px #fff;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.brutal-card-dark:hover {
  transform: translate(2px, 2px);
  box-shadow: 2px 2px 0px #fff;
}
```

### 섹션 (Sections)

#### `.section-dark` - 다크 섹션
```css
.section-dark {
  background: #0a0a0a;
  color: #fff;
  position: relative;
}

/* 상단 그라디언트 오버레이 */
.section-dark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.05), transparent);
  pointer-events: none;
}
```

#### `.section-light` - 라이트 섹션
```css
.section-light {
  background: #fff;
  color: #0a0a0a;
  position: relative;
}

/* 상단 그라디언트 오버레이 */
.section-light::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(0,0,0,0.02), transparent);
  pointer-events: none;
}
```

### 유틸리티 클래스

#### `.text-highlight` - 주황색 그라디언트 밑줄 강조
```css
.text-highlight {
  font-weight: 700;
  background: linear-gradient(to top, rgba(255, 107, 53, 0.4) 40%, transparent 40%);
  padding-inline: 0.15rem;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
```

#### `.brutal-border` - 기본 테두리
```css
.brutal-border {
  border: 3px solid #000;
}
```

#### `.brutal-shadow` - 기본 섀도우
```css
.brutal-shadow {
  box-shadow: 4px 4px 0px #000;
}
```

#### `.brutal-shadow-accent` - 액센트 섀도우
```css
.brutal-shadow-accent {
  box-shadow: 4px 4px 0px var(--accent);
}
```

#### Tailwind 유틸리티 확장
```css
@layer utilities {
  .text-accent { color: var(--accent); }
  .bg-accent { background-color: var(--accent); }
  .border-accent { border-color: var(--accent); }
}
```

---

## 5. 애니메이션

### 스크롤 트리거 애니메이션

#### `.animate-on-scroll` - 스크롤 페이드인
```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}
```

#### `.animate-fade-in-up` - 즉시 페이드인 업
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}
```

### 키프레임 애니메이션

#### `cta-border-pulse` - CTA 강조 애니메이션
```css
@keyframes cta-border-pulse {
  0% {
    border-color: #fff;
    box-shadow: 4px 4px 0px #fff;
  }
  50% {
    border-color: #FF6B35;
    box-shadow: 4px 4px 0px #FF6B35, 0 0 30px rgba(255, 107, 53, 0.6);
  }
  100% {
    border-color: #fff;
    box-shadow: 4px 4px 0px #fff;
  }
}

.cta-highlight {
  animation: cta-border-pulse 1.5s ease-in-out;
}
```

#### `scale-in` - 스케일 팝 효과
```css
@keyframes scale-in {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-scale-in {
  animation: scale-in 0.5s ease-out forwards;
}
```

#### `pulse-arrow` - 화살표 펄스
```css
@keyframes pulse-arrow {
  0%, 100% { opacity: 1; transform: translateX(0); }
  50% { opacity: 0.7; transform: translateX(2px); }
}

.animate-pulse-arrow {
  animation: pulse-arrow 1.5s ease-in-out infinite;
}
```

### Stagger 애니메이션 (순차 등장)

```css
.stagger-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease-out, transform 0.5s ease-out;
}

.stagger-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.stagger-item:nth-child(1) { transition-delay: 0ms; }
.stagger-item:nth-child(2) { transition-delay: 100ms; }
.stagger-item:nth-child(3) { transition-delay: 200ms; }
.stagger-item:nth-child(4) { transition-delay: 300ms; }
.stagger-item:nth-child(5) { transition-delay: 400ms; }
```

### 접근성: Reduced Motion

모든 애니메이션은 `prefers-reduced-motion` 미디어 쿼리를 지원합니다:

```css
@media (prefers-reduced-motion: reduce) {
  .cta-highlight,
  .animate-pulse-arrow,
  .countdown-number,
  .stagger-item /* ... */ {
    animation: none !important;
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## 6. UI 컴포넌트 (React)

위치: `src/components/landing/ui.tsx`

### Countdown / CountdownCompact

카운트다운 타이머 컴포넌트.

```tsx
// 전체 크기 카운트다운
<Countdown targetDate={new Date('2025-02-01')} />

// 컴팩트 카운트다운 (Sticky CTA용)
<CountdownCompact
  targetDate={new Date('2025-02-01')}
  expiredText="마감됨"
/>
```

**특징:**
- 24시간 미만일 때 빨간색으로 변경 (긴급성 표시)
- 마감 시 커스텀 텍스트 표시
- `.countdown-box` 스타일 적용

### AnimatedCounter

숫자 카운트업 애니메이션 컴포넌트.

```tsx
<AnimatedCounter
  end={97}
  duration={1500}  // 기본값: 1500ms
  prefix=""
  suffix="%"
  decimals={0}
/>
```

**특징:**
- 스크롤 트리거 (뷰포트 진입 시 애니메이션 시작)
- ease-out cubic 이징
- 한 번만 애니메이션 실행

### AnimatedSection

스크롤 트리거 페이드인 래퍼 컴포넌트.

```tsx
<AnimatedSection className="optional-extra-classes">
  <div>페이드인될 컨텐츠</div>
</AnimatedSection>
```

**특징:**
- IntersectionObserver 기반
- `.animate-on-scroll` 클래스 자동 적용

### Tooltip

클릭/호버 툴팁 컴포넌트.

```tsx
<Tooltip content="툴팁에 표시될 내용">
  <span>트리거 텍스트</span>
</Tooltip>
```

**특징:**
- 모바일: 클릭으로 열기/닫기
- 데스크톱: 호버로 표시, 마우스 leave로 닫기
- `.brutal-tooltip` 스타일 적용

### ImageDialog

전체 화면 이미지 모달 컴포넌트.

```tsx
<ImageDialog
  src="/image.jpg"
  alt="이미지 설명"
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

**특징:**
- HTML `<dialog>` 요소 사용
- ESC 키로 닫기 지원
- 배경 클릭으로 닫기
- Neo-brutalism 스타일 닫기 버튼

### ScrollProgress

스크롤 진행률 표시 바.

```tsx
<ScrollProgress />
```

**특징:**
- 페이지 상단 고정
- 스크롤 위치에 따른 너비 변화
- 액센트 색상 사용

---

## 7. 반응형 브레이크포인트

Tailwind CSS 기본 브레이크포인트를 따릅니다:

| 브레이크포인트 | 최소 너비 | 클래스 접두사 |
|---------------|-----------|--------------|
| 모바일 | 0px | (기본) |
| 태블릿 | 768px | `md:` |
| 데스크톱 | 1024px | `lg:` |
| 대형 데스크톱 | 1280px | `xl:` |

### 주요 반응형 패턴

```css
/* 타이포그래피 */
.heading-section {
  font-size: 1.5rem;      /* 모바일 */
}
@media (min-width: 768px) {
  .heading-section {
    font-size: 2.25rem;   /* 태블릿+ */
  }
}

/* 그리드 레이아웃 */
.trust-metrics-grid {
  grid-template-columns: 1fr;  /* 모바일: 1열 */
}
@media (min-width: 768px) {
  .trust-metrics-grid {
    grid-template-columns: repeat(3, 1fr);  /* 태블릿+: 3열 */
  }
}
```

---

## 8. 사용 예시

### 버튼 조합

```html
<!-- 주요 CTA -->
<button class="btn-primary">
  지금 신청하기
</button>

<!-- 보조 버튼 -->
<button class="btn-secondary">
  자세히 보기
</button>

<!-- 다크 배경의 아웃라인 버튼 -->
<div class="section-dark">
  <button class="btn-outline">
    상담 신청
  </button>
</div>

<!-- 라이트 배경의 아웃라인 버튼 -->
<div class="section-light">
  <button class="btn-outline-dark">
    더 알아보기
  </button>
</div>
```

### 카드 레이아웃

```html
<!-- 라이트 배경에서 -->
<div class="section-light">
  <div class="brutal-card p-6">
    <h3 class="heading-card">카드 제목</h3>
    <p class="text-section-light">카드 내용</p>
  </div>
</div>

<!-- 다크 배경에서 -->
<div class="section-dark">
  <div class="brutal-card-dark p-6">
    <h3 class="heading-card">카드 제목</h3>
    <p class="text-section-dark">카드 내용</p>
  </div>
</div>
```

### 섹션 구성

```html
<section class="section-dark py-16 px-4">
  <div class="max-w-4xl mx-auto">
    <h2 class="heading-section text-center">
      섹션 제목
    </h2>
    <p class="subtitle-section text-section-dark text-center">
      섹션 서브타이틀
    </p>
    <!-- 컨텐츠 -->
  </div>
</section>

<section class="section-light py-16 px-4">
  <div class="max-w-4xl mx-auto">
    <h2 class="heading-section text-center">
      섹션 제목
    </h2>
    <p class="subtitle-section text-section-light text-center">
      섹션 서브타이틀
    </p>
    <!-- 컨텐츠 -->
  </div>
</section>
```

### 텍스트 강조

```html
<p>
  옥토버 아카데미는 <span class="text-highlight">97%의 취업 성공률</span>을 자랑합니다.
</p>
```

### 스크롤 애니메이션 적용

```tsx
<AnimatedSection>
  <div class="brutal-card p-6">
    스크롤 시 페이드인되는 카드
  </div>
</AnimatedSection>
```

---

## 9. 특수 컴포넌트 스타일

### Trust Metrics (신뢰 지표)

```css
.trust-metrics-grid           /* 3열 그리드 */
.trust-metric-card            /* 개별 지표 카드 */
.trust-metric-value           /* 숫자 값 (JetBrains Mono) */
.trust-metric-label           /* 지표 라벨 */
```

### FAQ Accordion

```css
.faq-section                  /* 섹션 컨테이너 */
.faq-list                     /* FAQ 목록 */
.faq-item / .faq-item-open    /* 개별 FAQ 아이템 */
.faq-question                 /* 질문 버튼 */
.faq-answer / .faq-answer-open /* 답변 영역 */
.faq-icon / .faq-icon-open    /* 열림/닫힘 아이콘 */
```

### Company Logos Marquee

```css
.company-logos-marquee        /* 무한 스크롤 컨테이너 */
.company-logos-track          /* 스크롤 트랙 */
.company-logo-item            /* 개별 로고 아이템 */
```

### Testimonial Carousel

```css
.testimonial-carousel         /* 가로 스크롤 컨테이너 */
.testimonial-card             /* 후기 카드 */
.testimonial-company          /* 회사명 */
.testimonial-tag              /* 태그 (신입/경력) */
```

### Resume Comparison Slider

```css
.resume-slider-container      /* 슬라이더 컨테이너 */
.resume-slider-before         /* Before 이미지 래퍼 */
.resume-slider-after          /* After 이미지 */
.resume-slider-line           /* 구분선 */
.resume-slider-handle         /* 드래그 핸들 */
```

---

## 10. 파일 구조

```
src/
├── app/
│   └── globals.css           # 디자인 시스템 정의
└── components/landing/
    ├── ui.tsx                # React UI 컴포넌트
    └── sections.tsx          # 섹션 컴포넌트
```

---

## 11. 체크리스트

### 새 컴포넌트 추가 시

- [ ] 3px 테두리 사용 (`border: 3px solid #000` 또는 `#fff`)
- [ ] 4px 하드 섀도우 사용 (`box-shadow: 4px 4px 0px`)
- [ ] 호버 시 transform + shadow 축소 효과
- [ ] 컨텍스트에 맞는 색상 조합 사용
- [ ] 반응형 스타일 정의
- [ ] `prefers-reduced-motion` 지원

### 텍스트 추가 시

- [ ] 적절한 타이포그래피 클래스 사용
- [ ] 컨텍스트별 텍스트 색상 적용
- [ ] 강조가 필요한 경우 `.text-highlight` 사용

### 애니메이션 추가 시

- [ ] `prefers-reduced-motion` 미디어 쿼리 처리
- [ ] 과도한 애니메이션 지양
- [ ] 스크롤 트리거 시 `AnimatedSection` 활용
