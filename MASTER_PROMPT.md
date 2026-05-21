# Master Prompt: Dario's Corner - Personal Domain Landing Page

## Project Vision

Build "Dario's Corner," a professional yet personable personal domain landing page that serves as a digital introduction to Dario's professional brand, expertise, and body of work. The site should balance sophisticated minimalism with approachable warmth, creating an inviting space for visitors to discover who Dario is, what he's passionate about, and how to connect with him.

---

## Design Philosophy & Aesthetic

### Core Principles

- **Minimalist Elegance**: Embrace whitespace and intentional design. Every element should serve a purpose; complexity should be implicit, not explicit.
- **Approachable Professionalism**: Convey expertise through clean design and clear communication, not visual complexity.
- **Personal Connection**: Create a warm, inviting atmosphere that reflects personality and authenticity.
- **Content-First**: Design serves content. Information hierarchy and readability are paramount.

### Brand Atmosphere

Create a **friendly, bright atmosphere** with warmth and accessibility. The design should feel modern and contemporary while maintaining timeless appeal. Avoid starkness; instead, cultivate a sense of welcome.

### Color Palette

| Color | Hex | Purpose | Usage |
|-------|-----|---------|-------|
| Rich Brown | #622B14 | Primary Brand Color | Headings, CTAs, Key Accents |
| Warm Brown | #995F2F | Secondary Accent | Hover states, Secondary Elements |
| Sage Taupe | #978F66 | Tertiary Neutral | Borders, Dividers, Subtle Accents |
| Warm Cream | #E4D6A9 | Highlight/Background | Callout backgrounds, Light overlays |

