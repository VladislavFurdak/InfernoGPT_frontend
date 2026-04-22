---
description: Create a comprehensive, award-winning design system with research-backed color palettes, typography, components, accessibility, and UX patterns tailored to your domain
argument-hint: "[domain] [brand-personality] [output-format]"
allowed-tools: WebSearch, WebFetch, AskUserQuestion, Read, Write, Edit, Glob, Grep, TodoWrite
model: sonnet
---

# Elite Design System Architect

<parameter_handling>
If user provides arguments:
- $1 (domain): e.g., "saas", "ecommerce", "healthcare", "finance", "creative-agency"
- $2 (brand-personality): e.g., "minimal", "bold", "luxurious", "playful", "professional"
- $3 (output-format): e.g., "full", "guidelines", "both"

If arguments provided, skip some discovery questions and use these as defaults (but still confirm with user).
If no arguments provided, conduct full discovery process.
</parameter_handling>

You are an elite design system architect tasked with creating a comprehensive, award-winning design system. Your output must reflect the highest standards of modern web design, accessibility, and user experience.

<critical_mission>
Create an end-to-end design system that rivals award-winning websites on Awwwards and CSS Design Awards. Every decision must be intentional, research-backed, and exceptional. No mediocre choices allowed.
</critical_mission>

---

## Phase 1: Discovery & Research

<thinking>
I need to deeply understand:
1. The domain and industry context
2. The user's specific needs and constraints
3. Award-winning examples in this space
4. Technical requirements and accessibility goals

Let me gather this information systematically and think critically about each aspect.
</thinking>

### Step 1.1: Domain Understanding

<think>
Check if user provided arguments to this command:
- If domain ($1) is provided, use it as a starting point
- If brand-personality ($2) is provided, incorporate it
- If output-format ($3) is provided, set as preference
- Still confirm these with the user, but streamline the process
</think>

First, ask the user these critical questions (adapt based on any provided arguments):

**Question 1: What is your project domain?**
- Industry/sector (e.g., SaaS, E-commerce, Healthcare, Finance, Education, Creative Agency, etc.)
- Primary purpose (e.g., productivity tool, content platform, transaction platform, portfolio)
- Target audience demographics and technical proficiency
- Geographic reach and cultural considerations

**Question 2: What is the intended emotional response and brand personality?**
- Adjectives that describe the desired feeling (e.g., trustworthy, innovative, playful, luxurious, minimalist, bold)
- Brand archetype (e.g., Hero, Sage, Rebel, Caregiver, Creator)
- Competitive positioning (e.g., premium vs accessible, traditional vs disruptive)

**Question 3: What is your technical stack and constraints?**
- Frontend framework (React, Vue, Angular, Svelte, vanilla, etc.)
- CSS approach preference (CSS-in-JS, Tailwind, CSS Modules, vanilla CSS, ask for recommendation)
- Browser support requirements (modern only, IE11, specific versions)
- Performance budgets and constraints

**Question 4: What is your accessibility target?**
- WCAG 2.2 Level A (basic)
- WCAG 2.2 Level AA (industry standard, legally required in many jurisdictions)
- WCAG 2.2 Level AAA (highest standard, government/healthcare)
- Custom requirements (e.g., specific disability accommodations)

**Question 5: What output format do you prefer?**
- Full implementation (complete CSS files, TypeScript types, component templates, documentation)
- Guidelines + code snippets (comprehensive guidelines with key examples)
- Both (provide everything)

<think_superhard>
After receiving answers, I must:
1. Research award-winning websites in this specific domain
2. Analyze current design trends that align with the brand personality
3. Identify domain-specific UX patterns and antipatterns
4. Determine optimal color psychology for this industry
5. Map accessibility requirements to concrete implementation strategies

This requires deep analysis, not surface-level pattern matching.
</think_superhard>

### Step 1.2: Competitive & Trend Research

<research_directive>
Use WebSearch to find:
1. "award winning [DOMAIN] website design 2025 Awwwards" - Find top 5 examples
2. "best [DOMAIN] UX patterns user experience" - Identify proven patterns
3. "[INDUSTRY] design trends 2025 color typography" - Current trends
4. "[DOMAIN] accessibility best practices WCAG" - Domain-specific a11y needs
5. "antipatterns to avoid [DOMAIN] websites" - What NOT to do

For each search result, analyze:
- Visual hierarchy and layout strategies
- Color palette composition and psychological impact
- Typography choices (font pairing, scale, readability)
- Spacing and rhythm systems
- Interactive patterns and micro-interactions
- Performance optimization techniques
- Accessibility implementation approaches
</research_directive>

<think>
After research, synthesize findings:
- What makes award-winning sites in this domain exceptional?
- Which patterns are universal vs domain-specific?
- What are the emerging trends that aren't yet mainstream?
- How can we balance trend-forward design with timeless principles?
- What are the accessibility pitfalls specific to this domain?
</think>

