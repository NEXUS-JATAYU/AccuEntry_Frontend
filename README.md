<![CDATA[<div align="center">

# 🏦 AccuEntry

**AI-Powered Multi-Agent Account Onboarding Platform**

_Automate KYC, AML, fraud detection, and account activation — end-to-end — with a conversational AI interface powered by LangGraph and local LLMs._

[![FastAPI](https://img.shields.io/badge/FastAPI-0.134-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.0-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Ollama](https://img.shields.io/badge/Ollama-LLM-000000?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

</div>

---

## 📖 Overview

**AccuEntry** is a full-stack, production-grade account onboarding platform that replaces manual, multi-step account opening workflows with an intelligent conversational AI assistant. It orchestrates **six specialized AI agents** via a LangGraph supervisor to handle everything from data collection to fraud detection to final account activation — all running on local LLMs with zero API costs.

> A customer chats with the bot → provides details → uploads documents → AI verifies identity, screens for AML/fraud → approves or escalates → sends OTP → account activated. All in one session.

---

## ✨ Features

### 🤖 Multi-Agent Orchestration
- **Supervisor Graph** — LangGraph-powered state machine routes the onboarding flow across six specialist agents
- **Stage-driven routing** — Each agent hands off to the next based on shared state transitions
- **Parallel processing** — AML screening runs in the background while document verification proceeds

### 🔐 Identity & Document Verification
- **PAN Card OCR** — Extracts and validates PAN number, name, and date of birth via Tesseract
- **Aadhaar Card OCR** — Parses Aadhaar details with fuzzy matching against government databases
- **Selfie Liveness** — DeepFace-powered face matching between uploaded selfie and ID documents
- **Video KYC** — Real-time liveness detection for high-risk applications

### 🛡️ Compliance & Risk
- **AML Screening** — Checks against RBI Caution List, OFAC Sanctions, and PEP databases
- **4-Layer Fraud Detection** — Rule-based velocity checks → behavioral scoring → ID cross-matching → LLM risk reasoning (Gemma 2B)
- **Decision Agent** — LLM-powered final adjudication with five possible outcomes (approve, review, reject, request docs, escalate)

### 📊 Human-in-the-Loop
- **HITL Compliance Dashboard** — Real-time case review interface for compliance officers
- **Manual Override** — Flag, approve, or reject cases that require human judgement
- **Audit Trail** — Every agent decision logged as structured JSONL for regulatory compliance

### 🧠 Agent Memory
- **ChromaDB Vector Store** — Semantic memory of past interactions for improved future decisions
- **Reward-based Reranking** — Memory retrieval weighted by outcome success scores
- **PII Scrubbing** — Automatic redaction of sensitive fields before memory storage

### 📧 Activation & OTP
- **Email OTP** — SHA-256 hashed, time-limited OTP codes via Resend API
- **JWT Activation Links** — Secure, expiring account activation URLs
- **Rate Limiting** — Max 3 OTP sends per hour per session

---

## 🛠 Tech Stack

<table>
<tr>
<td align="center" width="25%">

**Backend**

![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![LangGraph](https://img.shields.io/badge/LangGraph-1C3C3C?style=flat-square&logo=langchain&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=flat-square&logo=langchain&logoColor=white)

</td>
<td align="center" width="25%">

**Frontend**

![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite_7-646CFF?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white)

</td>
<td align="center" width="25%">

**AI / ML**

![Ollama](https://img.shields.io/badge/Ollama-000000?style=flat-square&logo=ollama&logoColor=white)
![DeepFace](https://img.shields.io/badge/DeepFace-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Tesseract](https://img.shields.io/badge/Tesseract_OCR-3DDC84?style=flat-square)
![ChromaDB](https://img.shields.io/badge/ChromaDB-FF6B6B?style=flat-square)

</td>
<td align="center" width="25%">

**Data & Infra**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
flowchart TD
    subgraph CLIENT["🖥️ Client Layer"]
        FE["React Frontend<br/><i>Vite + Tailwind CSS v4</i>"]
        HITL["HITL Compliance Dashboard<br/><i>React + Vite</i>"]
    end

    subgraph BACKEND["⚙️ Backend Orchestration — FastAPI"]
        API["REST API Gateway<br/><i>FastAPI + Uvicorn</i>"]
        SUP["LangGraph Supervisor<br/><i>State Machine Router</i>"]

        subgraph AGENTS["🤖 Agent Subgraphs"]
            DC["Data Capture Agent<br/><i>Conversational collection</i>"]
            DV["Doc Verification Agent<br/><i>PAN · Aadhaar · Selfie</i>"]
            KYC["KYC Approval Agent<br/><i>Cross-document matching</i>"]
            AML["AML Screening Agent<br/><i>RBI · OFAC · PEP</i>"]
            FC["Fraud Check Agent<br/><i>4-layer risk scoring</i>"]
            DA["Decision Agent<br/><i>LLM adjudication + OTP</i>"]
        end
    end

    subgraph VERIFY["🔍 AccuVerify — Document Service"]
        OCR["OCR Engine<br/><i>Tesseract + Regex</i>"]
        FACE["Face Verification<br/><i>DeepFace + MTCNN</i>"]
        VID["Video KYC<br/><i>Liveness Detection</i>"]
    end

    subgraph DATA["💾 Data Layer"]
        PG["PostgreSQL<br/><i>Customer Records</i>"]
        MONGO["MongoDB Atlas<br/><i>KYC Documents</i>"]
        REDIS["Redis<br/><i>Session State</i>"]
        CHROMA["ChromaDB<br/><i>Agent Memory</i>"]
    end

    subgraph EXTERNAL["🌐 External Services"]
        OLLAMA["Ollama<br/><i>llama3.2 · gemma2:2b</i>"]
        RESEND["Resend API<br/><i>Email / OTP</i>"]
    end

    FE -- "Chat / Upload / OTP" --> API
    HITL -- "Case Review" --> API
    API --> SUP
    SUP --> DC
    SUP --> DV
    SUP --> KYC
    SUP --> AML
    SUP --> FC
    SUP --> DA

    DV -- "Upload PAN/Aadhaar/Selfie" --> VERIFY
    KYC -- "Agent Approve/Reject" --> VERIFY

    DC --> PG
    DV --> MONGO
    AML --> MONGO
    DA -- "OTP Email" --> RESEND

    SUP --> REDIS
    SUP --> CHROMA

    FC --> OLLAMA
    AML --> OLLAMA
    DA --> OLLAMA
    DC --> OLLAMA

    style CLIENT fill:#1a1a2e,stroke:#16213e,color:#e0e0e0
    style BACKEND fill:#0f3460,stroke:#16213e,color:#e0e0e0
    style AGENTS fill:#162447,stroke:#1a1a2e,color:#e0e0e0
    style VERIFY fill:#1b1b2f,stroke:#16213e,color:#e0e0e0
    style DATA fill:#1a1a2e,stroke:#16213e,color:#e0e0e0
    style EXTERNAL fill:#0a0a23,stroke:#16213e,color:#e0e0e0
```

### Onboarding Flow

```mermaid
stateDiagram-v2
    [*] --> DataCapture: Session Start
    DataCapture --> DocVerification: All details collected
    DocVerification --> KYCApproval: Documents uploaded
    KYCApproval --> AMLScreening: KYC verified

    AMLScreening --> FraudCheck: AML cleared
    AMLScreening --> ManualReview: AML flagged

    FraudCheck --> DecisionAgent: Fraud scored
    FraudCheck --> ManualReview: High risk

    DecisionAgent --> OTPVerification: Approved
    DecisionAgent --> ManualReview: Needs review
    DecisionAgent --> Rejected: Application rejected

    OTPVerification --> AccountActivated: OTP verified
    OTPVerification --> DecisionAgent: OTP failed

    ManualReview --> DecisionAgent: Officer decision
    AccountActivated --> [*]
    Rejected --> [*]
```

---

## 📁 Project Structure

```
AccuEntry/
├── AccuEntry_Backend/              # Core backend — FastAPI + LangGraph
│   ├── main.py                     # API gateway (chat, KYC proxy, HITL endpoints)
│   ├── supervisor.py               # LangGraph supervisor graph (routes all agents)
│   ├── state.py                    # Shared OnboardingState TypedDict
│   ├── llm_config.py               # Centralised Ollama LLM configuration
│   ├── audit_logger.py             # Structured JSONL audit trail
│   ├── memory_manager.py           # Agent memory manager (ChromaDB + in-memory)
│   ├── agents/
│   │   ├── data_capture/           # Conversational data collection agent
│   │   │   ├── data_capture.py     # LangGraph subgraph for collecting user info
│   │   │   └── data_capture_validators.py  # Field validation (PAN, phone, email)
│   │   ├── doc_verification/       # Document verification agent
│   │   │   ├── doc_verify.py       # PAN/Aadhaar/Selfie upload orchestration
│   │   │   └── kyc_approval.py     # Agent-level KYC approval logic
│   │   ├── aml/                    # Anti-Money Laundering agent
│   │   │   ├── aml_screening.py    # LangGraph subgraph for AML checks
│   │   │   ├── aml_mockdb.py       # Mock sanctions/PEP database
│   │   │   ├── aml_scoring.py      # Risk score computation
│   │   │   └── tools.py            # RBI, OFAC, sanctions check tools
│   │   ├── fraud_check/            # Fraud detection agent
│   │   │   └── fraud_check.py      # 4-layer fraud scoring (rules + LLM)
│   │   └── decision/               # Decision making agent
│   │       ├── decision_tool.py    # LLM-powered adjudication subgraph
│   │       ├── activation_service.py # JWT activation links + email
│   │       ├── otp_service.py      # OTP generation, hashing, verification
│   │       └── otp_verification.py # OTP flow handler node
│   ├── core/
│   │   ├── database.py             # PostgreSQL (SQLAlchemy) connection
│   │   ├── redis_client.py         # Redis async client
│   │   ├── chroma_memory.py        # ChromaDB vector store backend
│   │   ├── http_client_pool.py     # Shared httpx connection pool
│   │   └── mongodbase.py           # MongoDB connection
│   ├── models/
│   │   └── customer_info.py        # SQLAlchemy ORM — CustomerDetails table
│   ├── schemas/
│   │   └── chat.py                 # Pydantic models (ChatRequest/Response, etc.)
│   ├── orchestration/
│   │   └── onboarding_workflow.py  # Workflow utilities
│   ├── scripts/                    # Utility scripts
│   ├── logs/                       # Audit log output directory
│   └── requirements.txt            # Python dependencies
│
├── AccuEntry_Frontend/             # Customer-facing React app
│   ├── src/
│   │   ├── App.jsx                 # Route definitions (/, /open-account)
│   │   ├── main.jsx                # React DOM entry point
│   │   ├── index.css               # Global styles
│   │   ├── pages/
│   │   │   ├── HomePage.jsx        # Landing page — bank marketing
│   │   │   └── OpenAccountPage.jsx # Account opening page with chatbot
│   │   └── components/
│   │       ├── ChatWindow/         # Main chat interface component
│   │       ├── ChatBotWidget/      # Floating chatbot widget
│   │       ├── Header/             # Navigation header
│   │       ├── Footer/             # Page footer
│   │       ├── HeroSection/        # Landing hero banner
│   │       ├── LoginForm/          # Authentication form
│   │       ├── ProductCard/        # Product display cards
│   │       ├── QuickLinks/         # Quick navigation links
│   │       └── common/             # Shared UI components
│   ├── package.json                # Node dependencies (React 19, Vite 7)
│   └── vercel.json                 # Vercel deployment config
│
├── AccuEntry_Verify/               # Document verification microservice
│   ├── main.py                     # FastAPI — OCR, face match, video KYC
│   ├── app/
│   │   ├── face_service.py         # DeepFace face comparison
│   │   ├── ocr_service.py          # Tesseract OCR extraction
│   │   ├── identity_verify.py      # End-to-end identity verification
│   │   ├── pan_service.py          # PAN-specific parsing
│   │   ├── database.py             # MongoDB KYC record store
│   │   ├── seed_pan.py             # PAN test data seeder
│   │   ├── seed_aadhaar.py         # Aadhaar test data seeder
│   │   └── webrtc_service.py       # WebRTC video stream handler
│   ├── core/
│   │   └── redis_client.py         # Redis connection
│   ├── uploads/                    # Uploaded document storage
│   └── requirements.txt            # Python dependencies (DeepFace, OpenCV)
│
└── HITL_2/                         # Human-in-the-Loop compliance dashboard
    ├── src/
    │   ├── App.jsx                 # Dashboard layout + case table
    │   ├── main.jsx                # React entry point
    │   ├── components/
    │   │   ├── Sidebar.jsx         # Navigation sidebar
    │   │   ├── Table.jsx           # Case listing table
    │   │   ├── TableRow.jsx        # Individual case row
    │   │   └── Topbar.jsx          # Dashboard header
    │   ├── data/                   # Mock/static data
    │   └── styles/                 # Dashboard CSS
    └── package.json                # Node dependencies (React 18, Vite 5)
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| **Python** | 3.11+ | Backend runtime |
| **Node.js** | 18+ | Frontend build tooling |
| **PostgreSQL** | 15+ | Customer data storage |
| **MongoDB** | 6+ (or Atlas) | KYC document storage |
| **Redis** | 7+ | Session state management |
| **Ollama** | Latest | Local LLM inference |
| **Tesseract OCR** | 5+ | Document text extraction |

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/accuentry.git
cd accuentry
```

### 2. Set Up Ollama (Local LLM)

```bash
# Install Ollama: https://ollama.com/download
ollama pull llama3.2        # Primary model (data capture, AML, decision)
ollama pull gemma2:2b       # Fraud check reasoning model
ollama serve                # Start server on port 11434
```

### 3. Start the Backend

```bash
cd AccuEntry_Backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env         # Copy and edit .env (see Environment Variables below)

# Run the backend server
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

### 4. Start AccuVerify (Document Service)

```bash
cd AccuEntry_Verify

# Create and activate virtual environment
python -m venv env
env\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env         # Edit with MongoDB connection string

# Run the verify service
uvicorn main:app --host 127.0.0.1 --port 9000 --reload
```

### 5. Start the Frontend

```bash
cd AccuEntry_Frontend

# Install dependencies
npm install

# Run the development server
npm run dev                  # → http://localhost:5173
```

### 6. Start the HITL Dashboard (Optional)

```bash
cd HITL_2

# Install dependencies
npm install

# Run the dashboard
npm run dev                  # → http://localhost:5174
```

---

## ⚙️ Environment Variables

### AccuEntry_Backend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL for session state | `redis://localhost:6379/0` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | PostgreSQL database name | `accuentry_db` |
| `DB_USER` | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | PostgreSQL password | — |
| `ACCUVERIFY_URL` | AccuVerify service URL | `http://127.0.0.1:9000` |
| `OLLAMA_MODEL` | Default Ollama model | `llama3.2` |
| `OLLAMA_BASE_URL` | Ollama server URL | `http://localhost:11434` |
| `JWT_SECRET_KEY` | Secret key for JWT activation tokens | — |
| `FRONTEND_URL` | Frontend URL (for CORS) | `http://127.0.0.1:5173` |
| `RESEND_API_KEY` | Resend API key for email/OTP dispatch | — |
| `AGENT_MEMORY_PROVIDER` | Memory backend (`chroma` or `memory`) | `chroma` |
| `CHROMA_COLLECTION_PREFIX` | ChromaDB collection namespace | `accuentry` |
| `CHROMA_EMBED_MODEL` | Sentence embedding model | `sentence-transformers/all-MiniLM-L6-v2` |
| `CHROMA_PERSIST_DIR` | ChromaDB persistence directory | `./.chroma` |
| `AGENT_MEMORY_WRITE_ENABLED` | Enable memory writes | `true` |
| `AGENT_MEMORY_RETRIEVAL_ENABLED` | Enable memory retrieval | `true` |
| `AGENT_MEMORY_REWARD_RERANK_ENABLED` | Enable reward-based reranking | `true` |
| `AGENT_MEMORY_REWARD_ALPHA` | Similarity weight for reranking | `0.8` |
| `AGENT_MEMORY_REWARD_BETA` | Reward weight for reranking | `0.2` |

### AccuEntry_Verify (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379/0` |
| `MONGO_URL` | MongoDB Atlas connection string | — |

### HITL_2 (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BACKEND_URL` | Backend API URL | `http://127.0.0.1:8000` |

---

## 📡 API Overview

### Chat & Onboarding

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Send a chat message; returns agent response + state |
| `GET` | `/session/{id}` | Retrieve session state and details |
| `PUT` | `/session/{id}` | Update session details manually |

### KYC Document Upload (Proxied to AccuVerify)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/kyc/pan` | Upload PAN card image for OCR verification |
| `POST` | `/kyc/aadhaar` | Upload Aadhaar card image for OCR verification |
| `POST` | `/kyc/selfie` | Upload selfie for face matching |
| `POST` | `/kyc/video-kyc` | Upload video for liveness detection |
| `POST` | `/kyc/approve` | Trigger agent-level KYC approval |

### HITL (Compliance Dashboard)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/hitl/cases` | List all onboarding cases for review |
| `GET` | `/hitl/summary` | Get aggregate dashboard statistics |

### AccuVerify (Document Service — Port 9000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/upload-pan` | PAN OCR extraction + database validation |
| `POST` | `/upload-aadhaar` | Aadhaar OCR extraction + database validation |
| `POST` | `/upload-selfie` | Face comparison (selfie vs. ID photo) |
| `POST` | `/upload-video-kyc` | Video liveness verification |
| `POST` | `/agent/approve-kyc` | Agent-triggered KYC status update |
| `POST` | `/agent/reject-kyc` | Agent-triggered KYC rejection |
| `GET` | `/agent/pending-kyc` | List pending agent reviews |

---

## 🧪 Running Tests

```bash
# Backend — database connectivity
cd AccuEntry_Backend
python test_db_connection.py

# Frontend — lint
cd AccuEntry_Frontend
npm run lint
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Guidelines

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Ensure all existing tests pass before submitting a PR
- Add tests for new functionality
- Update documentation for any API changes
- Keep PRs focused — one feature or fix per PR

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by the AccuEntry Team**

_Reimagining account onboarding with AI agents_

</div>
]]>
