# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Always use `bun`, not `npm`.**

```bash
# Frontend (Next.js)
bun dev          # Start development server (localhost:3000)
bun run build    # Production build (outputs to /out for static export)
bun run lint     # Run ESLint

# Worker (Cloudflare Worker - run from workers/email-subscribe/)
cd workers/email-subscribe && bun run dev     # Local worker dev server
cd workers/email-subscribe && bun run deploy  # Deploy to Cloudflare
cd workers/email-subscribe && bun run tail    # Stream live logs from deployed worker
```

## Project Overview

Landing page for 옥토버 코드 (October Code) - a Korean career transition/job placement program. Built with Next.js 16, React 19, and Tailwind CSS 4 using a neo-brutalist design system.

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion 12
- **Backend**: Cloudflare Worker for email subscription
- **Deployment**: Cloudflare Pages (static export via `next.config.ts`) + Cloudflare Workers
- **Analytics**: PostHog for product analytics (configured in layout.tsx)
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss` (CSS-first config, no tailwind.config.js)

### Project Structure
```
src/                          # Next.js frontend
├── app/
│   ├── layout.tsx            # Root layout with metadata (Korean locale)
│   ├── page.tsx              # Main landing page
│   └── globals.css           # Design system + component styles
├── components/landing/
│   ├── sections.tsx          # Major page sections (TrustMetrics, FAQ, etc.)
│   └── ui.tsx                # Reusable UI components (Countdown, Tooltip, etc.)
└── lib/
    ├── constants.ts          # Config values, pricing, content data
    ├── hooks.ts              # Custom React hooks
    └── types.ts              # TypeScript type definitions

workers/email-subscribe/      # Cloudflare Worker for email subscriptions
└── src/index.ts              # Handles POST /subscribe → Google Sheets + Resend email
```

### Design System (Neo-Brutalism)

CSS variables and key classes defined in `globals.css`:

**Variables**: `--accent: #FF6B35`, `--shadow-brutal: 4px 4px 0px #000`, `--border-width: 3px`

**Classes**:
- `.brutal-btn` / `.brutal-card` / `.brutal-card-dark` - Neo-brutalist interactive elements
- `.section-dark` / `.section-light` - Section background alternation
- `.text-highlight` - Orange gradient underline effect

### Path Aliases

```typescript
@/* → ./src/*
```

## Key Patterns

**Animation**: Uses IntersectionObserver via `AnimatedSection` wrapper for scroll-triggered animations. Respects `prefers-reduced-motion`.

**Components**: Section components in `sections.tsx` are self-contained. UI primitives in `ui.tsx`.

**Constants**: All content, pricing tiers, and configuration in `lib/constants.ts`. Update content there, not in component files.

**Email Subscription Flow**: Frontend POSTs to Cloudflare Worker → saves to Google Sheets via Service Account auth → sends welcome email via Resend API. Supports two subscription types: `general` and `inflearn` (different sheets, different email templates).

## Frontend Aesthetics

Avoid generic "AI slop" aesthetics. Make creative, distinctive frontends.

- **Typography**: Use distinctive fonts, not generic system fonts
- **Color**: Commit to a cohesive aesthetic with dominant colors and sharp accents
- **Motion**: Focus on high-impact moments (orchestrated page load > scattered micro-interactions)
- **Backgrounds**: Create atmosphere with gradients, patterns, or contextual effects

## Implementation Guidelines

Avoid over-engineering. Only make changes directly requested or clearly necessary.

- Don't add features, refactoring, or "improvements" beyond what was asked
- Don't add error handling for scenarios that can't happen
- Don't create abstractions for one-time operations
- Don't design for hypothetical future requirements
