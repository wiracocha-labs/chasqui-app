---
name: ux-best-practices
description: >
  Apply this skill whenever the user asks to design, evaluate, improve, or critique
  a user interface or user experience. Triggers include: "improve the UX", "is this
  good UX?", "how should I design this flow?", "review my UI", "make this more
  user-friendly", "design a form/modal/onboarding/dashboard", or any request that
  involves interaction design, information architecture, usability, or accessibility.
  Combine with the frontend-design skill when implementation is also required.
license: MIT
---

# UX Best Practices Skill

This skill guides the creation and evaluation of user experiences that are clear,
accessible, efficient, and delightful. Apply these principles before designing or
critiquing any interface.

---

## 1. Understand the User First

Before any design decision, establish:

- **Who** is the user? (technical level, age range, context of use)
- **What** are they trying to accomplish? (primary task, secondary tasks)
- **Where** are they? (mobile/desktop, noisy environment, time pressure)
- **Why** might they fail? (friction points, cognitive load, confusion)

Never design for yourself. Always design for the user's mental model, not the
system's internal model.

---

## 2. Hierarchy and Visual Clarity

- Establish a clear **visual hierarchy**: one dominant element per screen, then
  secondary, then tertiary. Users scan in F or Z patterns — design accordingly.
- Use **size, weight, color, and spacing** to communicate importance, not decoration.
- Limit the number of typefaces to 2 and the number of primary colors to 3.
- Ensure **sufficient contrast**: text must meet WCAG AA (4.5:1 for body text,
  3:1 for large text). Use a contrast checker.
- Whitespace is not empty space — it's breathing room that reduces cognitive load.

---

## 3. Affordance and Clarity

- Every interactive element must **look interactive**: buttons should look like
  buttons, links like links. Never make users guess what is clickable.
- Use **familiar patterns** (conventions) unless there's a compelling reason not to.
  Users bring expectations from other products — fighting them costs trust.
- Labels should describe **outcomes, not actions**: "Save changes" beats "Submit".
  "Delete account" beats "Confirm".
- Avoid jargon, acronyms, or system-oriented language. Speak the user's language.

---

## 4. Feedback and System Status

- The system must always communicate what is happening:
  - **Immediate feedback** (< 100ms): cursor change, button press state.
  - **Short operations** (100ms–1s): animated spinner or progress indicator.
  - **Long operations** (> 1s): progress bar with estimated time or steps.
- Confirm successful actions explicitly ("Changes saved ✓").
- Show errors close to where they occurred, not only at the top of the page.
- Error messages must explain **what went wrong** and **how to fix it**.
  Never say "An error occurred." Say "Your email is already registered —
  try logging in instead."

---

## 5. Forms and Input Design

- Show only the fields that are strictly necessary. Every extra field reduces
  completion rates.
- Use **inline validation**: validate each field when the user leaves it, not
  only on submit.
- Label fields **above** the input, never inside (placeholder text disappears
  on focus and is not a substitute for a label).
- Group related fields visually and logically.
- Set appropriate input types (`email`, `tel`, `number`, `date`) to trigger the
  correct mobile keyboard.
- Provide **smart defaults** wherever possible to reduce required effort.
- For long forms, show progress ("Step 2 of 4") and allow saving state.

---

## 6. Navigation and Information Architecture

- Users should always know: **where they are**, **where they can go**, and
  **how to get back**.
