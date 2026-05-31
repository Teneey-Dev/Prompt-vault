# PromptVault 🔐

A decentralized, optimized prompt management dashboard built for the QuikDB BuildVerse Hackathon. **PromptVault** solves the problem of "prompt clutter" by giving AI engineers and creators a centralized workstation to optimize, organize, categorize, and store their high-performing AI prompts securely in the cloud.

## 🚀 Live Demo & Deployment
* **Live Deployment Link:** [Insert your QuikDB / Live App URL here]
* **Built For:** QuikDB BuildVerse Hackathon (June 2026 Submission)

---

## ✨ Key Features

* **AI Prompt Optimization:** Integrates directly with the Gemini Pro API to instantly rewrite raw, weak drafts into structured, professional prompts.
* **Smart Content Filtering:** A real-time search engine that dynamically filters stored cards by category or keywords instantly as you type.
* **State Persistence:** Seamlessly manages local caching fallback structures alongside network data sync.
* **Credit Tracking System:** Built-in usage guardrails that track remaining tokens (`prompts` count) natively across session refreshes.

---

## 🛠️ The Tech Stack

* **Frontend:** Vanilla JavaScript (ES6+), Semantic HTML5, CSS3 Layouts.
* **Backend Layer:** Node.js, Express.js (Serving static assets and handling production routing).
* **Database & Hosting:** QuikDB Decentralized Cloud Infrastructure.
* **AI Engine:** Google Gemini Developer API (`gemini-3.5-flash`).

---

## 📂 Project Architecture

```text
├── index.html        # Main dashboard interface layout
├── style.css         # Modern dark-mode user interface styling
├── server.js         # Express web server for hosting automation
├── package.json      # Node.js dependencies and engine scripts
├── quikdb.json       # QuikDB cloud pipeline configuration
└── Public/
    └── app.js        # Core frontend application & API integration logic