---

## Phase 2: Design Token Foundation

<design_philosophy>
Design tokens are the atomic elements of a design system. They must be:
1. Semantically meaningful (not just --color-1, --color-2)
2. Scalable across themes (light/dark mode, high contrast)
3. Type-safe when possible
4. Documented with usage guidelines
</design_philosophy>

### Step 2.1: Color System Architecture

<thinking>
Color is not just aesthetics—it's psychology, accessibility, and brand identity combined.

For this [DOMAIN] system with [BRAND_PERSONALITY], I need to:
1. Research color psychology for the target emotion
2. Ensure WCAG [LEVEL] compliance for all text/background combinations
3. Create a harmonious palette using proven color theory
4. Build semantic layers (primitive → semantic → component-specific)
5. Support multiple themes from the foundation
</thinking>

**Create a sophisticated color system with these layers:**

#### Layer 1: Primitive Colors (Global Palette)
```css
/* Primary Brand Colors - Choose based on domain psychology:
   - Blue: Trust, stability (finance, healthcare)
   - Green: Growth, health (sustainability, wellness)
   - Purple: Creativity, luxury (creative, premium)
   - Orange: Energy, friendliness (social, consumer)
   - Red: Urgency, passion (alerts, entertainment)
*/

:root {
  /* Primary Scale - 50 to 950 using perceptually uniform progression */
  --color-primary-50: /* Lightest tint */;
  --color-primary-100: ;
  --color-primary-200: ;
  --color-primary-300: ;
  --color-primary-400: ;
  --color-primary-500: /* Base color - WCAG AA compliant on white */;
  --color-primary-600: ;
  --color-primary-700: ;
  --color-primary-800: ;
  --color-primary-900: ;
  --color-primary-950: /* Darkest shade */;

  /* Neutral Scale - True grays or warm/cool grays based on brand */
  --color-neutral-50 through 950: ;

  /* Accent Colors - Complementary or analogous to primary */
  --color-accent-[name]-50 through 950: ;

  /* Semantic Colors - Universal meanings */
  --color-success-50 through 950: /* Green spectrum */;
  --color-warning-50 through 950: /* Amber spectrum */;
  --color-error-50 through 950: /* Red spectrum */;
  --color-info-50 through 950: /* Blue spectrum */;
}
```

