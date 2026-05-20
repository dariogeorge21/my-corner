# Dario George — Domain Landing Page

> A modern, high‑performance domain landing page showcasing about Dario George, a full‑stack developer with a passion for clean code, exceptional user experiences, and cutting‑edge front‑end architecture.

## Overview
Built with Next.js 14 (App Router) and Framer Motion, the site leverages GPU‑accelerated animations to create a fluid, responsive experience that feels more like a physical interface than a traditional web page.

## ⚙️ Tech Stack

| Category          | Technologies                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| Framework         | Next.js 14 (App Router), React 18                                                                        |
| Language          | TypeScript                                                                                               |
| Styling           | Tailwind CSS, CSS Modules                                                                                |
| Animations        | Framer Motion (GPU‑accelerated), `useScroll`, `useTransform`, `useSpring`, `useVelocity`                 |
| Backend / Contact | Next.js API Routes, custom action handlers, Turnstile                                                    |
| Deployment        | Vercel (recommended)                                                                                     |
| Package Manager   | pnpm / npm / yarn                                                                                        |
| Linting / Format  | ESLint, Prettier                                                                                         |

> Additional libraries: `react-icons`, `lucide-react`, `next-themes`, `CircularText` (custom component), `LogoLoop` (custom marquee).

## 📁 Project Structure

```
├── app/
│   ├── (routes)/           # All page routes (App Router)
│   ├── actions/            # Server actions for contact form
│   └── globals.css         # Global styles and Tailwind directives
├── components/
│   ├── hero.tsx            # Hero section with MagicRings + VariableProximity
│   ├── bio.tsx             # Asymmetrical bio section
│   ├── tech-stack.tsx      # Dual‑marquee technology section
│   ├── services.tsx        # Interactive service index + floating portal
│   ├── contact.tsx         # Glass‑form contact section with tilt
│   ├── footer.tsx          # Magnetic‑link footer with architectural motifs
│   ├── LogoLoop.tsx        # High‑performance, GPU‑driven marquee
│   ├── MagicRings.tsx      # Animated background rings
│   ├── VariableProximity.tsx # 3D typography effect
│   └── CircularText.tsx    # Rotating text component
├── hooks/                  # Custom hooks (useScrollVelocity, etc.)
└── types/                  # TypeScript declarations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm (recommended) / npm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dariogeorge21/portfolio.git
cd portfolio

# Install dependencies
pnpm install
# or
npm install

# Run the development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🔧 Building for Production

```bash
pnpm build
pnpm start
```

## 🌍 Deployment

The project is optimized for deployment on **Vercel**:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdariogeorge21%2Fportfolio)

Alternatively, you can deploy to any platform that supports Next.js (Netlify, AWS, etc.).

## ⚡ Performance Optimizations

- **GPU‑Accelerated Motion** – All scroll/mouse tracking uses `useMotionValue` and `useSpring`, bypassing React state to avoid layout thrashing and maintain 60fps.
- **`will-change-transform`** – Applied to all animated elements to force GPU rasterization.
- **`prefers-reduced-motion`** – Graceful fallback to simple opacity fades.
- **Lazy Loading** – Heavy 3D components (`MagicRings`, `VariableProximity`) are conditionally mounted.
- **Image Optimization** – All images use Next.js `<Image>` component with lazy loading.

## ♿ Accessibility

- Keyboard navigation fully supported with visible `:focus-visible` outlines.
- Semantic HTML (sections, articles, lists) with proper ARIA labels.
- `useReducedMotion` hook disables all 3D and velocity‑based animations when requested.
- High color contrast in both light and dark themes.

## 📬 Contact & Socials

- **Email**: [edu.dariogeorge21@gmail.com](mailto:edu.dariogeorge21@gmail.com)
- **LinkedIn**: [linkedin.com/in/dariogeorge21](https://linkedin.com/in/dariogeorge21)
- **GitHub**: [github.com/dariogeorge21](https://github.com/dariogeorge21)
- **Instagram**: [instagram.com/dariogeorge21](https://instagram.com/dariogeorge21)

## 🙏 Acknowledgements

- **Framer Motion** – For the buttery‑smooth, physics‑driven animations.
- **Tailwind CSS** – For rapid, utility‑first styling.
- **Vercel** – For seamless deployment and hosting.
- **Lucide & React Icons** – For the beautiful icon sets.

## 📄 License

This project is open‑source and available under the [MIT License](LICENSE).

---

*Built with precision, motion, and an architectural mindset.*
