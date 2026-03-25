# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Product Overview

**Clarity** is a web-based Document Decision Assistant that helps users understand complex documents (contracts, agreements, policies) and make informed decisions.

Users upload a document (PDF or text), and the system automatically generates structured insights:
- **Summary** — simple explanation of the document
- **Key Points** — important clauses to know
- **Risks / Red Flags** — potential issues to watch for
- **What You Should Do** — actionable guidance

Clarity is not a chatbot. It is a system that helps users understand and make decisions on complex documents instantly — no prompting required.

## Core Problem

Most people do not fully understand documents before signing, feel confused by complex terms, and don't know what to look for. Existing AI tools are generic and require prompting. Clarity solves this by automatically analyzing documents and presenting structured, decision-oriented insights.

## Target Users

General users (no domain expertise assumed) dealing with:
- Contracts and agreements
- Policies
- Legal or semi-legal documents

## Core Features (MVP)

1. **Document Upload** — Upload PDF files or paste plain text
2. **AI Document Analysis** — Auto-generates Summary, Key Points, Risks, and Recommended Actions
3. **Contextual Q&A** — Follow-up questions answered based on uploaded document context
4. **Session-Based Usage** — No login required; limited free usage (2–3 documents)

## User Flow

1. User lands on intro screen
2. User proceeds to upload screen
3. User uploads document or pastes text
4. System processes document
5. System displays structured insights
6. User optionally asks follow-up questions
7. System responds contextually

## Tech Stack

> These are the ONLY packages to use. Do NOT install anything not listed here without asking first.

| Layer | Tool | Notes |
|---|---|---|
| Framework | Next.js 16+ (App Router) | NOT Pages Router |
| Language | TypeScript | Strict mode enabled |
| Styling | Tailwind CSS v4 | Use `@theme` in CSS — no `tailwind.config.ts` |
| AI | `@anthropic-ai/sdk` | Document analysis and contextual Q&A |
| PDF Processing | `pdf-parse` | Extract raw text from PDFs |
| Icons | `lucide-react` | Outlined, lightweight |
| Deployment | Vercel | Planned |
| Package Manager | npm | — |

### Rules — DO NOT BREAK

- **No component libraries** — no shadcn, no Chakra, no Material UI, no Radix. Use Tailwind only with custom styles defined in this file.
- **No separate backend** — Next.js API routes handle all server logic.
- **No ORM** — no Prisma, no Drizzle. We have no database yet.
- **No unapproved packages** — ask before adding anything not in the list above.

---

## Future Stack (Post-MVP)

> NOT IN MVP — do not install or implement any of these yet.

| Tool | Purpose |
|---|---|
| Supabase (PostgreSQL) | User accounts, document history, saved analyses |
| Clerk or NextAuth.js | Real user login/signup |
| Stripe | Subscriptions beyond free tier |
| Vercel Blob or AWS S3 | Storing uploaded documents |
| PostHog | Analytics — tracking success metrics |
| Upstash Redis | Rate limiting for API routes |
| Sentry | Production error monitoring |
| Resend | Email — signup confirmation, alerts |

## System Architecture

```
Frontend (Next.js App Router)
    └── File upload, UI rendering, result display

API Routes (Next.js — no separate backend)
    └── Document processing, session limits, AI orchestration

AI Layer (@anthropic-ai/sdk)
    └── Text analysis, structured output, Q&A context
```

## AI Processing Flow

1. Extract text from document (PDF parsing or raw text)
2. Clean and chunk text
3. Send to AI model with structured prompt
4. AI returns: Summary, Key Points, Risks, Actions
5. Store context in session for follow-up Q&A

## MVP Constraints

- No authentication required
- No document history or persistent storage
- No multi-document comparison
- Single-document analysis only

## Success Metrics

- Users successfully upload a document
- Users view generated insights
- Users ask follow-up questions
- Users complete the decision flow

---

## Design System / Style Guide

> This is the single source of truth for all visual decisions. Extracted directly from Figma.
> Every component must follow this guide exactly — no approximations.

---

### Colors

Defined in `app/globals.css` under `@theme`. Always use Tailwind utility classes — never hardcode hex values in components.