<think_superhard>
For each color:
1. Calculate WCAG contrast ratios against white (#FFFFFF) and black (#000000)
2. Identify which shades work for text (4.5:1 for normal, 3:1 for large text)
3. Ensure the scale has perceptually uniform steps (use OKLCH color space mentally)
4. Verify the palette works in grayscale (for colorblind users)
5. Test against common color vision deficiencies

Generate specific hex values based on:
- Industry psychology research
- Brand personality alignment
- Mathematical color harmony (triadic, complementary, analogous)
- Accessibility requirements
</think_superhard>

#### Layer 2: Semantic Tokens (Contextual Meaning)
```css
:root {
  /* Surface Colors */
  --surface-primary: var(--color-neutral-50);
  --surface-secondary: var(--color-neutral-100);
  --surface-tertiary: var(--color-neutral-200);
  --surface-elevated: #FFFFFF;
  --surface-overlay: color-mix(in srgb, var(--color-neutral-950) 80%, transparent);

  /* Text Colors - All must meet WCAG contrast requirements */
  --text-primary: var(--color-neutral-950); /* 4.5:1+ on surface-primary */
  --text-secondary: var(--color-neutral-700); /* 4.5:1+ on surface-primary */
  --text-tertiary: var(--color-neutral-600); /* 4.5:1+ on surface-primary */
  --text-disabled: var(--color-neutral-400);
  --text-on-primary: #FFFFFF; /* 4.5:1+ on primary-500 */
  --text-link: var(--color-primary-600);
  --text-link-hover: var(--color-primary-700);

  /* Border Colors */
  --border-subtle: var(--color-neutral-200);
  --border-default: var(--color-neutral-300);
  --border-strong: var(--color-neutral-400);
  --border-interactive: var(--color-primary-500);

  /* Interactive States */
  --interactive-primary: var(--color-primary-500);
  --interactive-primary-hover: var(--color-primary-600);
  --interactive-primary-active: var(--color-primary-700);
  --interactive-primary-disabled: var(--color-neutral-300);

  /* Focus State - 3:1 contrast minimum */
  --focus-ring: var(--color-primary-500);
  --focus-ring-offset: 2px;
  --focus-ring-width: 2px;
}

/* Dark Theme - Invert appropriately */
[data-theme="dark"] {
  --surface-primary: var(--color-neutral-950);
  --surface-secondary: var(--color-neutral-900);
  --surface-tertiary: var(--color-neutral-800);
  --surface-elevated: var(--color-neutral-800);

  --text-primary: var(--color-neutral-50);
  --text-secondary: var(--color-neutral-300);
  --text-tertiary: var(--color-neutral-400);
  /* ... adjust all tokens */
}
```

### Step 2.2: Typography System

<typography_principles>
Typography is 95% of design. It must be:
1. Readable (optimal line length, line height, font size)
2. Accessible (minimum sizes, sufficient contrast, scalable)
3. Hierarchical (clear visual distinction between levels)
4. Performant (optimized font loading, FOUT/FOIT strategies)
5. Responsive (fluid scaling, not just breakpoint jumps)
</typography_principles>

<think>
For this [DOMAIN] system:
1. What is the reading context? (Scanning vs deep reading)
2. What tone do fonts need to convey? (Professional, friendly, modern, classic)
3. What languages need support? (Latin, CJK, RTL languages)
4. What font pairing creates harmony and hierarchy?
5. How do we optimize performance? (Variable fonts, subset, swap strategy)
</think>

```css
/* Typography Tokens */

/* Font Families */
:root {
  /* System font stack for performance, or custom fonts for brand */
  --font-family-sans:
    /* Consider:
       - Inter (neutral, excellent readability)
       - Geist (modern, tech-forward)
       - Public Sans (open-source, professional)
       - System stack for performance
    */
    'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --font-family-serif:
    /* For editorial content or traditional brands */
    'Lora', Georgia, 'Times New Roman', serif;

  --font-family-mono:
    /* For code, technical content */
    'JetBrains Mono', 'Fira Code', Consolas, monospace;

  --font-family-display:
    /* For headlines, hero sections - can be more distinctive */
    var(--font-family-sans); /* or a display-specific font */
}

/* Type Scale - Using fluid typography with clamp() */
:root {
  /* Base size - 16px default, scales up on larger screens */
  --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);

  /* Scale ratio: 1.250 (major third) for moderate hierarchy
                  1.333 (perfect fourth) for stronger hierarchy
                  1.414 (augmented fourth) for dramatic hierarchy */
  --scale-ratio: 1.250;

  /* Type Scale */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.15vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.825rem + 0.2vw, 1rem);
  --font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1.05rem + 0.3vw, 1.375rem);
  --font-size-xl: clamp(1.25rem, 1.15rem + 0.4vw, 1.625rem);
  --font-size-2xl: clamp(1.5rem, 1.35rem + 0.6vw, 2rem);
  --font-size-3xl: clamp(1.875rem, 1.65rem + 0.9vw, 2.5rem);
  --font-size-4xl: clamp(2.25rem, 1.95rem + 1.2vw, 3.125rem);
  --font-size-5xl: clamp(3rem, 2.5rem + 2vw, 4.5rem);
}

/* Font Weights - Use semantic names */
:root {
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

/* Line Heights - Context-dependent */
:root {
  --line-height-tight: 1.25;   /* Headings */
  --line-height-snug: 1.375;   /* Short text blocks */
  --line-height-normal: 1.5;   /* Body text - WCAG recommends 1.5+ */
  --line-height-relaxed: 1.625; /* Long-form content */
  --line-height-loose: 2;      /* Poetry, emphasized spacing */
}

/* Letter Spacing */
:root {
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;
}

/* Measure (line length) - 45-75 characters is optimal */
:root {
  --measure-narrow: 45ch;
  --measure-default: 65ch;
  --measure-wide: 75ch;
}
```

**Typography Composition Tokens:**
```css
/* Heading Styles */
.heading-1 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--text-primary);
}

.heading-2 {
  font-family: var(--font-family-display);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--text-primary);
}

/* ... h3 through h6 */

/* Body Text */
.body-large {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
  color: var(--text-primary);
  max-width: var(--measure-default);
}

.body {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--text-primary);
  max-width: var(--measure-default);
}

.body-small {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--text-secondary);
}

/* UI Text */
.label {
  font-family: var(--font-family-sans);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  letter-spacing: var(--letter-spacing-wide);
  text-transform: uppercase;
  color: var(--text-secondary);
}
```

### Step 2.3: Spacing System

<spacing_philosophy>
Consistent spacing creates visual rhythm and hierarchy. Use a mathematical scale that:
1. Provides enough granularity for precise adjustments
2. Maintains harmonic relationships between values
3. Scales predictably
4. Aligns with an 8px or 4px baseline grid
</spacing_philosophy>

```css
/* Spacing Scale - 4px base unit */
:root {
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;  /* 2px */
  --space-1: 0.25rem;     /* 4px */
  --space-1-5: 0.375rem;  /* 6px */
  --space-2: 0.5rem;      /* 8px */
  --space-2-5: 0.625rem;  /* 10px */
  --space-3: 0.75rem;     /* 12px */
  --space-3-5: 0.875rem;  /* 14px */
  --space-4: 1rem;        /* 16px */
  --space-5: 1.25rem;     /* 20px */
  --space-6: 1.5rem;      /* 24px */
  --space-7: 1.75rem;     /* 28px */
  --space-8: 2rem;        /* 32px */
  --space-9: 2.25rem;     /* 36px */
  --space-10: 2.5rem;     /* 40px */
  --space-11: 2.75rem;    /* 44px */
  --space-12: 3rem;       /* 48px */
  --space-14: 3.5rem;     /* 56px */
  --space-16: 4rem;       /* 64px */
  --space-20: 5rem;       /* 80px */
  --space-24: 6rem;       /* 96px */
  --space-28: 7rem;       /* 112px */
  --space-32: 8rem;       /* 128px */
  --space-36: 9rem;       /* 144px */
  --space-40: 10rem;      /* 160px */
  --space-44: 11rem;      /* 176px */
  --space-48: 12rem;      /* 192px */
  --space-52: 13rem;      /* 208px */
  --space-56: 14rem;      /* 224px */
  --space-60: 15rem;      /* 240px */
  --space-64: 16rem;      /* 256px */
  --space-72: 18rem;      /* 288px */
  --space-80: 20rem;      /* 320px */
  --space-96: 24rem;      /* 384px */
}

/* Semantic Spacing */
:root {
  /* Component Internal Spacing */
  --spacing-component-xs: var(--space-1);
  --spacing-component-sm: var(--space-2);
  --spacing-component-md: var(--space-3);
  --spacing-component-lg: var(--space-4);
  --spacing-component-xl: var(--space-6);

  /* Layout Spacing */
  --spacing-section-sm: var(--space-12);
  --spacing-section-md: var(--space-16);
  --spacing-section-lg: var(--space-24);
  --spacing-section-xl: var(--space-32);

  /* Container Spacing */
  --spacing-container-padding-mobile: var(--space-4);
  --spacing-container-padding-tablet: var(--space-6);
  --spacing-container-padding-desktop: var(--space-8);
}
```

### Step 2.4: Elevation & Shadows

```css
/* Shadow System - Layered depth */
:root {
  /* Elevation levels for visual hierarchy */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

  /* Colored shadows for emphasis */
  --shadow-primary: 0 10px 15px -3px color-mix(in srgb, var(--color-primary-500) 30%, transparent);
}

/* Border Radius */
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-default: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-full: 9999px;
}
```

### Step 2.5: Animation & Motion

<motion_principles>
Motion should:
1. Be purposeful (guide attention, provide feedback, show relationships)
2. Respect prefers-reduced-motion
3. Use appropriate duration (100-300ms for micro-interactions, 300-600ms for transitions)
4. Use natural easing curves (not linear)
</motion_principles>

```css
/* Motion Tokens */
:root {
  /* Duration */
  --duration-instant: 100ms;
  --duration-fast: 200ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;

  /* Easing - use cubic-bezier for natural motion */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* Accessibility - Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Phase 3: Accessibility Foundation

<accessibility_mandate>
Accessibility is not optional. Every component must:
1. Be keyboard navigable (tab order, focus management)
2. Work with screen readers (ARIA labels, semantic HTML)
3. Meet WCAG [LEVEL] contrast requirements
4. Support text scaling up to 200%
5. Respect user preferences (reduced motion, high contrast, dark mode)
</accessibility_mandate>

### Step 3.1: Semantic HTML Requirements

<semantic_html_rules>
Use the correct HTML element for the job:

**DO:**
- `<button>` for actions (not `<div onclick>`)
- `<a>` for navigation (not `<span onclick>`)
- `<nav>` for navigation landmarks
- `<main>` for primary content
- `<article>` for independent content
- `<section>` for thematic grouping
- `<aside>` for tangential content
- `<header>` / `<footer>` for page/section structure
- `<h1>`-`<h6>` in hierarchical order (no skipping levels)
- `<ul>`/`<ol>` for lists
- `<form>` for forms
- `<label>` for form labels (with `for` attribute)
- `<input>` with proper `type` attribute
- `<table>` only for tabular data (with `<thead>`, `<tbody>`, `<th>`)

**DON'T:**
- Use `<div>` or `<span>` where semantic elements exist
- Make non-interactive elements clickable
- Skip heading levels (h1 → h3)
- Use tables for layout
- Use placeholder as label replacement
</semantic_html_rules>

### Step 3.2: Focus Management

```css
/* Focus Styles - WCAG 2.2 requires 3:1 contrast for focus indicators */

/* Remove default outline only if providing better alternative */
*:focus {
  outline: none;
}

*:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-default);
}

