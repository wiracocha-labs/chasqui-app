---
description: How to deploy and verify smart contracts
---

# Deployment Workflow

## Fuji Testnet Deployment

1. **Check Environment Variables**
   Ensure `.env` has the necessary private keys and RPC URLs.

2. **Deploy to Fuji**
   ```bash
   npm run deploy:fuji
   ```

3. **Verify Contracts (Optional)**
   ```bash
   npm run verify:fuji <CONTRACT_ADDRESS>
   ```

## Mainnet Deployment

1. **Caution**
   Ensure all tests pass and security audits are considered.

2. **Deploy to Mainnet**
   ```bash
   npm run deploy:mainnet
   ```
