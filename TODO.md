# TODO — Cybersecurity Portfolio

> Continue from here in the new conversation. Start with: *"Read CONTEXT.md and TODO.md, then continue"*

---

## Phase 1: Fix Environment (BLOCKING — DO FIRST)

- [ ] **Move project out of OneDrive** — Copy entire `Portfolio` folder from `C:\Users\asus\OneDrive\Documents\` to `C:\Dev\Portfolio`
- [ ] **Fix pnpm workspace**: Delete `pnpm-workspace.yaml` if it exists with broken `allowBuilds:` syntax, then run `pnpm install`
- [ ] **Verify `pnpm dev`** starts without errors and site loads at `http://localhost:3000`

---

## Phase 2: Verify Build & Fix Errors

- [ ] Run `pnpm build` — fix any TypeScript or import errors
- [ ] Run `pnpm dev` — open `http://localhost:3000` and verify all sections render
- [ ] Check browser console for React/Three.js runtime errors
- [ ] Verify the 3D shield renders in the hero section (may need to tweak camera position or geometry)

---

## Phase 3: Accessibility Audit (IMPORTANT)

- [ ] Run Lighthouse audit in Chrome DevTools → target **95+ Accessibility score**
- [ ] Install & run axe DevTools browser extension → fix any violations
- [ ] Verify color contrast with WebAIM contrast checker:
  - Body text on background must be ≥ 4.5:1 ✓ (white on near-black is ~19:1)
  - Purple on dark: only for decorative/large elements (badges, icons, borders)
- [ ] Tab through ALL interactive elements — verify visible focus rings on every element
- [ ] Test with screen reader (Windows Narrator or NVDA): headings hierarchy, form labels, aria-labels
- [ ] Test `prefers-reduced-motion: reduce` — animations should stop, shield should stop rotating

---

## Phase 4: Responsive Testing

- [ ] Test at 375px (mobile) — hamburger menu works, sections stack correctly
- [ ] Test at 768px (tablet) — grid layouts display correctly
- [ ] Test at 1280px+ (desktop) — full layout with 3D shield
- [ ] Verify 3D shield canvas resizes correctly across breakpoints

---

## Phase 5: Content (User fills in real data)

- [ ] Replace placeholder name/description in `app/layout.tsx` metadata
- [ ] Replace placeholder bio in `components/sections/about.tsx`
- [ ] Replace placeholder skills in `components/sections/skills.tsx`
- [ ] Replace placeholder projects in `components/sections/projects.tsx`
- [ ] Replace placeholder blog posts in `components/sections/blog.tsx`
- [ ] Update social links (GitHub, LinkedIn, Twitter, Email) in `components/layout/footer.tsx`
- [ ] Replace contact email address in `components/sections/contact.tsx`

---

## Phase 6: Polish (Optional/Nice-to-Have)

- [ ] Add custom favicon (replace `public/favicon.ico`)
- [ ] Add Open Graph image for social sharing previews
- [ ] Add `app/loading.tsx` for route loading states
- [ ] Add `app/error.tsx` for error boundaries
- [ ] Connect contact form to a real backend or service (e.g., Web3Forms, Formspree)
- [ ] Add analytics (Vercel Analytics, Plausible, etc.)
- [ ] Deploy to Vercel

---

## Known Gotchas

1. **pnpm workspace yaml corruption**: File may auto-regenerate with broken `allowBuilds:` lines. Delete it before any `pnpm add` command.
2. **OneDrive path**: If project stays in OneDrive, pause sync during development. Better: move to `C:\Dev\Portfolio`.
3. **shadcn interactive prompts**: `pnpm dlx shadcn@latest add <component>` may prompt for overwrite confirmation. Add `--overwrite` flag to skip.
4. **Three.js SSR**: The `rotating-shield.tsx` component is dynamically imported with `ssr: false` — this is intentional; Three.js cannot run on the server.
5. **PowerShell `&&` not supported**: Use `;` to chain commands instead of `&&` on Windows PowerShell.