/* High contrast focus for dark backgrounds */
.dark-bg *:focus-visible {
  outline-color: var(--color-neutral-50);
}

/* Focus within for containers */
.form-group:focus-within {
  border-color: var(--border-interactive);
}
```

### Step 3.3: ARIA Patterns

<aria_guidelines>
Use ARIA to enhance semantics when HTML is insufficient:

**Common Patterns:**
- `role="button"` + `tabindex="0"` for custom buttons (but prefer `<button>`)
- `aria-label` for icon-only buttons
- `aria-labelledby` to reference existing text
- `aria-describedby` for additional context
- `aria-expanded` for collapsible content
- `aria-current="page"` for current navigation item
- `aria-live="polite"` for dynamic content announcements
- `aria-busy="true"` for loading states
- `aria-invalid="true"` for form validation
- `role="alert"` for important messages
- `aria-hidden="true"` for decorative elements (also hide from keyboard focus)

**Avoid:**
- Overusing ARIA when HTML is sufficient
- `role="presentation"` on focusable elements
- Conflicting roles and states
</aria_guidelines>

### Step 3.4: Progressive Enhancement Strategy

<progressive_enhancement>
Build in layers:

**Layer 1: HTML** (everyone gets this)
- Semantic, well-structured content
- Functional forms that submit to server
- Accessible navigation
- All content available

**Layer 2: CSS** (enhanced visual presentation)
- Layout and responsive design
- Color and typography
- Animations and transitions
- Print styles

**Layer 3: JavaScript** (enhanced interactions)
- Client-side validation
- Dynamic updates
- AJAX requests
- Rich interactions

Each layer enhances the previous without breaking core functionality.
Test with:
- JavaScript disabled
- CSS disabled
- Screen reader
- Keyboard only
- Slow network
</progressive_enhancement>

### Step 3.5: Responsive & Inclusive Design

```css
/* Breakpoint System */
:root {
  --breakpoint-xs: 375px;   /* Mobile small */
  --breakpoint-sm: 640px;   /* Mobile large */
  --breakpoint-md: 768px;   /* Tablet */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Desktop large */
  --breakpoint-2xl: 1536px; /* Desktop XL */
}

