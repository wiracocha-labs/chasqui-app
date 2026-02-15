# Chasqui App 🏔️

**Decentralized communication platform for remote teams with total privacy and integrated productivity.**

Chasqui combines secure messaging, private smart contracts on Avalanche, AI for chat summaries, and a complete ecosystem of productivity tools. A free and private alternative to Slack, designed for teams that value decentralization, privacy, and open collaboration.

---

## 🌟 **Key Features**

### 🔐 **Total Privacy**
- **End-to-end encrypted** messaging.
- **Private payments** with **eERC20** (Encrypted ERC20 on Avalanche).
- **Smart escrow** with encrypted amounts - nobody sees amounts except parties involved.

### 🤖 **Integrated AI & Productivity**
- **Automatic summaries** of long conversations.
- **GitHub & GitLab integration** - Webhooks for Pull requests, issues, commits.
- **Workflow automation** based on external events.

### 🌐 **Hybrid Access**
- **Web3 native** for wallet users.
- **Traditional login** for non-wallet users (via Rust Backend).
- **Gradual onboarding** from Web2 to Web3.

---

## 🏗️ **Project Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Smart         │    │   Backend       │
│   (Vue.js/TS)   │◄──►│   Contracts     │◄──►│   (Rust)        │
│                 │    │   (Solidity)    │    │                 │
│ • Chat UI       │    │ • eERC20 Escrow │    │ • Auth Service  │
│ • Wallet Auth   │    │ • ZK Proofs     │    │ • Webhooks      │
│ • Dashboard     │    │ • Authorization │    │ • Traditional   │
│ • Webhooks UI   │    │                 │    │   Login         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Avalanche     │
                    │   Network       │
                    │                 │
                    │ • C-Chain       │
                    │ • Private Txs   │
                    │ • Low Fees      │
                    └─────────────────┘
```
---

## 📁 **Repository Structure**

```
chasqui-app/
├── frontend/                    # Vue.js Application
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── views/              # Main pages
│   │   ├── stores/             # Global state (Pinia)
│   │   ├── services/           # Services (OrbitDB, Web3)
│   │   └── config/             # Contract configuration
│   └── index.html
├── web3/                       # Smart Contracts
│   ├── contracts/              # Main contracts
│   │   ├── chasqui.sol        # Private escrow system
│   │   ├── Authorization.sol   # Access control
│   │   └── mocks/             # Mock contracts for testing
│   ├── scripts/               # Deployment scripts
│   ├── tests/                 # Contract tests
│   └── artifacts/             # Contract compilation
├── deployments/               # Deployment information
├── ignition/                  # Hardhat Ignition modules
└── config files              # Vite, Hardhat, Tailwind, etc.
```

---

### **Components & Ecosystem**
- **Frontend**: Vue 3 + TypeScript repository.
- **Smart Contracts**: Solidity contracts managing the private escrow system.
- **[Chasqui Server](https://github.com/wiracocha-labs/chasqui-server)**: Our Rust-based backend handling the Web2/Web3 bridge, traditional auth, and webhook processing.

---

## ⚡ **Quick Start**

### **Installation**
```bash
# 1. Clone & Install
git clone https://github.com/wiracocha-labs/chasqui-app.git
cd chasqui-app
pnpm install

# 2. Setup (Hardhat + Local Node)
npm run start:local # Terminal 1
npm run hardhat:deploy-and-update # Terminal 2

# 3. Launch Frontend
npm run dev
```

---

## 🤖 **AI-Native Development**

This project includes a `.agent` directory for context-aware development:
- **Roadmap**: Check `.agent/roadmap-web2.md` (Web2/AI) and `.agent/roadmap-web3.md` (Web3/Blockchain) for current sprint status.
- **Workflows**: Use `/frontend` for UI work or `/development` for full-stack tasks.
- **Instructions**: See `.agent/instructions.md` for project rules and tech stack details.

---

## 🤝 **Contributing**

We welcome contributors of all backgrounds!

1. **Bug Hunters**: Help us find and fix security vulnerabilities or UI glitches.
2. **Designers**: Propose improvements to our "Inca-Modern" aesthetic.
3. **Developers**: Implement new webhooks or optimize our ZK Proof integration.

### **Workflow**
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 🏔️ **About the Name**

**Chasqui** (or Chaskiy in Quechua) were the legendary messengers of the Inca Empire who ran through the Andes carrying vital information. They represent speed, security, and the original "decentralized" network of the Americas.

---

## 📄 **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

**🚀 Join the decentralized and private communication revolution!**
