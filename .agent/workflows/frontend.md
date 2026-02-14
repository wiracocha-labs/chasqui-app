---
description: How to work only on UI/UX without Web3 backend
---

# Frontend-Only Workflow

Use this workflow when you only need to modify styles, components, or layout.

1. **Start Vite**
   ```bash
   npm run dev
   ```

2. **Ignore Web3 Errors**
   The console might show `Web3Error` or connection failures (MetaMask/Provider). You can safely ignore these if you are only working on:
   - CSS/Tailwind tweaks.
   - Component structure.
   - Animations.
   - Static pages.

3. **Development Loop**
   - Make changes in `frontend/src/`.
   - View HMR (Hot Module Replacement) updates in the browser.

> [!NOTE]
> If a component depends on data from the contract, consider adding temporary mock data in the component or store to facilitate UI development.
