# Implementation Plan: 옥토버 코드 랜딩 페이지 개선

**Branch**: `001-landing-page-improvement` | **Date**: 2026-01-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-landing-page-improvement/spec.md`

## Summary

Enhance the October Code landing page to clearly communicate the core philosophy ("합격 루프": V0→V5 iterative submission process), display verified performance metrics, and provide clear CTAs for 3 product tiers. Technical approach: Component-based architecture with existing Next.js 16 + React 19 + Framer Motion 12 stack, maintaining neo-brutalist design system.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+ (Next.js 16.1.1, React 19.2.3)
**Primary Dependencies**: Next.js 16, React 19, Framer Motion 12.23.26, Tailwind CSS 4
**Storage**: N/A (static landing page; Supabase planned for future auth - out of scope)
**Testing**: Manual verification (no automated test suite; build + lint as quality gates)
**Target Platform**: Web (Chrome, Safari, Firefox; Mobile-first responsive)
**Project Type**: Single Next.js application with App Router
**Performance Goals**: LCP < 2.5s, FID < 100ms, CLS < 0.1, Bundle < 200KB gzipped
**Constraints**: Neo-brutalist design system (3px border, 4px shadow, #FF6B35 accent), Korean locale only, `prefers-reduced-motion` support required
**Scale/Scope**: Single landing page with 7+ sections, ~1500 LOC in page.tsx

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Code Quality | TypeScript strict, ESLint pass, no dead code | ✅ PASS | Existing project uses strict mode |
| II. Testing | Build + Lint pass, visual verification | ✅ PASS | No new deps requiring test changes |
| III. UX Consistency | Design tokens, reduced motion, 44px touch targets | ✅ PASS | Existing design system maintained |
| IV. Performance | LCP < 2.5s, Bundle < 200KB | ✅ PASS | No new heavy deps; static content |
| V. Simplicity | No unnecessary deps, < 500 LOC per file | ⚠️ WATCH | page.tsx already ~1500 LOC; may need component extraction |

**Gate Decision**: PASS with caveat - if page.tsx exceeds 2000 LOC, extract sections into separate components in `src/components/`.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page-improvement/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # N/A for static landing page
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main landing page (all sections)
│   ├── globals.css      # Design system + component styles
│   └── favicon.ico
└── components/          # [FUTURE] Extract if page.tsx > 2000 LOC
    ├── HeroSection.tsx
    ├── MetricsSection.tsx
    ├── PricingSection.tsx
    └── ...

public/assets/           # Resume comparisons, success screenshots
```

**Structure Decision**: Single-file approach in `page.tsx` maintained per existing pattern. Component extraction triggered only if LOC > 2000.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | No violations | Constitution requirements met |

---

## Phase 0: Research Complete

*See [research.md](./research.md) for detailed findings.*

## Phase 1: Design Complete

*See [data-model.md](./data-model.md) and [quickstart.md](./quickstart.md).*

---

## Core Implementation

This section maps each User Story to concrete implementation steps with cross-references to supporting documentation.

### User Story 1: 프로그램 핵심 가치 이해 (P1)

