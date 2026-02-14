---
description: How to set up and run the project locally
---

# Local Development Workflow

Follow these steps to get the environment running locally:

// turbo
1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start Local Blockchain Node**
   Open a new terminal and run:
   ```bash
   npm run start:local
   ```

3. **Deploy Contracts and Update Config**
   In another terminal, run:
   ```bash
   npm run hardhat:deploy-and-update
   ```

4. **Start Frontend**
   Run the development server:
   ```bash
   npm run dev
   ```

5. **Interact with Console (Optional)**
   ```bash
   npm run interact:local
   ```