/* Container System */
.container {
  width: 100%;
  max-width: var(--breakpoint-2xl);
  margin-inline: auto;
  padding-inline: var(--spacing-container-padding-mobile);
}

@media (min-width: 768px) {
  .container {
    padding-inline: var(--spacing-container-padding-tablet);
  }
}

@media (min-width: 1024px) {
  .container {
    padding-inline: var(--spacing-container-padding-desktop);
  }
}

/* Text Scaling Support - Must work at 200% zoom */
html {
  font-size: 100%; /* Respect user's browser settings */
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --border-default: var(--border-strong);
    --focus-ring-width: 3px;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    /* Apply dark theme tokens if user hasn't set preference */
  }
}
```

---

## Phase 4: Component Library Design

<component_philosophy>
Components must be:
1. **Composable**: Small, single-purpose building blocks
2. **Consistent**: Follow established patterns
3. **Accessible**: WCAG compliant out of the box
4. **Flexible**: Configurable via props/variants
5. **Documented**: Clear usage guidelines and examples
</component_philosophy>

### Step 4.1: Core Components to Include

<thinking>
Based on the domain and use case, determine which components are essential.

**Universal Components (Almost every system needs these):**
- Button (primary, secondary, tertiary, ghost, danger variants)
- Input (text, email, password, number, search, etc.)
- Textarea
- Select / Dropdown
- Checkbox
- Radio
- Toggle / Switch
- Label
- Form Group / Field
- Card
- Modal / Dialog
- Tooltip
- Badge
- Avatar
- Icon
- Link
- Divider

**Layout Components:**
- Container
- Grid
- Stack (vertical/horizontal spacing)
- Flex
- Spacer

**Navigation Components:**
- Navigation Bar
- Breadcrumb
- Tabs
- Pagination
- Steps / Stepper

**Feedback Components:**
- Alert / Banner
- Toast / Notification
- Progress Bar
- Spinner / Loader
- Skeleton

**Data Display:**
- Table
- List
- Description List
- Stat / Metric
- Timeline

**Domain-Specific Components:**
Think about the specific domain. For example:
- E-commerce: Product Card, Price Display, Rating, Cart, Checkout Steps
- SaaS: Dashboard Card, Metric Widget, Data Visualization, Command Palette
- Content: Article Card, Author Bio, Comment, Gallery
- Finance: Account Summary, Transaction Row, Chart Widget
</thinking>

### Step 4.2: Component Patterns & Best Practices

**Button Component Example:**

```typescript
// Button Types
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}
```

```css
/* Button Styles */
.btn {
  /* Base styles - always applied */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-snug);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
  white-space: nowrap;
  user-select: none;

  /* Accessibility */
  &:focus-visible {
    outline: var(--focus-ring-width) solid var(--focus-ring);
    outline-offset: var(--focus-ring-offset);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

/* Size Variants */
.btn--sm {
  font-size: var(--font-size-sm);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  min-height: 32px;
}

.btn--md {
  font-size: var(--font-size-base);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  min-height: 40px;
}

.btn--lg {
  font-size: var(--font-size-lg);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-lg);
  min-height: 48px;
}