**Goal**: Visitor understands "합격 루프" within 3 seconds

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Verify Hero section core message | `page.tsx:1614-1674` | FR-001 |
| 2 | Review V0→V5 loop visualization | `page.tsx:1749-1880` (desktop), `1883-2014` (mobile) | FR-002 |
| 3 | Check animation timing | `page.tsx:260-277` (AnimatedSection) | [research.md § 2](./research.md#2-framer-motion-animation-patterns-for-neo-brutalist-design) |
| 4 | Verify mobile responsiveness | Test at < 768px breakpoint | [research.md § 3](./research.md#3-responsive-layout-patterns-for-korean-text) |

**Success Criteria**: SC-001 (3-second comprehension)

---

### User Story 2: 실제 성과 데이터 확인 (P1)

**Goal**: Visitor sees verified metrics that build trust

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Verify core metrics display | `page.tsx:698-736` (TrustMetrics) | FR-003, [data-model.md § Metric](./data-model.md#metric-성과-지표) |
| 2 | Verify change metrics before/after | `page.tsx:213-258` (PercentageChangeCard) | FR-004, [data-model.md § ChangeMetric](./data-model.md#changemetric-변화율-데이터) |
| 3 | Add/verify company names | Check SECTION 5 or create section | FR-005, [data-model.md § Company](./data-model.md#companyname-합격-기업) |
| 4 | Verify counter animations | `page.tsx:166-210` (AnimatedCounter) | [research.md § 2](./research.md#2-framer-motion-animation-patterns-for-neo-brutalist-design) |

**Success Criteria**: SC-004 (all metrics visible in one viewport)

---

### User Story 3: 상품 선택 및 CTA 클릭 (P1)

**Goal**: Visitor can compare and select from 3 products

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Create/verify PRODUCTS constant | Top of `page.tsx` | [data-model.md § Product](./data-model.md#product-상품) |
| 2 | Implement 3-product comparison layout | Create dedicated Pricing section | FR-006, [quickstart.md § Section Pattern](./quickstart.md#section-pattern) |
| 3 | Add CTA buttons with correct URLs | Each product card | FR-007, [research.md § 5](./research.md#5-cta-link-destinations) |
| 4 | Add INFLEARN_LIVE flag and badge | Top of `page.tsx` | FR-008, [quickstart.md § Toggle Inflearn](./quickstart.md#toggle-inflearn-availability) |
| 5 | Add W1~W4 curriculum for 4주 program | Expandable or tooltip | FR-013, [data-model.md § WeeklyCurriculum](./data-model.md#weeklycurriculum-주차별-커리큘럼) |
| 6 | List deliverables | Within 4주 product card | FR-014 |

**Success Criteria**: SC-002 (compare in 10 seconds), SC-005 (1-click CTA)

---

### User Story 4: 대상 고객 공감 확인 (P2)

**Goal**: Visitor can self-identify as target or non-target

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Verify target conditions display | `page.tsx:2560-2686` (SECTION 7) | FR-009 |
| 2 | Verify "맞지 않는 대상" section | Same section | FR-010 |
| 3 | Check pain points messaging | Same section | spec.md acceptance scenarios |

**Success Criteria**: Visitor can self-qualify/disqualify

---

### User Story 5: 5가지 피드백 관점 이해 (P2)

**Goal**: Visitor understands depth of feedback methodology

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Verify all 5 perspectives present | `page.tsx:2086-2404` (SECTION 4) | FR-011 |
| 2 | Cross-check with data model | Compare to FEEDBACK_PERSPECTIVES | [data-model.md § FeedbackPerspective](./data-model.md#feedbackperspective-피드백-관점) |
| 3 | Ensure each has description + examples | Review card content | spec.md acceptance scenarios |

**Success Criteria**: All 5 perspectives clearly differentiated

---

### User Story 6: 3가지 원칙 이해 (P3)

**Goal**: Visitor understands program operating principles

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Verify 3 principles with tooltips | `page.tsx:2023-2074` | FR-012 |
| 2 | Check tooltip content accuracy | Lines 2038, 2056, 2070 | [data-model.md § Principle](./data-model.md#principle-원칙) |

**Success Criteria**: Principles visible with explanations on hover/click

---

### User Story 7: FAQ 확인 (P3)

**Goal**: Visitor finds answers to common questions

| Step | Action | File Location | Reference |
|------|--------|---------------|-----------|
| 1 | Verify FAQ component implementation | `page.tsx:1294-1358` | FR-015 |
| 2 | Check accordion behavior | Test expand/collapse | [research.md § 4](./research.md#4-accordionfaq-implementation-without-additional-dependencies) |
| 3 | Verify questions match spec | Compare to FAQ_ITEMS | [data-model.md § FAQItem](./data-model.md#faqitem-faq-항목) |

**Success Criteria**: All specified questions answerable via accordion

---

## Implementation Sequence

```
┌─────────────────────────────────────────────────────────────┐
│  Phase 1: P1 Critical Path (blocks conversion)              │
├─────────────────────────────────────────────────────────────┤
│  US-1 → US-2 → US-3                                         │
│  (Loop)  (Metrics) (Pricing)                                │
│                                                             │
│  Dependencies: None (parallel possible)                     │
│  Estimate: 3 tasks, each ~1-2 hours verification/fix        │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 2: P2 Important (enhances understanding)             │
├─────────────────────────────────────────────────────────────┤
│  US-4 → US-5                                                │
│  (Target) (Feedback)                                        │
│                                                             │
│  Dependencies: None (parallel possible)                     │
│  Estimate: 2 tasks, each ~30-60 min verification            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 3: P3 Complete (rounds out experience)               │
├─────────────────────────────────────────────────────────────┤
│  US-6 → US-7                                                │
│  (Principles) (FAQ)                                         │
│                                                             │
│  Dependencies: None (parallel possible)                     │
│  Estimate: 2 tasks, each ~30 min verification               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Phase 4: Quality & Polish                                  │
├─────────────────────────────────────────────────────────────┤
│  Responsive (FR-016) → Design (FR-017) → Motion (FR-018)    │
│                                                             │
│  Use: quickstart.md § Visual Verification Checklist         │
│  Final: npm run lint && npm run build                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Reference

| Document | When to Use |
|----------|-------------|
| [spec.md](./spec.md) | User stories, FRs, acceptance criteria, success criteria |
| [research.md](./research.md) | Animation patterns, responsive layout, FAQ implementation, CTA destinations |
| [data-model.md](./data-model.md) | Type definitions, all hardcoded data values |
| [quickstart.md](./quickstart.md) | Design tokens, section patterns, verification checklist |
| [tasks.md](./tasks.md) | Detailed task breakdown with gap analysis |

---

## Next Steps

1. Start with [tasks.md](./tasks.md) for detailed implementation checklist
2. Tasks are ordered by User Story priority (P1 → P2 → P3)
3. Each task includes acceptance criteria from spec.md and cross-references
