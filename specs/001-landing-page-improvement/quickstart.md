# Quickstart: 옥토버 아카데미 랜딩 페이지 개선

**Feature Branch**: `001-landing-page-improvement`
**Date**: 2026-01-02

## Prerequisites

- Node.js 20+ installed
- npm or pnpm package manager
- Git

## Setup

```bash
# Clone and checkout feature branch
git clone <repo-url>
cd october-landing
git checkout 001-landing-page-improvement

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

## Project Structure

```
october-landing/
├── src/
│   └── app/
│       ├── layout.tsx      # Root layout with Korean metadata
│       ├── page.tsx        # All landing page sections
│       └── globals.css     # Neo-brutalist design system
├── public/
│   └── assets/             # Images (resume comparisons, screenshots)
├── specs/
│   └── 001-landing-page-improvement/
│       ├── spec.md         # Feature specification
│       ├── plan.md         # Implementation plan
│       ├── research.md     # Research findings
│       ├── data-model.md   # Type definitions
│       └── quickstart.md   # This file
└── package.json
```

## Key Files to Modify

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Main landing page content and sections |
| `src/app/globals.css` | Design tokens and component styles |
| `public/assets/` | Images for resume comparisons |

## Design System Reference

### Colors

```css
--accent: #FF6B35          /* Primary accent (orange) */
--dark-bg: #0a0a0a         /* Dark section background */
--light-bg: #ffffff        /* Light section background */
```

### Neo-Brutalist Components

```css
.brutal-btn      /* Button with 3px border, 4px shadow */
.brutal-card     /* Card for light sections */
.brutal-card-dark /* Card for dark sections */
.text-highlight  /* Orange underline highlight effect */
```

### Section Pattern

```tsx
<section className="section-dark py-20 md:py-32">
  <div className="max-w-6xl mx-auto px-4 md:px-8">
    <h2 className="text-3xl md:text-5xl font-bold mb-12">
      Section Title
    </h2>
    {/* Section content */}
  </div>
</section>
```

## Common Tasks

### Add a New Section

1. Create section component in `page.tsx`
2. Add section to main `<Home>` component
3. Apply `section-dark` or `section-light` class
4. Use `AnimatedSection` wrapper for scroll animations

### Update Metrics Data

Edit the `METRICS` or `CHANGE_METRICS` constants at the top of `page.tsx`:

```tsx
const METRICS = [
  { value: 14, label: "합격자", suffix: "+" },
  // ...
];
```

### Update Product Information

Edit the `PRODUCTS` constant:

```tsx
const PRODUCTS = [
  {
    id: "one-time",
    name: "1회 멘토링",
    price: "3만원",
    // ...
  },
  // ...
];
```

### Toggle Inflearn Availability

Change the flag at the top of `page.tsx`:

```tsx
const INFLEARN_LIVE = false; // Set to true when course launches
```

## Quality Checks

Before committing:

```bash
# Run linting
npm run lint

# Build production bundle
npm run build

# Check bundle size (should be < 200KB gzipped)
# Build output shows this automatically
```

## Visual Verification Checklist

- [ ] Hero section displays "합격 루프" visualization
- [ ] Metrics section shows all 4 metrics with animations
- [ ] Change metrics show before/after comparison
- [ ] Pricing section displays all 3 products
- [ ] Inflearn shows "오픈 예정" badge when disabled
- [ ] FAQ accordion expands/collapses correctly
- [ ] All CTA buttons have correct hover states
- [ ] Mobile layout (< 768px) is readable
- [ ] Animations respect `prefers-reduced-motion`

## Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Troubleshooting

### Fonts not loading
Check that Google Fonts import is at the top of `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
```

### Animations not working
1. Check `prefers-reduced-motion` is not enabled
2. Verify Framer Motion is imported correctly
3. Check `useInView` hook is attached to the correct ref

### Korean text breaking incorrectly
Add `word-break: keep-all` class to the container:
```tsx
<p className="break-keep">한국어 텍스트...</p>
```

## Next Steps

After completing this quickstart:

1. Review [spec.md](./spec.md) for detailed requirements
2. Check [data-model.md](./data-model.md) for type definitions
3. Run `/speckit.tasks` to generate implementation tasks