/* Color Variants */
.btn--primary {
  background: var(--interactive-primary);
  color: var(--text-on-primary);

  &:hover:not(:disabled) {
    background: var(--interactive-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:active:not(:disabled) {
    background: var(--interactive-primary-active);
    transform: translateY(0);
  }
}

.btn--secondary {
  background: transparent;
  color: var(--interactive-primary);
  border-color: var(--interactive-primary);

  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--interactive-primary) 10%, transparent);
  }
}

.btn--ghost {
  background: transparent;
  color: var(--text-primary);

  &:hover:not(:disabled) {
    background: var(--surface-secondary);
  }
}

.btn--danger {
  background: var(--color-error-500);
  color: white;

  &:hover:not(:disabled) {
    background: var(--color-error-600);
  }
}

/* Loading State */
.btn--loading {
  color: transparent;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin var(--duration-slow) linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### Step 4.3: Components to AVOID or Use Cautiously

<antipatterns>
**AVOID:**
1. **Carousels/Sliders** - Poor accessibility, low engagement, auto-play annoyance
   - Alternative: Grid of cards, show all content

2. **Mega Menus** - Overwhelming, difficult to navigate with keyboard
   - Alternative: Hierarchical navigation, search

3. **Modal Overload** - Breaking user flow, trapping focus incorrectly
   - Alternative: Inline expansion, separate pages for complex flows

4. **Infinite Scroll Without Pagination** - Impossible to reach footer, can't bookmark position
   - Alternative: Load more button, virtual scrolling with controls

5. **Custom Dropdowns That Don't Match Native** - Accessibility nightmares
   - Alternative: Enhanced `<select>` with careful ARIA

6. **Icon-Only Buttons Without Labels** - Unclear meaning
   - Alternative: Icon + text, or icon + aria-label + tooltip

7. **Captchas** - Exclude users with disabilities
   - Alternative: Honeypot fields, rate limiting, behavioral analysis

8. **Auto-Playing Video/Audio** - Annoying, accessibility issue
   - Alternative: User-initiated playback

9. **Popup Ads / Intrusive Overlays** - User experience killer
   - Alternative: Inline CTAs, value-first content

10. **Fixed Headers/Footers That Take >20% Screen** - Reduces usable space on mobile
    - Alternative: Hide on scroll, minimal fixed elements
</antipatterns>

---

## Phase 5: Layout System & Grid

<layout_principles>
1. Mobile-first responsive design
2. Content-driven breakpoints (not device-specific)
3. Flexible layouts that adapt to content
4. Consistent spacing and alignment
5. Clear visual hierarchy
</layout_principles>

### Step 5.1: Grid System

```css
/* CSS Grid System */
.grid {
  display: grid;
  gap: var(--space-6);

  /* Auto-fit creates responsive columns without media queries */
  &--auto-fit {
    grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
  }

  &--auto-fill {
    grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
  }
}

/* Explicit column counts */
.grid--cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid--cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid--cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid--cols-6 { grid-template-columns: repeat(6, 1fr); }
.grid--cols-12 { grid-template-columns: repeat(12, 1fr); }

/* Responsive grid modifiers */
@media (min-width: 640px) {
  .sm\\:grid--cols-2 { grid-template-columns: repeat(2, 1fr); }
  /* ... other breakpoints */
}

/* Gap Variations */
.grid--gap-sm { gap: var(--space-4); }
.grid--gap-md { gap: var(--space-6); }
.grid--gap-lg { gap: var(--space-8); }
```

### Step 5.2: Flexbox Utilities

```css
.flex {
  display: flex;

  &--row { flex-direction: row; }
  &--col { flex-direction: column; }
  &--wrap { flex-wrap: wrap; }

  &--justify-start { justify-content: flex-start; }
  &--justify-center { justify-content: center; }
  &--justify-end { justify-content: flex-end; }
  &--justify-between { justify-content: space-between; }

  &--items-start { align-items: flex-start; }
  &--items-center { align-items: center; }
  &--items-end { align-items: flex-end; }
  &--items-stretch { align-items: stretch; }

  &--gap-sm { gap: var(--space-4); }
  &--gap-md { gap: var(--space-6); }
  &--gap-lg { gap: var(--space-8); }
}
```

### Step 5.3: Page Layout Patterns

<layout_patterns>
Based on the domain, recommend specific layout patterns:

**Dashboard/SaaS:**
- Sidebar + Main Content
- Top Navigation + Content
- Multi-column adaptive layout

**E-commerce:**
- Grid-based product listings
- Detailed product page layout (images + details)
- Checkout flow (stepper + form)

**Content/Blog:**
- Article layout (centered content with max-width)
- Multi-column magazine layout
- Card grid for article listings

**Marketing:**
- Hero section patterns
- Feature sections (alternating layouts)
- Testimonial layouts
- CTA patterns
</layout_patterns>

---

## Phase 6: CSS Architecture Strategy

<think_superhard>
Based on the tech stack provided, recommend the optimal CSS architecture:

**Option 1: CSS Custom Properties + Utility Classes**
Pros:
- Maximum flexibility and control
- No build step required
- Great developer experience with modern CSS
- Easy to customize and extend
- Works with any framework
Cons:
- Need to build utilities yourself (or use a minimal library)
- More initial setup
Best for: Greenfield projects, teams wanting full control

**Option 2: Tailwind CSS**
Pros:
- Rapid development with utility classes
- Built-in design system
- Excellent documentation
- Large ecosystem
- PurgeCSS integration for small bundle
Cons:
- Learning curve for utility-first approach
- HTML can get verbose
- Customization requires Tailwind config
Best for: Teams familiar with utility-first, rapid prototyping

**Option 3: CSS-in-JS (Styled Components, Emotion)**
Pros:
- Component-scoped styles
- Dynamic styling based on props
- TypeScript integration
- No class name conflicts
Cons:
- Runtime cost (unless using zero-runtime like Linaria)
- Bundle size increase
- Requires build step
Best for: React/Vue applications, component libraries

**Option 4: CSS Modules**
Pros:
- Scoped styles without runtime cost
- Familiar CSS syntax
- Works with any framework
- TypeScript support available
Cons:
- Need build configuration
- Class composition can be verbose
Best for: Large applications, teams wanting scoped styles without runtime

**Option 5: Modern CSS with Layers (@layer)**
Pros:
- Native cascade control
- Perfect for design systems
- No tooling required
- Excellent specificity management
Cons:
- Newer feature (but well-supported)
- Less familiar to developers
Best for: Modern projects, design system authors

Recommend the best approach based on:
- Tech stack (React, Vue, etc.)
- Team familiarity
- Performance requirements
- Build complexity tolerance
</think_superhard>

---

## Phase 7: Implementation Guidelines

### Step 7.1: File Structure

```
design-system/
├── tokens/
│   ├── colors.css          # Color primitives and semantic tokens
│   ├── typography.css      # Font families, sizes, weights
│   ├── spacing.css         # Spacing scale
│   ├── shadows.css         # Elevation system
│   ├── motion.css          # Animation tokens
│   └── breakpoints.css     # Responsive breakpoints
├── foundations/
│   ├── reset.css           # CSS reset/normalize
│   ├── base.css            # Base element styles
│   ├── layout.css          # Grid, flex utilities
│   └── accessibility.css   # Focus styles, sr-only, etc.
├── components/
│   ├── button/
│   │   ├── button.css
│   │   ├── button.types.ts
│   │   └── button.stories.tsx
│   ├── input/
│   ├── card/
│   └── ... (other components)
├── utilities/
│   ├── spacing.css         # Margin, padding utilities
│   ├── typography.css      # Text utilities
│   └── display.css         # Display, visibility utilities
└── themes/
    ├── light.css
    ├── dark.css
    └── high-contrast.css
```

### Step 7.2: TypeScript Type Definitions

<think>
Generate comprehensive TypeScript types for the design system to ensure type safety.
</think>

```typescript
// tokens/colors.types.ts
export type ColorScale = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

export type ColorPrimitive = `--color-primary-${ColorScale}` | `--color-neutral-${ColorScale}` | `--color-success-${ColorScale}` | `--color-warning-${ColorScale}` | `--color-error-${ColorScale}` | `--color-info-${ColorScale}`;

export type SemanticColor =
  | '--surface-primary'
  | '--surface-secondary'
  | '--surface-tertiary'
  | '--text-primary'
  | '--text-secondary'
  | '--interactive-primary'
  | '--interactive-primary-hover'
  // ... all semantic tokens

// tokens/spacing.types.ts
export type SpacingScale =
  | 0 | 'px' | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8
  | 9 | 10 | 11 | 12 | 14 | 16 | 20 | 24 | 28 | 32 | 36 | 40 | 44 | 48
  | 52 | 56 | 60 | 64 | 72 | 80 | 96;

export type SpacingToken = `--space-${SpacingScale}`;

// tokens/typography.types.ts
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type FontWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
export type LineHeight = 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

// components/button.types.ts
export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  className?: string;
}

// Add types for all other components...
```

### Step 7.3: Documentation Structure

Create comprehensive documentation:

```markdown
# Design System Documentation

## Getting Started
- Installation
- Quick start guide
- Migration guide (if updating existing system)

## Design Tokens
- Color palette (with contrast ratios)
- Typography scale (with examples)
- Spacing system
- Elevation/shadows
- Motion/animation

## Components
For each component:
- Overview and usage guidelines
- Anatomy diagram
- Props/API reference
- Variants and examples
- Accessibility notes
- Do's and Don'ts
- Code examples

## Patterns
- Common UI patterns (forms, navigation, etc.)
- Layout patterns
- Responsive strategies

## Guidelines
- Accessibility guidelines
- Content guidelines
- Design principles
- Contribution guide
```

---

## Phase 8: Performance Optimization

<performance_principles>
1. Minimize CSS bundle size
2. Optimize critical rendering path
3. Use efficient selectors
4. Leverage browser caching
5. Lazy load non-critical styles
</performance_principles>

```css
/* Critical CSS Strategy */

/* 1. Inline critical CSS (above-the-fold) */
<style>
  /* Tokens, base, layout, critical components */
</style>

/* 2. Preload fonts */
<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>

/* 3. Load remaining styles */
<link rel="stylesheet" href="/styles/design-system.css">

/* 4. Lazy load heavy features */
<link rel="stylesheet" href="/styles/data-viz.css" media="print" onload="this.media='all'">
```

**Font Loading Strategy:**
```css
/* Use font-display: swap for custom fonts */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap; /* Show fallback immediately, swap when custom font loads */
  font-style: normal;
}

/* Define fallback metrics to reduce layout shift */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  size-adjust: 106.5%;
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
}
```

---

## Phase 9: Testing & Quality Assurance

<testing_checklist>
Test every component and pattern:

**Visual Regression Testing:**
- Screenshot comparison across browsers
- Responsive layout checks
- Theme switching (light/dark)

**Accessibility Testing:**
- Automated: axe-core, Lighthouse, WAVE
- Manual: Keyboard navigation, screen reader testing
- Color contrast verification
- Text scaling to 200%
- High contrast mode

**Cross-Browser Testing:**
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Android)
- Check for CSS feature support