| Token | Tailwind Class | Hex | Usage |
|---|---|---|---|
| `--color-background` | `bg-background` | `#1A1A1A` | Page background (all frames) |
| `--color-surface` | `bg-surface` | `#1E1E1E` | Cards, panels, upload zone |
| `--color-surface-elevated` | `bg-surface-elevated` | `#2A2A2A` | Icon containers, secondary buttons, hover states |
| `--color-border` | `border-border` / `bg-border` | `#3A3A3A` | Card borders, input borders |
| `--color-divider` | `bg-divider` | `#2E2E2E` | Horizontal divider lines |
| `--color-line` | `bg-line` | `#3F3F3F` | Header bottom line, subtle separators |
| `--color-primary` | `text-primary` | `#ECECEC` | Headings, high-emphasis text |
| `--color-secondary` | `text-secondary` | `#A3A3A3` | Body text, labels, subtext |
| `--color-muted` | `text-muted` | `#737373` | Hints, support notes, placeholders |
| `--color-white` | `text-white` | `#FFFFFF` | Logo, primary button text |
| `--color-accent` | `text-accent` / `bg-accent` | `#DA5B0A` | CTAs, links, primary buttons, active states |
| `--color-success` | `text-success` | `#4ADE80` | Bullet points, "Analyzed" badge text, positive indicators |
| `--color-success-bg` | `bg-success-bg` | `#1E3A2A` | "Analyzed" badge background |

**Usage rules:**
- Accent (`#DA5B0A`) is only used for interactive elements — primary buttons, CTA links, drag-active states
- Primary text (`#ECECEC`) is warm near-white — do NOT use pure `#FFFFFF` for body text
- White (`#FFFFFF`) is reserved for logo and text on filled accent/dark buttons only
- Success green is used for bullet points on key items and status badges — never decoratively

---

### Typography

**Two font families are used — do not mix them up:**

| Font | Usage |
|---|---|
| **Helvetica** (system) | Display: logo, hero heading, section headings, paragraph text in hero |
| **Inter** | UI: labels, buttons, body copy inside cards, input fields, badges |

Apply both via `@theme` in `globals.css`:
```css
--font-display: Helvetica, Arial, sans-serif;
--font-ui: "Inter", system-ui, sans-serif;
```

#### Type Scale (from Figma — exact values)

| Role | Font | Size | Weight | Line Height | Letter Spacing | Color Token | Usage |
|---|---|---|---|---|---|---|---|
| Logo | Helvetica | `24px` | `300` | `1.333` | — | `text-white` | Header wordmark |
| Hero Heading | Helvetica | `60px` | `400` | `1` | `-2.5%` | `text-primary` | Main page title |
| Subheading | Helvetica | `16px` | `300` | `1.625` | — | `text-secondary` | Hero descriptor, trust signal |
| Section Heading | Helvetica | `20px` | `400` | `1.5` | — | `text-primary` | Card section titles (Summary, Key Points, etc.) |
| Upload Label | Inter | `16px` | `400` | `1.5` | — | `text-secondary` | "Drag and drop your file here" |
| CTA / Link | Inter | `14px` | `400` | `1.43` | — | `text-accent` | "or click to browse", "Paste your text instead" |
| Support Note | Inter | `12px` | `400` | `1.333` | — | `text-muted` | "Supports PDF and TXT up to 10MB" |
| Divider Label | Inter | `14px` | `500` | `1.43` | — | `text-muted` | "or" |
| Body / List | Inter | `15px` | `400` | `1.6` | — | `text-secondary` | Card content, list items |
| Risk Title | Inter | `15px` | `500` | `1.5` | — | `text-primary` | Bold label in risk cards |
| Risk Body | Inter | `14px` | `400` | `1.43` | — | `text-muted` | Descriptive text under risk title |
| Button | Inter | `16px` | `500` | `1.5` | — | `text-white` | Primary CTA buttons |
| Input Placeholder | Inter | `15px` | `400` | `1.21` | — | `text-muted` | Text input, chat placeholder |
| File Name | Inter | `16px` | `500` | `1.5` | — | `text-primary` | Uploaded file name |
| File Meta | Inter | `14px` | `400` | `1.5` | — | `text-muted` | File size, metadata |
| Badge | Inter | `12px` | `400` | `1.5` | — | `text-success` | "Analyzed" status badge |

---

### Spacing Scale

Uses **Tailwind's default 4px base unit** — 8px grid at even steps.

> ⚠️ Do NOT define `--spacing-N` tokens in `@theme` — they override Tailwind's utility scale and break icon and component sizing throughout the app.

| Value | Tailwind Utility | Use case |
|---|---|---|
| `4px` | `*-1` | Icon inner gaps, micro spacing |
| `8px` | `*-2` | Tight gaps between inline elements |
| `12px` | `*-3` | Small gaps (icon to label) |
| `16px` | `*-4` | Component inner padding |
| `20px` | `*-5` | Medium gaps |
| `24px` | `*-6` | Section gaps, card inner spacing |
| `32px` | `*-8` | Card padding, large component gaps |
| `40px` | `*-10` | Between hero and upload card |
| `48px` | `*-12` | Large section spacing |
| `64px` | `*-16` | Hero top/bottom padding |

