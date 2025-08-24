# Chasqui App 🏔️

**Decentralized communication platform for remote teams with total privacy and integrated productivity.**

Chasqui combines secure messaging, private smart contracts on Avalanche, AI for chat summaries, and a complete ecosystem of productivity tools. A free and private alternative to Slack, designed for teams that value decentralization, privacy, and open collaboration.

---

## 🌟 **Key Features**

### 🔐 **Total Privacy**
- **End-to-end encrypted** messaging
- **Private payments** with eERC20 (Encrypted ERC20)
- **Smart escrow** with zero-knowledge proofs
- **Hidden amounts** - nobody sees amounts except parties involved

### 🤖 **Integrated AI**
- **Automatic summaries** of long conversations
- **Team productivity analysis**
- **Smart suggestions** for tasks and projects

### 🔗 **Productivity & Webhooks**
- **GitHub integration** - Pull requests, issues, commits
- **Customizable webhooks** for any service
- **Workflow automation** based on events
- **Team productivity metrics** dashboard

### 🌐 **Hybrid Access**
- **Web3 native** for wallet users
- **Traditional login** for non-wallet users ([Rust Backend](https://github.com/wiracocha-labs/chasqui-server))
- **Gradual onboarding** from Web2 to Web3
- **No technical barriers** to entry

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

## 🛠️ **Technology Stack**

### **Frontend**
- **Vue.js 3** + Composition API + TypeScript
- **Tailwind CSS** with custom design system
- **Pinia** for state management
- **ethers.js** for Web3 interaction
- **Vite** as bundler

### **Smart Contracts**
- **Solidity ^0.8.9** with optimizations
- **Hardhat** for development and testing
- **eERC20** for private transactions
- **Zero-Knowledge Proofs** for verification

### **Backend** ([Separate Repository](https://github.com/wiracocha-labs/chasqui-server))
- **Rust** with modern web framework
- **Authentication service** for non-wallet users
- **Webhook management** system
- **Database** for traditional data
- **API Gateway** for service integration

### **Blockchain**
- **Avalanche C-Chain** for main contracts
- **Local Hardhat** for development
- **Fuji Testnet** for staging

---

## 🚀 **Installation and Development**

### **Prerequisites**
- Node.js 18+
- yarn (recommended) or npm
- Git

### **Project Setup**

```bash
# 1. Clone the repository
git clone https://github.com/wiracocha-labs/chasqui-app.git
cd chasqui-app

# 2. Install dependencies
yarn install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your configurations

# 4. Compile contracts
yarn hardhat:compile

# 5. Start local node (terminal 1)
yarn start:local

# 6. Full local deploy (terminal 2)
yarn hardhat:deploy-and-update

# 7. Run tests
yarn test:contracts

# 8. Start frontend
yarn dev
```

### **Available Scripts**

#### **Frontend**
```bash
yarn dev          # Frontend development
yarn build        # Production build
yarn dev:full     # Deploy + Complete Frontend
```

#### **Smart Contracts**
```bash
yarn hardhat:compile             # Compile contracts
yarn hardhat:test               # Contract tests
yarn hardhat:deploy-local-full  # Full local deploy
yarn deploy:fuji                # Deploy to Fuji testnet
yarn deploy:mainnet             # Deploy to Avalanche mainnet
```

#### **Development**
```bash
yarn start:local          # Local Hardhat node
yarn interact:local       # Interactive console
```

---

## 🔗 **Chasqui Ecosystem**

### **Repositories**

| Repository | Description | Technology |
|------------|-------------|------------|
| **[chasqui-app](https://github.com/wiracocha-labs/chasqui-app)** | Frontend + Smart Contracts | Vue.js + Solidity |
| **[chasqui-server](https://github.com/wiracocha-labs/chasqui-server)** | Backend + Auth + Webhooks | Rust |

### **Planned Integrations**
- 🐙 **GitHub** - PRs, Issues, Commits, Releases
- 🔄 **GitLab** - Pipelines, Merge Requests
- 📊 **Jira** - Tickets, Sprint updates
- 🐳 **Docker** - Deployment notifications
- 📈 **Custom APIs** - Configurable webhooks

---

## 🎯 **Detailed Roadmap**

### **🏃‍♂️ CURRENT SPRINT - MVP for Fundraising (3 weeks)**
*Target: Avalanche Hackathon + Demo for investors*

#### **Week 1: Core Escrow + Frontend** *(Days 1-7)*
- **Days 1-2**: 
  - ✅ Finalize private escrow system with real eERC20
  - ✅ Comprehensive testing of main contract
  - ✅ Deploy and verification on Fuji testnet
  
- **Days 3-4**:
  - 🔄 Frontend integration with real eERC20 contracts
  - 🔄 Optimized UX for private task creation/management
  - 🔄 Basic dashboard for pending/completed tasks

- **Days 5-7**:
  - 🔄 Complete flows: create task → complete → release funds
  - 🔄 Robust validations and error handling
  - 🔄 Polished UI for demo

#### **Week 2: Rust Backend + Authentication** *(Days 8-14)*
- **Days 8-10**:
  - 🔄 Actix-Web backend with functional traditional login  
  - 🔄 Basic API endpoints for non-wallet users
  - 🔄 Database setup and data models

- **Days 11-12**:
  - 🔄 Frontend ↔ backend bridge for hybrid users
  - 🔄 Session and authentication system
  - 🔄 Task tracking for non-Web3 users

- **Days 13-14**:
  - 🔄 Testing and integration with frontend
  - 🔄 Basic backend deployment
  - 🔄 API documentation

#### **Week 3: GitHub Webhooks + Demo Ready** *(Days 15-21)*
- **Days 15-17**:
  - 🔄 Basic GitHub webhook (PR created, merged, issues)
  - 🔄 UI for webhook configuration in frontend
  - 🔄 Chat notifications when GitHub activity occurs

- **Days 18-19**:
  - 🔄 Professional demo video (2-3 minutes)
  - 🔄 Optimized landing page
  - 🔄 Complete documentation

- **Days 20-21**:
  - 🔄 End-to-end integration testing
  - 🔄 Pitch deck preparation
  - 🔄 Deploy on Avalanche mainnet

---

### **🚀 PHASE 2 - Post-Fundraising (Month 2)**
*Target: Beta product with first users*

#### **Weeks 4-6: AI + Advanced UX**
- **AI for chat summaries**
  - Integration with OpenAI/Claude API
  - Automatic summaries of long conversations
  - Basic productivity analysis

- **UX/UI Refinement**
  - Complete professional design
  - Onboarding flow for new users
  - Perfected mobile-responsive
  - Keyboard shortcuts and productivity

#### **Weeks 7-8: Integration Expansion**
- **Figma Integration** (for non-programmers)
  - Webhook when design changes occur
  - Notifications for comments and reviews
  - Design gallery in chat

- **Additional tools** based on traction:
  - Linear/Jira (project management)
  - Discord bridge (communities)
  - Calendar integrations

---

### **🏗️ PHASE 3 - Scalability (Months 3-6)**
*Target: Robust product and growth*

#### **Month 3: Governance + Token**
- **DAO Governance Implementation**
  - Governance token with eERC20 (private voting! 🔥)
  - Community proposals for features
  - Decentralized treasury management

#### **Month 4: Enterprise Features**
- **Advanced Webhooks**
  - Notion, Slack, Microsoft Teams
  - Custom webhook builder
  - Analytics dashboard for teams

- **Security & Compliance**
  - Professional security audit
  - Basic compliance for enterprises
  - SSO integration

#### **Month 5: Mobile + Scaling**
- **Mobile Apps** (if there's demand/funding)
  - React Native apps
  - Push notifications
  - Desktop sync

- **Multi-chain Support**
  - Ethereum mainnet
  - Polygon for lower fees
  - Cross-chain bridges

#### **Month 6: Marketplace**
- **Integration Marketplace**
  - Third-party developers
  - Revenue sharing model
  - Plugin system

---

### **🎯 KPIs and Metrics**

#### **MVP Success Metrics (3 weeks):**
- ✅ End-to-end functional demo
- ✅ 5+ tasks created and completed on testnet
- ✅ GitHub webhook working
- ✅ Backend auth + hybrid frontend
- ✅ Pitch deck + demo video
- 🎯 **Goal**: Secure initial funding

#### **Beta Success Metrics (Month 2):**
- 10-20 active early adopters
- 100+ tasks processed with eERC20
- 5+ integrations configured
- AI generating 50+ summaries
- 🎯 **Goal**: Initial product-market fit

#### **Scale Success Metrics (Months 3-6):**
- 100+ teams using the platform
- $10k+ in escrow volume processed
- Active DAO governance
- 10+ available integrations
- 🎯 **Goal**: Sustainability and growth

---

### **🏆 Timeline Competitive Advantages**

#### **Perfect Timing:**
- **Avalanche Hackathon**: Exposure and networking
- **eERC20 early adoption**: First-mover advantage
- **Remote work trends**: Growing market
- **Privacy concerns**: Relevant narrative

#### **Clear Differentiation:**
- **Only project** combining chat + private escrow
- **Hybrid approach**: Web2 and Web3 users
- **Real eERC20**: Not mock, real technology
- **Private DAO governance**: Hidden voting amounts

#### **Mitigated Risks:**
- **Solo developer**: Realistic MVP scope
- **3 weeks**: Tight but achievable timeline
- **Funding dependency**: MVP demonstrates viability
- **Technical complexity**: Incremental approach

---

## 🤝 **Contributing**

Contributions are welcome! Please:

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### **Areas where you can help:**
- 🎨 **UI/UX** - Improve design and experience
- 🔐 **Security** - Audits and security improvements
- 🧪 **Testing** - More test cases
- 📚 **Documentation** - Tutorials and guides
- 🔗 **Integrations** - New webhooks and APIs

---

## 📄 **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🏔️ **About the Name**

**Chasqui** (also Chaskiy in Quechua) were the messengers of the Inca Empire who ran through the Andes carrying important messages and packages between communities. They represented fast, secure, and reliable communication across great distances - exactly what we seek to achieve in the decentralized digital world.

---

## 📝 **Useful Commands**

### **Quick development:**
```bash
# Complete setup for new environments
yarn install && yarn hardhat:compile && yarn hardhat:deploy-and-update

# Full development in one command
yarn dev:full

# Clean and recompile from scratch
yarn hardhat:clean && yarn hardhat:compile

# Verify contracts on testnet
yarn verify:fuji <CONTRACT_ADDRESS>
```

### **Testing and debugging:**
```bash
# Contract tests only
yarn test:contracts

# Interactive console for debugging
yarn interact:local

# View gas reporting
REPORT_GAS=true yarn hardhat:test
```

---

## 📞 **Contact**

- **Organization**: [Wiracocha Labs](https://github.com/wiracocha-labs)
- **Project**: [chasqui-app](https://github.com/wiracocha-labs/chasqui-app)
- **Backend**: [chasqui-server](https://github.com/wiracocha-labs/chasqui-server)

---

**🚀 Join the decentralized and private communication revolution!**
