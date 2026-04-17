
# High-End Cybersecurity Portfolio — Build Plan

A premium, Awwwards-style dark portfolio with full Three.js + GSAP treatment. All content will use clearly marked placeholders ([Your Name], [Project 01], etc.) for you to fill in afterward.

## Visual Direction
- **Palette**: Deep near-black base (`#06070B`) with **electric cyan + violet** dual-accent gradients and a hint of magenta for highlights. Subtle neon glow + glassmorphism panels with thin 1px gradient borders.
- **Typography**: Large display sans (Space Grotesk / Inter Tight) for headings + JetBrains Mono for tech/terminal accents. Strong hierarchy, generous spacing.
- **Mood**: Premium hacking dashboard meets futuristic engineering lab.

## Global Effects (site-wide)
- **Lenis** smooth scroll with momentum + GSAP ScrollTrigger sync
- **Custom cursor** with glowing trail (canvas-based, blends to accent on interactive elements)
- **Ambient background**: animated cyber grid + drifting particles canvas (fixed, behind everything, low opacity)
- **Page section transitions**: fade/slide with mask reveals on entering viewport
- Reduced-motion + mobile-perf fallbacks (heavy 3D auto-degrades on small/touch devices)

## Route Structure (separate routes for SEO + per-page meta)
- `/` — Hero + condensed highlights of each section
- `/about` — Full bio, animated text reveal, particle backdrop
- `/skills` — Interactive skill grid with hover reveals
- `/projects` — Full project gallery with 3D tilt cards + modal details
- `/experience` — Animated career timeline with milestone reveals
- `/writeups` — Blog / CTF writeups list (placeholder posts)
- `/services` — Hire Me / pentesting services with CTA
- `/contact` — Futuristic form + glowing social links

Shared header (glass nav, blurred, with active link glow) and footer in `__root.tsx`.

## Section-by-Section

### 1. Hero (3D)
- Three.js scene: floating abstract tech shapes (icosahedrons, wireframe cubes, drifting code-fragment planes with shader-glitched text)
- Mouse-driven camera parallax + subtle auto-rotation
- Glowing animated title "Cybersecurity Engineer / Red Teamer" with gradient text + per-character GSAP reveal
- Subtitle, dual CTA buttons (View Work / Get in Touch), animated scroll hint at bottom

### 2. About
- Split layout: portrait placeholder + bio
- Per-line fade/typing reveal on scroll
- Subtle 3D particle field behind text

### 3. Skills
- Categorized grid (Offensive Sec, Defensive, Languages, Tooling, Cloud)
- Animated SVG icons, hover reveals proficiency bar + short note
- Magnetic hover micro-interactions

### 4. Projects
- Bento-style grid of project cards
- 3D tilt on hover (vanilla-tilt style), glow border, preview image
- Click → modal with details, tech stack chips, links, screenshots gallery
- Each card themed with cyber UI chrome (corner brackets, status LED, mono labels)

### 5. Stats / Achievements
- Animated counters (CVEs found, CTFs won, boxes pwned, years experience)
- HUD-style cards with terminal-flavored labels
- Scroll-triggered count-up via GSAP

### 6. Experience Timeline
- Vertical timeline with alternating cards
- Scroll-driven progress line that draws as you scroll
- Each milestone reveals with slide + fade

### 7. Writeups
- List of blog/CTF writeup cards (title, tags, date, excerpt)
- Placeholder posts; click opens detail view (route `/writeups/$slug`)

### 8. Services / Hire Me
- 3 service tiers (Pentest, Red Team Engagement, Security Consulting)
- Glass cards, gradient borders, prominent CTA back to contact

### 9. Contact
- Futuristic form (name, email, message) with animated focus states (label float, accent underline glow)
- Social icons (GitHub, LinkedIn, X, etc.) with hover glow + magnetic effect
- Form submits to a placeholder handler (toast on success — easy to wire to email later)

## Tech Implementation
- **Three.js** + **@react-three/fiber** + **@react-three/drei** for 3D
- **GSAP** + **ScrollTrigger** for orchestration
- **Lenis** for smooth scroll
- **framer-motion** as a complement for component-level transitions
- **vanilla-tilt** (or custom) for project card tilt
- TanStack Start routes with per-route `head()` meta (title, description, og tags)
- Tailwind v4 design tokens extended with cyber palette + glow shadow utilities
- Mobile/touch detection to swap heavy effects for lightweight CSS equivalents

## Deliverable
A production-ready, fully responsive portfolio — every section built and animated, content slotted with clear placeholders for you to replace.