---

### Border Radius

| Element | Value | Tailwind |
|---|---|---|
| Cards (upload, panels, summary sections) | `16px` | `rounded-2xl` |
| Primary buttons | `12px` | `rounded-xl` |
| Secondary buttons / tags | `10px` | `rounded-[10px]` |
| Input fields | `12px` | `rounded-xl` |
| Icon containers | `10px` | `rounded-[10px]` |
| Badges / Pills | `4px` | `rounded` |
| Circular / full-pill | `999px` | `rounded-full` |

---

### Borders & Strokes

| Element | Style |
|---|---|
| Upload zone card | `1px dashed #3A3A3A` (dash pattern: 3px dash, 2px gap) |
| Result section cards | `1px solid #3A3A3A` |
| Input fields (default) | `1px solid #3A3A3A` |
| Input fields (focus) | `2px solid #DA5B0A` |
| Header separator | `0.5px solid #3F3F3F` |
| Horizontal dividers | `1px solid #2E2E2E` |
| Loading spinner | `4px solid #DA5B0A` |

---

### Shadows

- Dark theme avoids all box-shadows — use borders for separation
- No `drop-shadow` or `box-shadow` on any card or panel
- Accent glow (use sparingly on interactive focus): `0 0 0 2px rgba(218, 91, 10, 0.3)`

---

### Icons

- **Library:** `lucide-react` only
- **Style:** Outlined, `strokeWidth={1.5}` always
- **Sizes:**
  - Inline / UI icons: `w-4 h-4` (16px)
  - Button icons: `w-5 h-5` (20px)
  - Feature / hero icons: `w-8 h-8` (32px)
- **Default color:** `text-secondary`; `text-accent` on hover/active; `text-primary` on selected

---

### Component Specs

#### Header
- Height: `~96px` (logo at `y:40`, separator line at `y:98` on 1440px canvas)
- Background: transparent (inherits `bg-background`)
- Border bottom: `0.5px solid` `#3F3F3F` (`border-line`)
- Inner container: `max-w-[1320px] mx-auto px-[60px]` — flex row, items center
- Logo: `"Clarity.ai"`, Helvetica `24px` weight `300`, color `text-white`
- No navigation links in MVP

#### Hero Section
- Canvas position: heading at `y:226` on 1024px tall frame
- Text alignment: `text-center`
- Heading: Helvetica `60px` weight `400` `leading-none tracking-[-0.025em]` `text-primary`
- Subtext container: `500px` wide, centered
- Subtext: Helvetica `16px` weight `300` `leading-[1.625]` `text-secondary`
- Vertical gap between heading and subtext: `gap-6` (24px) — based on `y:226` heading to `y:310` container

#### Upload Card (DropZone)
- Canvas: `877px` wide × `220px` tall, centered on 1440px canvas (margins ~282px each side)
- Tailwind: `w-full max-w-[877px]`
- Background: `bg-surface` (`#1E1E1E`)
- Border: `border border-dashed border-border` (1px dashed `#3A3A3A`)
- Border radius: `rounded-2xl` (16px)
- Padding: `px-8 py-10` (matches 220px height)
- Inner layout: `flex flex-col items-center gap-3`
- Hover state: `hover:border-accent/50` border
- Drag-active state: `border-accent` + icon `text-accent`
- Transition: `transition-colors duration-150`
- Icon: `CloudUpload`, `w-8 h-8 text-secondary`, `strokeWidth={1.5}`
- Upload label: Inter `16px` `400` `text-secondary` — "Drag and drop your file here"
- CTA link: Inter `14px` `400` `text-accent` — "or click to browse"
- Support note: Inter `12px` `400` `text-muted` — "Supports PDF and TXT up to 10MB"
- Label group spacing: `space-y-1`

#### Uploaded File Card (post-selection state)
- Same container as DropZone, replaces content
- Shows: file icon (in `bg-surface-elevated` `rounded-[10px]` container) + filename + file size
- Remove/clear button: X icon on the right
- "Analyze Document" CTA button below the file card
- Button: `w-full bg-accent text-white rounded-xl py-3` Inter `500` `16px`

#### Or Divider
- Full width of upload section
- Layout: `flex items-center gap-4`
- Lines: `flex-1 h-px bg-divider`
- Text: Inter `14px` `500` `text-muted`

