# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

This is a single-page landing page for "옥토버 코드" (October Code), a career transition program. Built with Next.js 16 + React 19 + Tailwind CSS 4.

### Key Files

- `src/app/page.tsx` - Complete landing page as a single client component with:
  - 8 sections (Hero → Problem → Loop → Council → After → Social Proof → Not For Everyone → CTA)
  - Countdown timer component
  - Scroll-triggered fade-in animations (IntersectionObserver)
  - CSS-based charts (BarChart, LineChart)
  - Sticky CTA bar
  - Email signup form

- `src/app/globals.css` - Neo-Brutalism design system:
  - Fonts: Inter (body), JetBrains Mono (numbers/data)
  - Accent color: `#FF6B35`
  - `.brutal-*` utility classes for borders, shadows, cards, buttons
  - `.section-dark` / `.section-light` for alternating sections
  - `.animate-on-scroll` for scroll animations

### Design System

Neo-Brutalism style with:
- 3px solid black borders, no border-radius
- 4px 4px 0px #000 box shadows
- Black/white base with orange (#FF6B35) accent
- Dark ↔ Light section alternation
