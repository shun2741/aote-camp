# copilot-instructions.md

# GitHub Copilot / AI Coding Agent Instructions

## 1. Project Overview

This repository contains a static, mobile-first web app for annual trips with friends.

The app is intended to be published on GitHub Pages and viewed mainly from smartphones during or after a trip.

Primary use cases:

- View trip overview and schedule
- Check hotel information
- Review expenses and split payments
- Calculate mahjong settlement with uma / oka rules
- Keep yearly trip pages as an archive

The implementation may be done by Codex or another AI coding agent, but this file defines shared project rules for GitHub Copilot and similar coding assistants.

---

## 2. Important Source Documents

Before implementing or changing major features, refer to these documents if they exist in the repository:

- `requirements.md`
- `design.md`
- `copilot-instructions.md`

Priority order:

1. User's latest direct instruction
2. `requirements.md`
3. `design.md`
4. This file
5. Existing implementation patterns

Do not ignore `requirements.md` or `design.md` when implementing UI or business logic.

---

## 3. Recommended Tech Stack

Use the following stack unless the existing repository already uses another stack.

- Vite
- React
- TypeScript
- React Router
- GitHub Pages

For routing on GitHub Pages, prefer `HashRouter` unless the repository has a reliable SPA fallback setup.

Expected route examples:

```txt
/
#/trips/:tripId
#/trips/:tripId/schedule
#/trips/:tripId/hotel
#/trips/:tripId/expenses
#/trips/:tripId/mahjong
```

---

## 4. Core Product Requirements

The app must support:

- A top page with trip list
- A trip detail page
- Schedule page
- Hotel page
- Expenses and split payment page
- Mahjong settlement page
- Mobile-first responsive UI
- GitHub Pages deployment

The app is primarily read-only.

Editing trip data from the UI is not required for the MVP. Trip data should be edited by the developer in source files such as TypeScript or JSON.

---

## 5. Data Management Rules

Do not introduce a database for the MVP.

Trip data should be stored as static source data.

Recommended structure:

```txt
src/
  data/
    trips/
      2026-kagawa.ts
      2027-hokkaido.ts
    trips.ts
```

Use TypeScript types for trip data.

Recommended core types:

```ts
export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: "planning" | "completed";
  members: string[];
  summary?: string;
  schedule: ScheduleDay[];
  hotels: Hotel[];
  expenses: Expense[];
  mahjong?: MahjongData;
};
```

Do not include sensitive information in sample data, such as:

- Real reservation numbers
- Private phone numbers
- Detailed personal addresses
- Payment credentials
- Any secret keys

---

## 6. UI / Design Rules

Follow `design.md`.

The desired tone is:

**A cool, clean, sporty travel app for friends who play tennis and snowboard.**

Use:

- Dark navy
- Ice blue
- White
- Cool gray
- Mint accent

Avoid:

- Cute or overly pop design
- Excessive decoration
- Business-dashboard-like coldness
- Gambling-site-like mahjong design
- Unrelated anime or illustration-heavy style

The app should feel:

- Cool
- Active
- Clean
- Sporty
- Easy to read on smartphones

---

## 7. Mobile-First Rules

Smartphone display is the top priority.

Always check and design for:

- 360px to 430px width
- Large tap targets
- Cards instead of wide tables
- Readable text size
- Minimal horizontal scrolling
- Bottom navigation or clear page navigation

Tables may be used on desktop, but mobile views should use cards or stacked rows when necessary.

---

## 8. Component Rules

Prefer reusable components.

Suggested components:

```txt
AppShell
Header
BottomNavigation
HeroCard
StandardCard
SectionHeader
Button
Tag
TimelineItem
InfoRow
SettlementSummaryCard
TripCard
ExpenseCard
HotelCard
MahjongResultCard
```

Do not implement each page with completely separate styling. Shared components and design tokens should be used to maintain consistency.

---

## 9. Styling Rules

Use one consistent styling approach.

Acceptable options:

- CSS Modules
- Tailwind CSS
- plain CSS with design tokens
- styled-components

Do not mix multiple styling approaches unnecessarily.

Design values should be centralized.

Use or adapt the following token idea:

```ts
export const theme = {
  colors: {
    primary: "#10233F",
    primaryDark: "#0A172B",
    primaryLight: "#1E3B63",
    accent: "#4FC3F7",
    accentDark: "#1BA6E0",
    accentMint: "#66E3D3",
    background: "#F4F8FC",
    surface: "#FFFFFF",
    surfaceAlt: "#EAF1F8",
    text: "#142033",
    textSub: "#5C6B80",
    border: "#D7E0EA",
    success: "#19B36B",
    warning: "#F5A524",
    danger: "#E34D59",
    info: "#2F80ED",
  },
};
```

---

## 10. Split Payment Logic

The expense calculation must support:

- Expense title
- Amount
- Person who paid
- Participants who should share that expense
- Category
- Memo

Calculation flow:

