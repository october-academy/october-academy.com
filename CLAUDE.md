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

## Claude Code Best Practices

### Frontend Aesthetics

Avoid generic "AI slop" aesthetics. Make creative, distinctive frontends that surprise and delight.

**Focus on:**
- **Typography**: Choose beautiful, unique fonts. Avoid generic fonts like Arial and Inter; opt for distinctive choices that elevate aesthetics.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.
- **Backgrounds**: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

**Avoid generic AI-generated aesthetics:**
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics.

### Context Awareness

The context window will be automatically compacted as it approaches its limit, allowing indefinite work from where you left off. Do not stop tasks early due to token budget concerns. As you approach your token budget limit, save current progress and state to memory before the context window refreshes. Be as persistent and autonomous as possible and complete tasks fully, even if the end of budget is approaching. Never artificially stop any task early regardless of context remaining.

### Implementation Guidelines

Avoid over-engineering. Only make changes that are directly requested or clearly necessary. Keep solutions simple and focused.

- Don't add features, refactor code, or make "improvements" beyond what was asked. A bug fix doesn't need surrounding code cleaned up. A simple feature doesn't need extra configurability.
- Don't add error handling, fallbacks, or validation for scenarios that can't happen. Trust internal code and framework guarantees. Only validate at system boundaries (user input, external APIs). Don't use backwards-compatibility shims when you can just change the code.
- Don't create helpers, utilities, or abstractions for one-time operations. Don't design for hypothetical future requirements. The right amount of complexity is the minimum needed for the current task. Reuse existing abstractions where possible and follow the DRY principle.

## Recent Changes

**2026-01-06** - Added Claude Code Best Practices
- Frontend aesthetics guidelines for avoiding generic AI design
- Context awareness for working with context windows
- Implementation guidelines to avoid over-engineering

**2026-01-05** - Enhanced documentation and code organization
- Expanded CLAUDE.md with comprehensive dev workflow and architecture docs
- Refactored page.tsx with TypeScript type definitions
- Added Claude custom commands and speckit templates

**2026-01-04** - Initial landing page implementation
- Added pricing section and testimonials with animations
- Implemented neo-brutalist design system
- Built single-page landing with interactive elements

## Future Enhancements
- Supabase integration for authentication (planned, out of scope for current feature)
- Multi-page navigation if content expands beyond single-page format