- Keep primary navigation to 5–7 items maximum (Miller's Law).
- Use **breadcrumbs** for deep hierarchies.
- Search should be prominent if content is large or varied.
- The most important actions should require the fewest clicks. Aim for a
  maximum of 3 clicks to reach any key destination.
- Avoid nested dropdowns deeper than 2 levels.

---

## 7. Cognitive Load Reduction

- **Progressive disclosure**: show only what the user needs right now.
  Reveal advanced options on demand.
- Chunk information into groups of 3–5 items.
- Use **recognition over recall**: show options rather than requiring users
  to remember them (dropdowns over free text, autocomplete over blank fields).
- Avoid modal dialogs unless absolutely necessary. Prefer inline editing,
  drawers, or contextual panels.
- Break complex tasks into **short, sequential steps** (wizard pattern) rather
  than presenting everything at once.

---

## 8. Accessibility (a11y)

Accessibility is not optional — it improves usability for everyone.

- All interactive elements must be **keyboard navigable** (Tab, Enter, Space,
  arrow keys).
- Provide **focus indicators** that are clearly visible (don't remove outline
  without a replacement).
- Use **semantic HTML**: `<button>` for buttons, `<nav>` for navigation,
  `<main>` for content, `<label>` for form labels.
- All images need descriptive `alt` text. Decorative images use `alt=""`.
- Don't rely on color alone to convey meaning — pair with icons or text.
- Support **screen readers**: use ARIA roles and labels where native HTML
  is insufficient.
- Touch targets on mobile must be at least **44×44px**.
- Avoid autoplay audio or video; provide captions for any media.
- Respect user preferences: `prefers-reduced-motion`, `prefers-color-scheme`.

---

## 9. Mobile and Responsive Design

- Design **mobile-first**: start with the smallest screen and expand.
- Thumbs navigate phones — place key actions in the **bottom half** of the screen.
- Avoid hover-only interactions; touch devices have no hover state.
- Use **fluid layouts** (%, vw, fr) instead of fixed pixel widths.
- Minimum readable font size: 16px on mobile.
- Avoid horizontal scrolling on any breakpoint.

---

## 10. Performance as UX

- Slow interfaces are bad UX. Target:
  - First Contentful Paint < 1.8s
  - Time to Interactive < 3.8s
- Use skeleton screens instead of spinners for content loading — they reduce
  perceived wait time.
- Lazy load images and off-screen content.
- Avoid layout shifts (CLS) — reserve space for images and ads before they load.

---

## 11. Empty States and Edge Cases

Design for **all states**, not just the happy path:

| State | Guidance |
|---|---|
| Empty | Explain why it's empty and offer a clear next action |
| Loading | Skeleton screens or meaningful spinners |
| Error | Friendly message + actionable recovery step |
| Success | Confirmation + next logical step |
| Partial data | Handle missing fields gracefully, never crash |

---

## 12. Onboarding and First-Time Experience

- Show value **before** asking for commitment (account creation, payment).
- Minimize required fields at signup — ask for more data later (progressive profiling).
- Use **contextual tooltips** and empty state guidance rather than up-front tutorials.
- The first action a user takes should produce a quick win.
- Avoid long welcome modals or carousels — users skip them.

---

## 13. Destructive Actions

- Destructive actions (delete, cancel, deactivate) must require **confirmation**.
- Make the destructive button visually distinct (typically red) but not the default.
- Consider **undo** instead of confirmation dialogs — it's faster and less disruptive
  (Gmail's "Undo send" pattern).
- Never make it easy to accidentally trigger a destructive action.

---

## 14. Microcopy and Content

- Button labels: use verb + noun ("Upload photo", "Send message").
- Avoid "Click here" — it's meaningless out of context.
- Write in **active voice** and second person ("You have 3 messages").
- Microcopy in error messages, tooltips, and placeholders matters as much as
  headlines — write it carefully.
- Keep instructional copy **adjacent** to the element it describes.

---

## 15. Evaluation Heuristics (Nielsen's 10)

Use these to audit any existing interface:

1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

---

## Quick Checklist Before Shipping

- [ ] Does the user immediately understand what this screen is for?
- [ ] Is the primary action obvious?
- [ ] Are all interactive elements clearly identifiable?
- [ ] Have I handled loading, empty, and error states?
- [ ] Is it usable with keyboard only?
- [ ] Does it pass color contrast checks?
- [ ] Is it tested on mobile?
- [ ] Are error messages actionable?
- [ ] Have I removed every unnecessary element?
- [ ] Does it feel fast?