**Color Application Strategy**:
- Use Rich Brown (#622B14) as the primary brand color for main CTAs and key visual indicators
- Apply Warm Brown (#995F2F) for interactive hover states and secondary calls-to-action
- Employ Sage Taupe (#978F66) for supporting elements, borders, and typography hierarchy
- Reserve Warm Cream (#E4D6A9) for highlighting important content blocks and creating visual breathing room

### Typography

- **Font Family**: Matter (primary typeface for entire site)
- **Hierarchy**: Establish clear visual hierarchy through size, weight, and spacing, not multiple typefaces
- **Readability**: Ensure minimum 16px body font size for optimal readability on all devices
- **Line Height**: Maintain 1.6–1.8 line height for extended text; 1.4 for headings

---

## Technical Stack

- **Framework**: Next.js (React framework with server-side rendering for optimal performance and SEO)
- **UI Component Library**: Shadcn UI (accessible, unstyled components built on Radix UI)
- **Styling**: Tailwind CSS (utility-first CSS for rapid, consistent styling)
- **Language**: TypeScript (type safety, improved developer experience, and maintainability)
- **Architecture**: Component-based, modular design with reusable, composable UI elements

---

## Page Structure & Sections

### 1. **Header/Navigation**
- Clean, minimal header with site logo or name
- Simple, intuitive navigation menu (links to sections or pages)
- Responsive design: hamburger menu or mobile-optimized navigation on smaller screens
- Navigation sticky or semi-sticky for easy access without disrupting content
- Subtle background or shadow to define section separation

### 2. **Hero Section**
- Large, welcoming headline introducing Dario's Corner
- Compelling subheading or tagline
- Optional: Hero image or subtle visual element
- Primary CTA button (e.g., "Explore My Work" or "Learn More")
- Spacious layout with excellent typography

### 3. **Bio Section**
- Profile image (circular or square with subtle border or shadow)
- Engaging bio text (2–3 paragraphs) highlighting interests, expertise, and professional focus
- Social media links (icons linking to LinkedIn, GitHub, Twitter, etc.)
- **CTA Link**: Prominent link to full portfolio and blog

### 4. **Tech Stack Showcase**
- **Animated Moving Icons**: Display technologies and tools used in projects
- **Implementation**: Smooth horizontal scroll or carousel with hero icons
- **Visual Style**: Clean, recognizable tech logos/icons
- **Animation**: Subtle continuous motion (fade in/out, gentle bounce, or carousel rotation)
- **Interactivity**: Optional hover effects to reveal tool names or descriptions

### 5. **Featured Projects/Work** 
- 2 featured projects or significant work
- Project cards with image, title, brief description, and link
- Consistent card design using Shadcn UI components
- **Call-to-Action**: Link to full portfolio

### 6. **Contact Section**
- Clear, accessible contact information
- Multiple contact methods (email, contact form, social links)
- Optional: Subscribe to newsletter or mailing list
- Professional, inviting tone encouraging connection

### 7. **Footer**
- Copyright and year
- Links to privacy policy, terms of service (if applicable)
- Social media icons
- Quick links to main sections
- Light background distinguishing footer from main content

---

## Design & Implementation Standards

### Layout & Spacing

- **Desktop**: Max-width of 1200–1280px for main container
- **Padding**: Consistent horizontal padding (20–40px on desktop, 16–20px on mobile)
- **Vertical Spacing**: Use 16px, 24px, 32px, 48px increments for consistent rhythm
- **Mobile First**: Design for mobile, then enhance for larger screens

### Component Standards

- **Use Shadcn UI components** extensively for consistency and accessibility:
  - Buttons for all CTAs
  - Card layouts for project/content sections
  - Dialog/modals for forms or additional information
  - Navigation components for menu
  - Separator for visual breaks
- **Consistency**: All buttons, links, and interactive elements follow the same visual and interaction patterns
- **Accessibility**: All components meet WCAG 2.1 AA standards

### Interactive Elements

- **Hover States**: Subtle color shifts and smooth transitions (200–300ms)
- **Focus States**: Clear focus indicators for keyboard navigation
- **Animations**: Smooth, purposeful transitions; avoid excessive or distracting animations
- **Tech Stack Icons**: Implement smooth horizontal scroll or carousel; icons animate continuously with gentle, constant motion

### Responsiveness

- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px – 1024px
  - Desktop: > 1024px
- **Fluid Typography**: Scale text smoothly across screen sizes
- **Touch-Friendly**: Buttons and links minimum 44px × 44px tap targets on mobile
- **Image Optimization**: Responsive images using `next/image` for automatic optimization

---

## Performance & Technical Requirements

### Optimization

- **Image Optimization**: Use Next.js `Image` component with WebP format and lazy loading
- **Code Splitting**: Ensure components are modular and chunked efficiently
- **CSS Optimization**: Leverage Tailwind's PurgeCSS to eliminate unused styles
- **Font Loading**: Optimize font loading (Consider variable fonts or strategic font-display settings)

### SEO & Discovery

- **Meta Tags**: Comprehensive title, description, and Open Graph tags
- **Semantic HTML**: Proper heading hierarchy (h1 for main title, h2 for sections, etc.)
- **Schema Markup**: Implement JSON-LD for structured data (Person schema for bio section)
- **Sitemap**: Generate and include XML sitemap for search engines
- **Robots.txt**: Configure appropriately for search engine crawling
- **Mobile-Friendly**: Ensure full mobile responsiveness (Google Mobile-Friendly Test passing)

### Performance Metrics

- **Target Metrics**:
  - Lighthouse Performance Score: > 90
  - Cumulative Layout Shift (CLS): < 0.1
  - Largest Contentful Paint (LCP): < 2.5s
  - First Input Delay (FID): < 100ms
- **Bundle Size**: Keep initial JS bundle < 100kb (gzipped)
- **Time to Interactive (TTI)**: < 3.5s

---

## Content Guidelines

- **Authenticity**: Write in a genuine, personable voice that reflects Dario's personality
- **Clarity**: Use clear, concise language; avoid jargon unless discussing technical topics
- **Value-Focused**: Every section should communicate value to the visitor
- **Call-to-Action**: Each major section should have a clear next step or CTA
- **Professional Tone**: Maintain professionalism while being approachable

---

## Accessibility Requirements

- **WCAG 2.1 Level AA Compliance**: All interactive elements, text, and images meet accessibility standards
- **Keyboard Navigation**: Fully navigable with keyboard; visible focus indicators
- **Color Contrast**: Text meets minimum 4.5:1 contrast ratio for readability
- **Alt Text**: All images include descriptive alt text
- **Semantic HTML**: Proper use of heading hierarchy, landmarks, and ARIA labels where necessary
- **Testing**: Use axe DevTools or similar for automated accessibility testing

---

## Deliverables Checklist

- ✅ Header with navigation component
- ✅ Hero section with compelling headline and CTA
- ✅ Bio section with profile image and social links
- ✅ Animated tech stack showcase (hero icons with smooth motion)
- ✅ Featured projects/work section (with cards)
- ✅ Contact section with multiple contact methods
- ✅ Footer with links and social icons
- ✅ Full mobile responsiveness
- ✅ Image optimization and lazy loading
- ✅ SEO metadata and schema markup
- ✅ Lighthouse performance > 90
- ✅ WCAG 2.1 AA accessibility compliance
- ✅ Clean, modular TypeScript components
- ✅ Consistent use of Shadcn UI and Tailwind CSS
- ✅ Smooth animations and transitions (non-intrusive)

---

## Development Notes

- **Component Structure**: Create reusable, composable components in `/components` directory
- **UI Components**: Import all UI components from `/components/ui` (Shadcn UI)
- **Utilities**: Use helper functions from `/lib/utils.ts` for consistent styling
- **Configuration**: Utilize `tailwind.config.js` for design token definitions (colors, spacing, fonts)
- **Best Practices**: 
  - Avoid inline styles; use Tailwind utilities
  - Prefer composition over complex component props
  - Implement proper error boundaries and fallback UI
  - Use Next.js features (Image, Link, Head/metadata) for optimal performance
  - Implement proper TypeScript types for all props and state

---

## Vision Summary

The end result should be a **professional, elegant, and modern personal landing page** that instantly communicates Dario's expertise and approachability. Visitors should feel welcomed, find the information they seek effortlessly, and have clear pathways to explore his work, learn more about his interests, and connect with him. The design should feel contemporary yet timeless, visually refined yet warm—a true digital extension of a professional personal brand.