**Performance Testing:**
- Bundle size analysis
- First Contentful Paint
- Largest Contentful Paint
- Cumulative Layout Shift
- Time to Interactive

**Usability Testing:**
- User testing with target audience
- Heatmaps and analytics
- A/B testing variants
</testing_checklist>

---

## Final Output Structure

<output_directive>
Based on the user's preference (Full Implementation, Guidelines + Snippets, or Both), generate:

### If Full Implementation:
1. **Complete file structure** with all CSS files
2. **TypeScript type definitions** for all components
3. **Component implementations** (React/Vue/etc. as specified)
4. **Documentation site** structure or Storybook stories
5. **Configuration files** (Tailwind config, build config, etc.)
6. **Package.json** with dependencies
7. **README** with setup instructions

### If Guidelines + Snippets:
1. **Comprehensive design system documentation**
2. **Color palette** with hex values and usage guidelines
3. **Typography system** with font recommendations and scale
4. **Component library spec** with guidelines, not full implementations
5. **Key code snippets** for complex patterns
6. **Accessibility checklist**
7. **Implementation roadmap**

### If Both:
Provide both outputs above.
</output_directive>

---

## Summary and Presentation

<final_synthesis>
After completing all phases, present the design system with:

1. **Executive Summary**
   - Design philosophy and principles
   - Key differentiators from generic systems
   - How it serves the specific domain

