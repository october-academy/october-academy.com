# Tasks: 옥토버 아카데미 랜딩 페이지 개선

**Input**: Design documents from `/specs/001-landing-page-improvement/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: Manual verification only (no automated test suite per plan.md). Build + lint as quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Source**: `src/app/page.tsx` (all sections in single file per existing pattern)
- **Styles**: `src/app/globals.css` (neo-brutalist design system)
- **Assets**: `public/assets/` (images)
- **Specs**: `specs/001-landing-page-improvement/` (documentation)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Data constants and type definitions that all user stories will use

- [X] T001 Add TypeScript interfaces from data-model.md to top of src/app/page.tsx (Product, Metric, ChangeMetric, FeedbackPerspective, Principle, FAQItem, WeekContent, Company)
- [X] T002 Add PRODUCTS constant array to src/app/page.tsx with 3 products per data-model.md
- [X] T003 [P] Add METRICS constant array to src/app/page.tsx per data-model.md
- [X] T004 [P] Add CHANGE_METRICS constant array to src/app/page.tsx per data-model.md
- [X] T005 [P] Add FEEDBACK_PERSPECTIVES constant array to src/app/page.tsx per data-model.md
- [X] T006 [P] Add PRINCIPLES constant array to src/app/page.tsx per data-model.md
- [X] T007 [P] Add FAQ_ITEMS constant array to src/app/page.tsx per data-model.md
- [X] T008 [P] Add WEEKLY_CURRICULUM constant array to src/app/page.tsx per data-model.md
- [X] T009 [P] Add COMPANIES constant array to src/app/page.tsx per data-model.md
- [X] T010 [P] Add INFLEARN_LIVE boolean flag to src/app/page.tsx (default: false)

**Checkpoint**: All data constants defined - user story implementation can now reference these constants

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T011 Verify AnimatedSection component exists in src/app/page.tsx for scroll-triggered fade animations per research.md
- [X] T012 Verify AnimatedCounter component exists in src/app/page.tsx for number count-up animations
- [X] T013 [P] Verify neo-brutalist CSS classes exist in src/app/globals.css (.brutal-btn, .brutal-card, .brutal-card-dark, .section-dark, .section-light, .text-highlight)
- [X] T014 [P] Verify prefers-reduced-motion support in src/app/globals.css per FR-018
- [X] T015 Verify PercentageChangeCard component exists in src/app/page.tsx for before/after metrics display

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - 프로그램 핵심 가치 이해 (Priority: P1) 🎯 MVP

**Goal**: Visitor understands "합격 루프" (V0→V5 process) within 3 seconds

**Independent Test**: Open landing page, verify Hero section displays "제출 → 피드백 → 수정 → 재제출" loop visualization clearly. Test at mobile (<768px) and desktop breakpoints.

**Acceptance**: FR-001 (loop visualization), FR-002 (V0→V5 stages), SC-001 (3-second comprehension)

### Implementation for User Story 1

- [X] T016 [US1] Verify Hero section core message in src/app/page.tsx:1614-1674 per FR-001
- [X] T017 [US1] Verify desktop loop visualization in src/app/page.tsx:1749-1880 shows V0→V5 progression per FR-002
- [X] T018 [P] [US1] Verify mobile loop visualization in src/app/page.tsx:1883-2014 displays correctly at <768px
- [X] T019 [US1] Verify animation timing in src/app/page.tsx (AnimatedSection) uses fadeUp pattern per research.md
- [X] T020 [US1] Test Hero section renders correctly with prefers-reduced-motion enabled

**Checkpoint**: User Story 1 complete - Hero section delivers core message

---

## Phase 4: User Story 2 - 실제 성과 데이터 확인 (Priority: P1)

**Goal**: Visitor sees verified metrics that build trust

**Independent Test**: Scroll to metrics section, verify all 4 core metrics (합격자, 기업, 서류 통과율, 면접 전환) display with animations. Verify before/after change metrics show correctly.

**Acceptance**: FR-003 (core metrics), FR-004 (change metrics before/after), FR-005 (company names), SC-004 (all metrics visible in one viewport)

### Implementation for User Story 2

- [X] T021 [US2] Verify TrustMetrics section in src/app/page.tsx:698-736 displays METRICS data per FR-003
- [X] T022 [US2] Verify PercentageChangeCard in src/app/page.tsx:213-258 displays CHANGE_METRICS with before/after format per FR-004
- [X] T023 [US2] Verify AnimatedCounter in src/app/page.tsx:166-210 triggers count-up animation on scroll
- [X] T024 [P] [US2] Add or verify company names display section using COMPANIES constant per FR-005
- [X] T025 [US2] Verify all metrics are visible in one viewport per SC-004
- [X] T026 [US2] Test metric cards don't overflow on mobile with large percentages (+1233%)

**Checkpoint**: User Story 2 complete - Metrics section builds trust with verified data

---

## Phase 5: User Story 3 - 상품 선택 및 CTA 클릭 (Priority: P1)

**Goal**: Visitor can compare and select from 3 products with clear CTAs

**Independent Test**: Navigate to pricing section, verify 3 products display with prices (3만원/3.3만원/40만원), durations, features. Click CTAs and verify they open correct destinations.

**Acceptance**: FR-006 (3 products comparison), FR-007 (CTA buttons), FR-008 (Inflearn "오픈 예정" state), FR-013 (W1~W4 curriculum), FR-014 (deliverables), SC-002 (10-second comparison), SC-005 (1-click CTA)

### Implementation for User Story 3

- [X] T027 [US3] Create or verify Pricing section in src/app/page.tsx using PRODUCTS constant with 3-product comparison layout per FR-006
- [X] T028 [US3] Add CTA buttons to each product card with correct URLs per FR-007
- [X] T029 [US3] Implement INFLEARN_LIVE conditional rendering with "1월 중 오픈 예정" badge per FR-008
- [X] T030 [P] [US3] Add 4주 정기 멘토링 weekly curriculum display using WEEKLY_CURRICULUM per FR-013
- [X] T031 [P] [US3] List deliverables in 4주 product card (이력서, 면접 답변 프레임, 피드백 기록) per FR-014
- [X] T032 [US3] Mark 4주 정기 멘토링 as popular product with isPopular badge styling
- [X] T033 [US3] Verify CTA buttons use target="_blank" and rel="noopener noreferrer" for external links per research.md
- [X] T034 [US3] Verify product cards use neo-brutalist styling (.brutal-card) per FR-017

**Checkpoint**: User Story 3 complete - Pricing section enables product comparison and conversion

---

## Phase 6: User Story 4 - 대상 고객 공감 확인 (Priority: P2)

**Goal**: Visitor can self-identify as target or non-target

**Independent Test**: Navigate to target audience section, verify pain points, target criteria (Frontend/Backend/DevOps, 1~5년차), and non-target criteria are visible.

**Acceptance**: FR-009 (대상 조건), FR-010 (맞지 않는 대상)

### Implementation for User Story 4

- [X] T035 [US4] Verify target conditions display in src/app/page.tsx:2560-2686 (SECTION 7) per FR-009
- [X] T036 [US4] Verify pain points messaging (서류/면접 반복 탈락, 경험 표현 방법 모름, 마감/피드백 필요)
- [X] T037 [P] [US4] Verify "맞지 않는 대상" section displays criteria per FR-010
- [X] T038 [US4] Verify target criteria include 직군 and 경력 (1~5년차)

**Checkpoint**: User Story 4 complete - Target audience section enables self-qualification

---

## Phase 7: User Story 5 - 5가지 피드백 관점 이해 (Priority: P2)

**Goal**: Visitor understands depth of feedback methodology

**Independent Test**: Navigate to feedback section, verify all 5 perspectives (문서 형식, 기술 검증, 수치 증명, 소프트 스킬, 비즈니스 임팩트) display with descriptions and examples.

**Acceptance**: FR-011 (5가지 피드백 관점)

### Implementation for User Story 5

- [X] T039 [US5] Verify all 5 feedback perspectives in src/app/page.tsx:2086-2404 (SECTION 4) match FEEDBACK_PERSPECTIVES constant per FR-011
- [X] T040 [US5] Verify each perspective displays icon, name, description, and examples
- [X] T041 [US5] Ensure perspectives use neo-brutalist card styling

**Checkpoint**: User Story 5 complete - Feedback section demonstrates program expertise

---

## Phase 8: User Story 6 - 3가지 원칙 이해 (Priority: P3)

**Goal**: Visitor understands program operating principles

**Independent Test**: Navigate to principles section, verify 3 principles (완벽 금지, 제출 필수, 거절=데이터) display with tooltips/explanations showing benefit.

**Acceptance**: FR-012 (3가지 원칙)

### Implementation for User Story 6

- [X] T042 [US6] Verify 3 principles in src/app/page.tsx:2023-2074 match PRINCIPLES constant per FR-012
- [X] T043 [US6] Verify each principle has shortName, description, and benefit visible or in tooltip
- [X] T044 [US6] Verify Tooltip component works on both click and hover for principles

**Checkpoint**: User Story 6 complete - Principles section sets expectations

---

## Phase 9: User Story 7 - FAQ 확인 (Priority: P3)

**Goal**: Visitor finds answers to common questions

**Independent Test**: Navigate to FAQ section, verify accordion with 4 questions. Click each question to verify answer expands.

**Acceptance**: FR-015 (FAQ accordion)

### Implementation for User Story 7

- [X] T045 [US7] Verify FAQ section in src/app/page.tsx:1294-1358 uses FAQ_ITEMS constant per FR-015
- [X] T046 [US7] Verify accordion behavior using native details or Framer Motion per research.md
- [X] T047 [US7] Verify all 4 FAQ questions are present (주니어/신입 참여, 환불 정책, 주당 시간, 합격 보장)
- [X] T048 [US7] Verify FAQ cards use neo-brutalist styling

**Checkpoint**: User Story 7 complete - FAQ section handles objections

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Quality verification across all user stories

### Responsive Design (FR-016)

- [X] T049 [P] Test all sections at mobile breakpoint (<768px) per FR-016
- [X] T050 [P] Test all sections at desktop breakpoint (>=768px)
- [X] T051 Verify touch targets are minimum 44px on mobile per quickstart.md

### Design System Consistency (FR-017)

- [X] T052 Verify all sections follow neo-brutalist design (3px border, 4px shadow, #FF6B35 accent) per FR-017
- [X] T053 Verify section alternation between section-dark and section-light
- [X] T054 Verify text-highlight effect uses orange gradient underline

### Animation & Accessibility (FR-018)

- [X] T055 Verify all animations respect prefers-reduced-motion per FR-018
- [X] T056 Test scroll-triggered animations work correctly across all sections
- [X] T057 Verify external links open in new tab with proper rel attributes

### Quality Gates

- [X] T058 Run npm run lint and fix all errors
- [X] T059 Run npm run build and verify bundle size < 200KB gzipped per plan.md
- [X] T060 Run quickstart.md Visual Verification Checklist
- [X] T061 Test on Chrome, Safari, Firefox (latest) per quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-9)**: All depend on Foundational phase completion
  - US1-US3 (P1): Critical path - complete first
  - US4-US5 (P2): Can proceed after or parallel with P1
  - US6-US7 (P3): Can proceed after or parallel with P2
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Uses T011 (AnimatedSection), T013 (CSS classes), T014 (reduced motion)
- **User Story 2 (P1)**: Uses T003-T004 (METRICS constants), T012 (AnimatedCounter), T015 (PercentageChangeCard), T009 (COMPANIES)
- **User Story 3 (P1)**: Uses T002 (PRODUCTS), T008 (WEEKLY_CURRICULUM), T010 (INFLEARN_LIVE)
- **User Story 4 (P2)**: No dependencies on other stories - uses static content
- **User Story 5 (P2)**: Uses T005 (FEEDBACK_PERSPECTIVES)
- **User Story 6 (P3)**: Uses T006 (PRINCIPLES)
- **User Story 7 (P3)**: Uses T007 (FAQ_ITEMS)

### Parallel Opportunities

- All Setup tasks T003-T010 marked [P] can run in parallel (different constants)
- All Foundational tasks T013-T014 marked [P] can run in parallel
- Within each user story, tasks marked [P] can run in parallel
- P1 stories (US1, US2, US3) can theoretically run in parallel but share page.tsx
- P2 stories (US4, US5) can run in parallel
- P3 stories (US6, US7) can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch all constant definition tasks together:
Task: "Add METRICS constant array to src/app/page.tsx" (T003)
Task: "Add CHANGE_METRICS constant array to src/app/page.tsx" (T004)
Task: "Add FEEDBACK_PERSPECTIVES constant array to src/app/page.tsx" (T005)
Task: "Add PRINCIPLES constant array to src/app/page.tsx" (T006)
Task: "Add FAQ_ITEMS constant array to src/app/page.tsx" (T007)
Task: "Add WEEKLY_CURRICULUM constant array to src/app/page.tsx" (T008)
Task: "Add COMPANIES constant array to src/app/page.tsx" (T009)
Task: "Add INFLEARN_LIVE flag to src/app/page.tsx" (T010)
```

---

## Implementation Strategy

### MVP First (User Story 1-3 Only)

1. Complete Phase 1: Setup (all constants)
2. Complete Phase 2: Foundational (verify existing components)
3. Complete Phase 3-5: User Stories 1-3 (P1 - critical path)
4. **STOP and VALIDATE**: Test Hero, Metrics, Pricing independently
5. Run quality gates (lint, build)
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Hero) → Test → 핵심 메시지 전달 가능
3. Add User Story 2 (Metrics) → Test → 신뢰도 구축 가능
4. Add User Story 3 (Pricing) → Test → **MVP Complete!** 전환 가능
5. Add User Stories 4-7 → Test → Full experience
6. Polish phase → Production ready

### File Modification Strategy

Since this is a single-file landing page (src/app/page.tsx):
- Sequential modification recommended to avoid conflicts
- Group related changes by section
- Commit after each user story completion

---

## Notes

- [P] tasks = different constants/sections, no dependencies
- [Story] label maps task to specific user story for traceability
- This is a **verification and enhancement** task, not greenfield development
- Most sections already exist in page.tsx - tasks verify and update content
- Avoid: editing same lines simultaneously, breaking existing functionality
- Commit after each user story checkpoint