1. Sum paid amount for each member
2. Sum burden amount for each member
3. Calculate balance as `paidAmount - burdenAmount`
4. Positive balance means the member should receive money
5. Negative balance means the member should pay money
6. Generate a minimal or reasonable payment instruction list

Example output:

```txt
Bさん → Aさん: 4,500円
Cさん → Dさん: 2,000円
```

Initial rounding should be 1 yen. Design the logic so 10 yen or 100 yen rounding can be added later.

---

## 11. Mahjong Settlement Logic

The mahjong page should support half-game results and calculate settlement.

Default rule:

```ts
const defaultMahjongRule = {
  rate: 0.5,
  uma: [20, 10, -10, -20],
  oka: 20,
  startPoint: 25000,
  returnPoint: 30000,
};
```

Interpretation:

- Default rate is 点5
- Uma is 1・2:
  - 1st: +20
  - 2nd: +10
  - 3rd: -10
  - 4th: -20
- Oka is enabled
- Start point: 25,000
- Return point: 30,000

Basic scoring formula:

```txt
baseScore = (finalPoint - returnPoint) / 1000
rankBonus = uma[rank - 1]
topBonus = oka if rank is 1st, otherwise 0
finalScore = baseScore + rankBonus + topBonus
yen = finalScore * 100 * rate
```

For 点5, `rate = 0.5`, so score 1.0 means 50 yen.

Make calculation functions pure and easy to test.

---

## 12. Code Quality Rules

Use TypeScript strictly.

Prefer:

- Pure functions for calculations
- Small components
- Clear type definitions
- Meaningful file names
- No unnecessary global state
- No hidden side effects in calculation logic

Avoid:

- `any` unless clearly justified
- Hardcoded duplicate data
- Large monolithic components
- Business logic embedded deeply inside JSX
- Unused dependencies
- Overengineering with backend/database/auth for MVP

---

## 13. Suggested Directory Structure

```txt
src/
  components/
    layout/
    cards/
    navigation/
    common/
  data/
    trips/
    trips.ts
  features/
    expenses/
      calculateExpenseSettlement.ts
      types.ts
    mahjong/
      calculateMahjongSettlement.ts
      types.ts
  pages/
    HomePage.tsx
    TripDetailPage.tsx
    SchedulePage.tsx
    HotelPage.tsx
    ExpensesPage.tsx
    MahjongPage.tsx
  routes/
  styles/
    theme.ts
    global.css
  utils/
```

This is a guideline, not a strict rule. Follow the existing structure if the repository is already implemented.

---

## 14. Testing Guidance

At minimum, add unit-testable pure functions for:

- Split payment calculation
- Mahjong score calculation
- Settlement instruction generation

If a test framework is not yet installed, keep functions simple enough to test later.

When adding tests, prefer:

- Vitest
- React Testing Library where UI tests are needed

---

## 15. GitHub Pages Guidance

The app must be deployable to GitHub Pages.

Be careful with:

- Vite `base` setting
- React Router behavior on page reload
- Static asset paths
- Build output directory
- GitHub Actions deployment workflow

Prefer `HashRouter` for simpler GitHub Pages compatibility.

---

## 16. Accessibility Rules

- Ensure sufficient color contrast
- Do not rely only on color to communicate state
- Provide text labels with icons
- Use semantic HTML where possible
- Ensure tap targets are large enough on mobile
- Keep Japanese text readable

---

## 17. Performance Rules

The app should remain lightweight.

Avoid:

- Heavy UI libraries unless needed
- Large images
- Unnecessary animation libraries
- Runtime calls to external APIs for MVP

Static local data is preferred.

---

## 18. Security / Privacy Rules

This app is published on GitHub Pages and can be viewed by anyone with the URL.

Do not include:

- Reservation numbers
- Private contact details
- API keys
- Secrets
- Payment information
- Highly specific personal information

Hotel data may include general location and Google Maps URL, but avoid overly sensitive private details.

---

## 19. Implementation Order Recommendation

When implementing from scratch, proceed in this order:

1. Project setup
2. Routing setup
3. Theme and global styles
4. Data types
5. Sample trip data
6. Shared layout components
7. Home page
8. Trip detail page
9. Schedule page
10. Hotel page
11. Expense calculation logic
12. Expenses page
13. Mahjong calculation logic
14. Mahjong page
15. Mobile polish
16. GitHub Pages deployment
17. README update

---

## 20. Definition of Done

The MVP is done when:

- The app builds successfully
- The app can be published on GitHub Pages
- Top page shows trip list
- Trip detail page links to all major pages
- Schedule is visible by day
- Hotel details are visible
- Expenses are displayed
- Split payment result is calculated
- Mahjong settlement is calculated with default 1・2 点5 rule
- UI is readable and comfortable on smartphones
- Design follows `design.md`
- No sensitive sample data is included

---

## 21. Final Reminder for AI Agents

Prioritize:

1. Correctness of calculations
2. Mobile readability
3. Consistent design
4. Simple maintainable code
5. GitHub Pages compatibility

Do not overbuild. This is a static travel app for friends, not a full SaaS product.
