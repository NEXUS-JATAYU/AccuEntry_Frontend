<div align="center">

<br/>

```
╔═══════════════════════════════════════════╗
║                                           ║
║        ▄▄▄   ▄▄▄▄▄   ▄▄▄▄▄   ▄▄▄         ║
║       █   █ █     █ █     █ █   █        ║
║       █████ █     █ █     █ █████        ║
║       █   █ █▄▄▄▄▄█ █▄▄▄▄▄█ █   █        ║
║                                           ║
║       AccuEntry · AI Account Opening      ║
╚═══════════════════════════════════════════╝
```

# 🏦 AccuEntry

### *AI-Powered Multi-Agent Account Onboarding Platform*

> Automate KYC · AML · Fraud Detection · Account Activation  
> End-to-end, in a single conversational session — powered by LangGraph & local LLMs.

<br/>

[![FastAPI](https://img.shields.io/badge/FastAPI-0.134-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![LangGraph](https://img.shields.io/badge/LangGraph-1.0-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Ollama](https://img.shields.io/badge/Ollama-Local_LLM-000000?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![MIT License](https://img.shields.io/badge/License-MIT-F7DC6F?style=for-the-badge)](LICENSE)

<br/>

[🚀 Get Started](#-getting-started) · [🏗 Architecture](#️-architecture) · [📡 API Docs](#-api-overview) · [🤝 Contribute](#-contributing)

<br/>

---

</div>

## 📖 What is AccuEntry?

**AccuEntry** replaces slow, manual bank account onboarding with an intelligent conversational AI assistant. It orchestrates **six specialized AI agents** through a LangGraph supervisor — collecting data, verifying documents, screening for AML/fraud, and activating accounts — all running on **local LLMs with zero API costs**.

```
Customer chats → Provides details → Uploads docs
  → AI verifies identity → AML & fraud screening
    → Auto-approves or escalates → OTP sent → Account live ✅
```

All in **one seamless session**.

<br/>

---

## ✨ Features at a Glance

<br/>

### 🤖 Multi-Agent Orchestration
| Capability | Detail |
|---|---|
| **LangGraph Supervisor** | State-machine router orchestrating 6 specialist agents |
| **Stage-Driven Routing** | Agents hand off via shared state transitions |
| **Parallel Processing** | AML screening runs concurrently with document verification |

<br/>

### 🔐 Identity & Document Verification
| Capability | Detail |
|---|---|
| **PAN Card OCR** | Extracts PAN number, name, and DoB via Tesseract |
| **Aadhaar OCR** | Parses Aadhaar with fuzzy matching against govt databases |
| **Selfie Liveness** | DeepFace-powered face match between selfie and ID documents |
| **Video KYC** | Real-time liveness detection for high-risk applications |

<br/>

### 🛡️ Compliance & Risk
| Capability | Detail |
|---|---|
| **AML Screening** | Checks RBI Caution List, OFAC Sanctions, and PEP databases |
| **4-Layer Fraud Detection** | Rule-based → behavioral scoring → ID cross-matching → LLM reasoning |
| **Decision Agent** | LLM adjudication with 5 outcomes: approve / review / reject / request docs / escalate |

<br/>

### 📊 Human-in-the-Loop (HITL)
| Capability | Detail |
|---|---|
| **Compliance Dashboard** | Real-time case review UI for compliance officers |
| **Manual Override** | Flag, approve, or reject cases requiring human judgment |
| **Audit Trail** | Every agent decision logged as structured JSONL |

<br/>

### 🧠 Agent Memory
| Capability | Detail |
|---|---|
| **ChromaDB Vector Store** | Semantic memory of past interactions |
| **Reward-Based Reranking** | Memory retrieval weighted by outcome success scores |
| **PII Scrubbing** | Automatic redaction of sensitive fields before storage |

<br/>

### 📧 Activation & OTP
| Capability | Detail |
|---|---|
| **Email OTP** | SHA-256 hashed, time-limited codes via Resend API |
| **JWT Activation Links** | Secure, expiring account activation URLs |
| **Rate Limiting** | Max 3 OTP sends per hour per session |

<br/>

---

## 🛠 Tech Stack

<div align="center">

|  | Layer | Technologies |
|:---:|---|---|
| ⚙️ | **Backend** | Python 3.11 · FastAPI · LangGraph · LangChain · Uvicorn |
| 🎨 | **Frontend** | React 19 · Vite 7 · Tailwind CSS v4 · React Router |
| 🤖 | **AI / ML** | Ollama (llama3.2 · gemma2:2b) · DeepFace · Tesseract OCR · ChromaDB |
| 💾 | **Databases** | PostgreSQL 16 · MongoDB Atlas · Redis 7 |
| 🚀 | **Deployment** | Vercel (Frontend) · Uvicorn (Backend) |

</div>

<br/>

---

## 🏗️ Architecture

### System Diagram

```mermaid
flowchart TD
    subgraph CLIENT["🖥️ Client Layer"]
        FE["⚛️ React Frontend\nVite 7 + Tailwind CSS v4"]
        HITL["📋 HITL Compliance Dashboard\nReact + Vite"]
    end

    subgraph BACKEND["⚙️ Backend — FastAPI + LangGraph"]
        API["🔀 REST API Gateway\nFastAPI · Uvicorn"]
        SUP["🧠 LangGraph Supervisor\nState Machine Router"]

        subgraph AGENTS["🤖 Agent Subgraphs"]
            direction LR
            DC["💬 Data Capture\nConversational collection"]
            DV["📄 Doc Verification\nPAN · Aadhaar · Selfie"]
            KYC["✅ KYC Approval\nCross-document matching"]
            AML["🛡️ AML Screening\nRBI · OFAC · PEP"]
            FC["🔍 Fraud Check\n4-layer risk scoring"]
            DA["⚖️ Decision Agent\nLLM adjudication + OTP"]
        end
    end

    subgraph VERIFY["🔬 AccuVerify — Document Microservice"]
        OCR["📷 OCR Engine\nTesseract + Regex"]
        FACE["👤 Face Verification\nDeepFace + MTCNN"]
        VID["🎥 Video KYC\nLiveness Detection"]
    end

    subgraph DATA["💾 Data Layer"]
        PG[("🐘 PostgreSQL\nCustomer Records")]
        MONGO[("🍃 MongoDB Atlas\nKYC Documents")]
        REDIS[("⚡ Redis\nSession State")]
        CHROMA[("🧬 ChromaDB\nAgent Memory")]
    end

    subgraph EXTERNAL["🌐 External Services"]
        OLLAMA["🦙 Ollama\nllama3.2 · gemma2:2b"]
        RESEND["📧 Resend API\nEmail · OTP"]
    end

    FE -- "Chat / Upload / OTP" --> API
    HITL -- "Case Review" --> API
    API --> SUP
    SUP --> DC & DV & KYC & AML & FC & DA

    DV -- "PAN / Aadhaar / Selfie" --> OCR
    DV -- "Face Match" --> FACE
    KYC -- "Video KYC" --> VID

    DC --> PG
    DV & AML --> MONGO
    DA -- "Send OTP" --> RESEND

    SUP --> REDIS & CHROMA

    FC & AML & DA & DC --> OLLAMA

    style CLIENT fill:#0d1117,stroke:#30363d,color:#c9d1d9
    style BACKEND fill:#0d1117,stroke:#1f6feb,color:#c9d1d9
    style AGENTS fill:#161b22,stroke:#1f6feb,color:#c9d1d9
    style VERIFY fill:#0d1117,stroke:#3fb950,color:#c9d1d9
    style DATA fill:#0d1117,stroke:#d29922,color:#c9d1d9
    style EXTERNAL fill:#0d1117,stroke:#8b949e,color:#c9d1d9
```

<br/>

### Onboarding State Flow

```mermaid
stateDiagram-v2
    direction LR

    [*] --> DataCapture : 🟢 Session Start

    DataCapture --> DocVerification : All details collected
    DocVerification --> KYCApproval : Documents uploaded
    KYCApproval --> AMLScreening : KYC verified

    AMLScreening --> FraudCheck : ✅ AML cleared
    AMLScreening --> ManualReview : 🚨 AML flagged

    FraudCheck --> DecisionAgent : Score computed
    FraudCheck --> ManualReview : ⚠️ High risk

    DecisionAgent --> OTPVerification : ✅ Approved
    DecisionAgent --> ManualReview : 🔍 Needs review
    DecisionAgent --> Rejected : ❌ Rejected

    OTPVerification --> AccountActivated : ✅ OTP verified
    OTPVerification --> DecisionAgent : ♻️ OTP failed — retry

    ManualReview --> DecisionAgent : Officer decision made

    AccountActivated --> [*]
    Rejected --> [*]
```

<br/>

---

## 📁 Project Structure

```
AccuEntry/
│
├── 📦 AccuEntry_Backend/              ← Core backend: FastAPI + LangGraph
│   ├── main.py                        ← API gateway (chat, KYC proxy, HITL)
│   ├── supervisor.py                  ← LangGraph supervisor graph
│   ├── state.py                       ← Shared OnboardingState TypedDict
│   ├── llm_config.py                  ← Centralised Ollama LLM config
│   ├── audit_logger.py                ← Structured JSONL audit trail
│   ├── memory_manager.py              ← ChromaDB + in-memory agent memory
│   │
│   ├── agents/
│   │   ├── data_capture/              ← Conversational data collection
│   │   ├── doc_verification/          ← PAN / Aadhaar / Selfie orchestration
│   │   ├── aml/                       ← AML screening + mock DB + scoring
│   │   ├── fraud_check/               ← 4-layer fraud scoring (rules + LLM)
│   │   └── decision/                  ← LLM adjudication · OTP · JWT activation
│   │
│   ├── core/
│   │   ├── database.py                ← PostgreSQL (SQLAlchemy)
│   │   ├── redis_client.py            ← Redis async client
│   │   ├── chroma_memory.py           ← ChromaDB vector store
│   │   ├── http_client_pool.py        ← Shared httpx connection pool
│   │   └── mongodbase.py              ← MongoDB connection
│   │
│   ├── models/                        ← SQLAlchemy ORM models
│   ├── schemas/                       ← Pydantic request/response models
│   └── requirements.txt
│
├── 🎨 AccuEntry_Frontend/             ← Customer-facing React app
│   ├── src/
│   │   ├── App.jsx                    ← Routes: / and /open-account
│   │   ├── pages/
│   │   │   ├── HomePage.jsx           ← Bank landing page
│   │   │   └── OpenAccountPage.jsx    ← Account opening + chatbot
│   │   └── components/
│   │       ├── ChatWindow/            ← Main chat interface
│   │       ├── ChatBotWidget/         ← Floating chatbot widget
│   │       └── common/                ← Shared UI components
│   └── package.json                   ← React 19, Vite 7
│
├── 🔬 AccuEntry_Verify/               ← Document verification microservice
│   ├── main.py                        ← FastAPI: OCR, face match, video KYC
│   └── app/
│       ├── face_service.py            ← DeepFace face comparison
│       ├── ocr_service.py             ← Tesseract OCR extraction
│       ├── pan_service.py             ← PAN-specific parsing
│       ├── identity_verify.py         ← End-to-end identity verification
│       └── webrtc_service.py          ← WebRTC video stream handler
│
└── 📋 HITL_2/                         ← Human-in-the-Loop compliance dashboard
    └── src/
        ├── App.jsx                    ← Dashboard layout + case table
        └── components/
            ├── Sidebar.jsx
            ├── Table.jsx              ← Case listing
            └── Topbar.jsx
```

<br/>

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Purpose |
|:---:|:---:|---|
| ![Python](https://img.shields.io/badge/-Python-3776AB?logo=python&logoColor=white&style=flat-square) | `3.11+` | Backend runtime |
| ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=nodedotjs&logoColor=white&style=flat-square) | `18+` | Frontend build tooling |
| ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=flat-square) | `15+` | Customer data storage |
| ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square) | `6+` | KYC document storage |
| ![Redis](https://img.shields.io/badge/-Redis-DC382D?logo=redis&logoColor=white&style=flat-square) | `7+` | Session state management |
| ![Ollama](https://img.shields.io/badge/-Ollama-000000?logo=ollama&logoColor=white&style=flat-square) | `latest` | Local LLM inference |
| ![Tesseract](https://img.shields.io/badge/-Tesseract_OCR-3DDC84?style=flat-square) | `5+` | Document text extraction |

<br/>

### 1 · Clone the Repository

```bash
git clone https://github.com/your-org/accuentry.git
cd accuentry
```

### 2 · Set Up Ollama (Local LLM)

```bash
# Install Ollama → https://ollama.com/download
ollama pull llama3.2        # Primary model: data capture, AML, decision
ollama serve                # Starts server on port 11434
```

### 3 · Start the Backend

```bash
cd AccuEntry_Backend

# Virtual environment
python -m venv venv
source venv/bin/activate          # macOS/Linux
# venv\Scripts\activate           # Windows

pip install -r requirements.txt

cp .env.example .env              # Edit with your credentials

uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
> API available at `http://localhost:8000`

### 4 · Start AccuVerify (Document Service)

```bash
cd AccuEntry_Verify

python -m venv env
source env/bin/activate           # macOS/Linux

pip install -r requirements.txt
cp .env.example .env

uvicorn main:app --host 127.0.0.1 --port 9000 --reload
```
> Document service at `http://localhost:9000`

### 5 · Start the Frontend

```bash
cd AccuEntry_Frontend
npm install
npm run dev
```
> App running at `http://localhost:5173`

### 6 · Start the HITL Dashboard *(optional)*

```bash
cd HITL_2
npm install
npm run dev
```
> Compliance dashboard at `http://localhost:5174`

<br/>

---

## ⚙️ Environment Variables

### `AccuEntry_Backend/.env`

```env
# ── Databases ──────────────────────────────────────────
REDIS_URL=redis://localhost:6379/0
DB_HOST=localhost
DB_PORT=5432
DB_NAME=accuentry_db
DB_USER=postgres
DB_PASSWORD=your_password

# ── Services ───────────────────────────────────────────
ACCUVERIFY_URL=http://127.0.0.1:9000
FRONTEND_URL=http://127.0.0.1:5173

# ── LLM ────────────────────────────────────────────────
OLLAMA_MODEL=llama3.2
OLLAMA_BASE_URL=http://localhost:11434

# ── Auth & Email ───────────────────────────────────────
JWT_SECRET_KEY=your_jwt_secret
RESEND_API_KEY=your_resend_key

# ── Agent Memory ───────────────────────────────────────
AGENT_MEMORY_PROVIDER=chroma               # chroma | memory
CHROMA_COLLECTION_PREFIX=accuentry
CHROMA_EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2
CHROMA_PERSIST_DIR=./.chroma
AGENT_MEMORY_WRITE_ENABLED=true
AGENT_MEMORY_RETRIEVAL_ENABLED=true
AGENT_MEMORY_REWARD_RERANK_ENABLED=true
AGENT_MEMORY_REWARD_ALPHA=0.8              # Similarity weight
AGENT_MEMORY_REWARD_BETA=0.2              # Outcome reward weight
```

### `AccuEntry_Verify/.env`

```env
REDIS_URL=redis://localhost:6379/0
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/accuentry
```

### `HITL_2/.env`

```env
VITE_BACKEND_URL=http://127.0.0.1:8000
```

<br/>

---

## 📡 API Overview

### 💬 Chat & Onboarding

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/chat` | Send message; returns agent response + state |
| `GET` | `/session/{id}` | Retrieve session state |
| `PUT` | `/session/{id}` | Update session details manually |

### 🪪 KYC Document Upload *(proxied to AccuVerify)*

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/kyc/pan` | Upload PAN card image for OCR |
| `POST` | `/kyc/aadhaar` | Upload Aadhaar card image for OCR |
| `POST` | `/kyc/selfie` | Upload selfie for face matching |
| `POST` | `/kyc/video-kyc` | Upload video for liveness detection |
| `POST` | `/kyc/approve` | Trigger agent-level KYC approval |

### 👮 HITL Compliance Dashboard

| Method | Endpoint | Description |
|:---:|---|---|
| `GET` | `/hitl/cases` | List all onboarding cases for review |
| `GET` | `/hitl/summary` | Aggregate dashboard statistics |

### 🔬 AccuVerify Service *(Port 9000)*

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/upload-pan` | PAN OCR + database validation |
| `POST` | `/upload-aadhaar` | Aadhaar OCR + database validation |
| `POST` | `/upload-selfie` | Selfie vs. ID face comparison |
| `POST` | `/upload-video-kyc` | Video liveness verification |
| `POST` | `/agent/approve-kyc` | Agent-triggered KYC approval |
| `POST` | `/agent/reject-kyc` | Agent-triggered KYC rejection |
| `GET` | `/agent/pending-kyc` | List pending agent reviews |

<br/>

<div align="center">

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│     Built with ❤️  by the AccuEntry Team                │
│     Reimagining account onboarding with AI agents       │
│                                                         │
│     🏦  Smarter Banking Starts Here                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**[⬆ Back to top](#-accuentry)**

</div>
