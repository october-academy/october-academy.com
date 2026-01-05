# Research: 옥토버 코드 랜딩 페이지 개선

**Feature Branch**: `001-landing-page-improvement`
**Date**: 2026-01-02
**Status**: Complete

## Research Questions

### 1. Best Practices for Landing Page Section Organization

**Decision**: Implement sections in the following order based on conversion funnel logic.

**Rationale**:
- Hero → establishes value proposition and hook (3-second rule)
- Metrics → builds credibility immediately after hook
- Target Audience → qualifies visitors (reduces unfit leads)
- Process/Loop → explains the method (differentiator)
- Feedback Perspectives → shows expertise depth
- Principles → sets expectations
- Pricing → conversion point (must be after value is established)
- Testimonials → social proof before final decision
- FAQ → objection handling
- Final CTA → conversion capture

**Alternatives Considered**:
- Pricing higher in funnel: Rejected - visitors need to understand value first
- Testimonials before pricing: Could work, but pricing-testimonials-CTA is standard SaaS pattern

### 2. Framer Motion Animation Patterns for Neo-Brutalist Design

**Decision**: Use stagger animations for list items, scale+shadow transitions for buttons, and viewport-triggered fade-up for sections.

**Rationale**:
- Neo-brutalist aesthetic emphasizes bold, physical interactions
- Shadow offset changes reinforce the "paper cut-out" metaphor
- Viewport-triggered animations respect performance and reduce motion preferences

**Implementation Pattern**:
```typescript
// Section entrance
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

// Button hover (complement CSS)
const buttonHover = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400 }
};

// Staggered list items
const container = {
  animate: { transition: { staggerChildren: 0.1 } }
};
```

**Alternatives Considered**:
- Heavy parallax effects: Rejected - breaks neo-brutalist flat aesthetic
- 3D transforms: Rejected - inconsistent with 2D paper cut-out style

### 3. Responsive Layout Patterns for Korean Text

**Decision**: Use `word-break: keep-all` for Korean text blocks, flexible grid with min-width constraints for metric cards.

**Rationale**:
- Korean text should not break in the middle of words
- Numeric metrics with suffixes (e.g., +1233%) need space to not overflow
- Mobile-first approach with `md:` breakpoint at 768px

**CSS Pattern**:
```css
.korean-text {
  word-break: keep-all;
}

.metric-value {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Alternatives Considered**:
- Fixed font sizes: Rejected - doesn't scale well on mobile
- Horizontal scroll for metrics: Rejected - poor UX, looks broken

### 4. Accordion/FAQ Implementation Without Additional Dependencies

**Decision**: Use native HTML `<details>/<summary>` styled with neo-brutalist aesthetic, enhanced with Framer Motion for smooth open/close.

**Rationale**:
- No additional dependencies needed
- Native accessibility (keyboard navigation, screen readers)
- Can be progressively enhanced with JavaScript for animations

**Implementation Pattern**:
```tsx
<motion.details className="brutal-card">
  <summary className="cursor-pointer">Question</summary>
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    Answer content
  </motion.div>
</motion.details>
```

**Alternatives Considered**:
- Headless UI Disclosure: Rejected - unnecessary dependency for simple FAQ
- Custom state management: Rejected - native `details` handles state automatically

### 5. CTA Link Destinations

**Decision**: Use external links with `target="_blank"` and `rel="noopener noreferrer"` for all CTAs.

**Rationale**:
- 1회 멘토링 → Google Form or KakaoTalk channel
- 인프런 강의 → Inflearn course page (or "coming soon" state)
- 4주 정기 멘토링 → Google Form or KakaoTalk channel

**Implementation Notes**:
- Inflearn course shows "1월 중 오픈 예정" when `isInflearnLive` is false
- Button state changes from active CTA to disabled/notify state

### 6. Image Optimization Strategy

**Decision**: Use Next.js Image component with explicit dimensions, WebP format via automatic optimization.

**Rationale**:
- Next.js 16 automatically optimizes images to WebP
- Explicit dimensions prevent CLS
- Lazy loading by default

**Implementation Pattern**:
```tsx
<Image
  src="/assets/resume-comparison.png"
  alt="이력서 비교"
  width={800}
  height={600}
  className="brutal-border"
  priority={false} // true for above-fold images
/>
```

## Unknowns Resolved

| Item | Resolution |
|------|------------|
| Supabase integration | Deferred to future auth feature; not needed for landing page MVP |
| Company logo usage | Use text names only to avoid trademark issues |
| Consultation form destination | External Google Form / KakaoTalk (existing flow) |
| Inflearn course availability | Configurable boolean flag; shows "오픈 예정" when false |

## Dependencies Confirmed

| Dependency | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Next.js | 16.1.1 | Framework | Already installed |
| React | 19.2.3 | UI Library | Already installed |
| Framer Motion | 12.23.26 | Animations | Already installed |
| Tailwind CSS | 4.x | Styling | Already installed |

**No new dependencies required.**

## Performance Considerations

1. **Image Optimization**: All images through Next.js Image component
2. **Animation Performance**: Use `transform` and `opacity` only (GPU-accelerated)
3. **Font Loading**: Inter and JetBrains Mono already loaded via Google Fonts with `display=swap`
4. **Bundle Size**: No new JS dependencies; static content only

## Security Considerations

1. **External Links**: All external links use `rel="noopener noreferrer"`
2. **No User Input**: No forms storing data locally (external forms only)
3. **No API Keys**: Static content; no secrets required