#### Paste Toggle
- Layout: `flex items-center gap-2`
- Font: Inter `14px` `400` `text-secondary`
- Hover: `hover:text-primary`
- Icon: `Clipboard`, `w-4 h-4 strokeWidth={1.5}`
- Transition: `transition-colors duration-150`

#### Trust Signal
- Text: `"Your document is never stored"`
- Style: Helvetica `16px` weight `300` `leading-[1.625]` `text-secondary`
- Position: bottom of page, centered — canvas `y:886`

#### Text Area (Paste mode)
- Background: `bg-surface` (`#1E1E1E`)
- Border: `1px solid #3A3A3A`
- Border radius: `rounded-2xl` (16px)
- Placeholder: Inter `16px` `400` `text-muted` — "Paste your document text here..."
- Full width of upload section
- Height: tall enough for comfortable reading (~240px min)

#### Primary Button ("Analyze Document")
- Background: `bg-accent` (`#DA5B0A`)
- Text: Inter `500` `16px` `text-white`
- Border radius: `rounded-xl` (12px)
- Padding: `py-3 px-6`
- Hover: `hover:bg-accent-dark`
- Full width: `w-full`

#### Section Cards (Results page)
- Background: `bg-surface` (`#1E1E1E`)
- Border: `1px solid #3A3A3A`
- Border radius: `rounded-2xl` (16px)
- Icon header: `bg-surface-elevated` `rounded-[10px]` icon container + section title Helvetica `20px` `400`
- Body: Inter `15px` `400` `text-secondary`

#### Analyzing / Loading State
- Centered layout
- Title: Helvetica `20px` `400` `text-primary` — "Analyzing your document..."
- Subtitle: Inter `14px` `400` `text-muted` — "This will just take a moment"
- Spinner: circular, `4px solid #DA5B0A` accent stroke

#### Chat Input (Results page)
- Background: `bg-surface`
- Border: `1px solid #3A3A3A`
- Border radius: `rounded-xl` (12px)
- Placeholder: Inter `15px` `400` `text-muted`
- Send button: square, `bg-surface-elevated` `rounded-xl`

#### Quick-action Chips (Results page)
- Background: `bg-surface`
- Border: `1px solid #3A3A3A`
- Border radius: `rounded-[10px]`
- Text: Inter `14px` `400` `text-secondary`
- Examples: "Explain this simply", "Is this safe to proceed?", "What should I negotiate?", "What are my obligations?"

#### Status Badge ("Analyzed")
- Background: `bg-success-bg` (`#1E3A2A`)
- Text: Inter `12px` `400` `text-success` (`#4ADE80`)
- Border radius: `rounded` (4px)
- Padding: `px-2 py-0.5`

---

### Page Layout

#### Landing Page (`/`) — 1440×1024 canvas

```
<div> bg-background, min-h-screen, flex flex-col
  <Header />                          ← ~96px tall, logo at 40px from top
  <main> flex-1, flex flex-col, items-center, justify-center, px-[60px], gap-10
    <hero> text-center, flex flex-col, gap-6
      <h1>                            ← Helvetica 60px 400, tracking-[-0.025em]
      <p>                             ← Helvetica 16px 300, max-w-[500px]
    <upload-section> w-full, max-w-[877px], flex flex-col, gap-6
      <DropZone />                    ← 877px wide, 220px tall
      <or-divider>
      <PasteToggle />
    <trust-signal>                    ← Helvetica 16px 300, centered
```

#### Document Summary Page (`/results`)

```
<div> bg-background, min-h-screen, flex flex-col
  <Header />
    + file name + "Analyzed" badge (right side of header)
    + "Upload New" + "Export" buttons
  <main> flex-1, flex flex-col, items-center, px-[60px], py-8, gap-6
    <sections-grid> w-full, max-w-[877px], flex flex-col, gap-4
      <Section card> Summary
      <Section card> Key Points
      <Section card> Risks & Red Flags
    <chat-area> w-full, max-w-[877px]
      <quick-chips>
      <input>
```

---

### Design Principles

1. **Dark-first** — every component designed for dark backgrounds. No light mode.
2. **Two-font system** — Helvetica for display/headings, Inter for UI. Never swap them.
3. **Warm palette** — primary text is `#ECECEC` (warm near-white), NOT pure white. Cards are `#1E1E1E`, not pure black.
4. **Accent is earned** — `#DA5B0A` only on interactive elements (buttons, links, active drag). Never decorative.
5. **No decoration** — no gradients, no blurs, no decorative shapes. Clean, functional.
6. **Breathing room** — generous spacing. Whitespace is intentional.
7. **Trust signals** — "Your document is never stored" is always visible near the upload area.

---

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```
