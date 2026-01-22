# Algorythmos

A professional website for **Algorythmos**, an AI consultancy delivering agentic automation, document intelligence, SQL analytics, and MLOps engineering for SMEs across Europe and Australia.

> **AI Agents & Developers**: Read [`docs/DEVELOPMENT_GUIDE.md`](./docs/DEVELOPMENT_GUIDE.md) before making any changes.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Before committing (MANDATORY)
npm run i18n:check   # Verify EN/FR translations
npm run lint         # Code quality
npm run build        # Production build
```

---

## 📋 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + React Router |
| Build | Vite 6 |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| SEO | React Helmet Async |
| Testing | Playwright (E2E), Vitest (unit) |
| Deployment | Vercel |

---

## 🎯 Services

| Service | Description |
|---------|-------------|
| **Agentic Automation** | AI workflows with guardrails |
| **Document Intelligence** | OCR + NLP for documents |
| **SQL Dashboards** | Business intelligence |
| **MLOps CI/CD** | Production ML pipelines |
| **AI Websites** | Custom AI-powered sites |

---

## 🌍 Multi-Region

| Region | URL Pattern |
|--------|-------------|
| Global (EN) | `/services/...` |
| Australia | `/au-en/services/...` |
| France | `/fr-fr/services/...` |

---

## 📁 Project Structure

```
src/
├── App.jsx              # Main router
├── pages/               # Page components
├── components/          # Reusable UI
├── data/                # services.js, team.js
├── app/i18n/            # EN/FR translations
└── lib/                 # Utilities
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [`docs/DEVELOPMENT_GUIDE.md`](./docs/DEVELOPMENT_GUIDE.md) | AI agent & developer workflow |
| [`docs/SEO_GOVERNANCE.md`](./docs/SEO_GOVERNANCE.md) | SEO rules for all regions |
| [`docs/AUDIT_HISTORY.md`](./docs/AUDIT_HISTORY.md) | Past audits and fixes |

---

## 🔗 Links

- **Website**: [algorythmos.com](https://algorythmos.com)
- **Twitter**: [@algorythmos](https://x.com/algorythmos)

---

Built with ❤️ by the Algorythmos team
