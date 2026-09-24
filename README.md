# sharishsk20.github.io

Personal portfolio site for Sharish SK - CS undergrad at SRM Institute of Science
and Technology, working on secure data pipelines, containerized ML deployments,
and hardware-integrated full-stack systems.

Live at **[sharishsk20.github.io](https://sharishsk20.github.io)**.

## Stack

- React 19 + TypeScript
- Vite 6
- Tailwind CSS 4 (via `@tailwindcss/vite`, no PostCSS config)
- GSAP + ScrollTrigger for scroll-driven animation
- Lenis for smooth scrolling
- lucide-react for icons

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build into dist/
npm run preview  # serve the built output
npm run lint     # tsc --noEmit
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the site
and publishes `dist/` to GitHub Pages. No manual deploy step is needed.

## Layout

```
src/
  App.tsx      single-page layout: hero, about, experience, skills, projects, contact
  main.tsx     React entry point
  index.css    Tailwind theme tokens, custom cursor, scrollbars
public/
  favicon.png
```

Project and experience copy is drafted in
`# Sharish SK - Portfolio Content Databas.md` and hand-written into `App.tsx`.
