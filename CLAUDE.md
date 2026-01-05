# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

**Always use `bun`, not `npm`.**

```sh
# 1. Make changes

# 2. Typecheck (fast)
bun run typecheck

# 3. Run tests
bun run test -- -t "test name"    # Single suite
bun run test:file -- "glob"       # Specific files

# 4. Lint before committing
bun run lint:file -- "file1.ts"   # Specific files
bun run lint                      # All files

# 5. Before creating PR
bun run lint:claude && bun run test
```

## Project Overview

Landing page for 옥토버 코드 (October Code) - a Korean career transition/job placement program. Built with Next.js 16, React 19, and Tailwind CSS 4 using a neo-brutalist design system.

## Development Commands

```bash
bun dev          # Start development server (localhost:3000)
bun run build    # Production build
bun run start    # Run production server
bun run lint     # Run ESLint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16.1.1 with App Router
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4 via `@tailwindcss/postcss`
- **Animation**: Framer Motion 12.x
- **Fonts**: Inter (body) + JetBrains Mono (monospace)

### File Structure
```
src/app/
├── layout.tsx    # Root layout with metadata (Korean locale)
├── page.tsx      # Single-page landing (all sections in one file)
├── globals.css   # Design system + component styles
└── favicon.ico

public/assets/    # Resume comparison images, success screenshots
```

### Design System (Neo-Brutalism)

The design uses a consistent neo-brutalist style defined in `globals.css`:

**CSS Variables**:
- `--accent`: `#FF6B35` (orange accent color)
- `--shadow-brutal`: `4px 4px 0px #000`
- `--border-width`: `3px`

**Key Classes**:
- `.brutal-btn` - Buttons with 3px border + 4px shadow offset
- `.brutal-card` / `.brutal-card-dark` - Card variants for light/dark sections
- `.section-dark` / `.section-light` - Section background alternation
- `.text-highlight` - Orange gradient underline highlight effect
- `.loop-card` - Specialized cards for process flow diagrams

### Component Patterns

All components are co-located in `page.tsx`. Key patterns:

**Animation Hooks**:
- `useScrollAnimation()` - IntersectionObserver-based visibility detection
- `AnimatedCounter` - Number count-up animation on scroll
- `Countdown` / `CountdownCompact` - Timer components for urgency

**Interactive Elements**:
- `Tooltip` - Neo-brutalist tooltip with click/hover toggle
- `AnimatedSection` - Wrapper for scroll-triggered fade animations
- `PercentageChangeCard` - Before/after stat visualization

## Path Aliases

```typescript
@/* → ./src/*
```

## Styling Notes

- Tailwind 4 uses CSS-first configuration (no `tailwind.config.js`)
- Custom utilities defined in `globals.css` `@layer utilities` block
- Reduced motion preferences are respected via `@media (prefers-reduced-motion)`
- Mobile-first responsive design with `md:` breakpoint at 768px

## Active Technologies
- TypeScript 5.x, Node.js 20+ (Next.js 16.1.1, React 19.2.3) + Next.js 16, React 19, Framer Motion 12.23.26, Tailwind CSS 4 (001-landing-page-improvement)
- N/A (static landing page; Supabase planned for future auth - out of scope) (001-landing-page-improvement)

## Recent Changes
- 001-landing-page-improvement: Added TypeScript 5.x, Node.js 20+ (Next.js 16.1.1, React 19.2.3) + Next.js 16, React 19, Framer Motion 12.23.26, Tailwind CSS 4