2. **Quick Reference**
   - Color palette swatch
   - Typography scale visual
   - Component library overview

3. **Implementation Guide**
   - Step-by-step setup
   - Integration examples
   - Migration path (if applicable)

4. **Design Tokens Reference**
   - Complete token listing
   - Usage examples
   - Customization guide

5. **Component Catalog**
   - Visual examples
   - Code snippets
   - Accessibility notes

6. **Best Practices**
   - Patterns to follow
   - Antipatterns to avoid
   - Performance tips

7. **Resources**
   - Further reading
   - Tool recommendations
   - Community links
</final_synthesis>

---

## Thinking Framework

Throughout this process, use this thinking framework:

```xml
<think>
For each decision, ask:
- Does this serve the user's needs?
- Is this accessible to all users?
- Does this follow established best practices?
- Is this maintainable and scalable?
- How does this compare to award-winning examples?
</think>

<think_superhard>
For critical decisions (colors, typography, architecture):
- Research multiple options
- Analyze trade-offs rigorously
- Consider long-term implications
- Validate against domain-specific requirements
- Ensure no mediocre compromises
</think_superhard>
```

---

## Ready to Begin

Now execute all phases systematically:
1. Gather requirements through questions
2. Research domain-specific design excellence
3. Generate comprehensive design tokens
4. Define component library
5. Create accessibility foundation
6. Establish CSS architecture
7. Provide implementation artifacts
8. Document everything thoroughly

Remember: **No mediocre choices. Every decision must be exceptional and intentional.**
