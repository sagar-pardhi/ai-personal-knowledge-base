# AI Personal Knowledge Base

An AI-powered Personal Knowledge Base that allows users to upload documents and chat with them using Retrieval-Augmented Generation (RAG). The application extracts document content, generates embeddings, stores them in a vector database, and retrieves relevant context to answer user questions with streaming responses.

---

## ✨ Features

### Authentication

- User registration
- User login
- JWT authentication
- Protected routes

---

### Knowledge Bases

- Create knowledge bases
- Update knowledge bases
- Delete knowledge bases
- View all knowledge bases
- User-specific knowledge isolation

---

### Document Management

- Upload PDF documents
- Upload TXT documents
- View uploaded documents
- Delete documents
- Cloudflare R2 storage
- Background document processing

---

### AI Processing Pipeline

- PDF parsing
- Text extraction
- Intelligent chunking
- Batch embedding generation
- ChromaDB vector storage
- Background processing using BullMQ

---

### AI Chat

- Semantic vector search
- Context expansion
- Context block merging
- Prompt engineering
- OpenAI GPT integration
- Streaming responses (SSE)
- Markdown formatted answers
- Source references

---

## 🏗️ Architecture

```
                    Upload Document
                           │
                           ▼
                  Cloudflare R2 Storage
                           │
                           ▼
                     BullMQ Job Queue
                           │
                           ▼
                     Background Worker
                           │
                           ▼
                  Document Parsing
                           │
                           ▼
                      Text Chunking
                           │
                           ▼
               OpenAI Embedding Generation
                           │
                           ▼
                    Chroma Vector DB
```

Question Answering Flow

```
User Question
      │
      ▼
Generate Query Embedding
      │
      ▼
Vector Similarity Search
      │
      ▼
Context Expansion
      │
      ▼
Context Builder
      │
      ▼
Prompt Builder
      │
      ▼
OpenAI GPT
      │
      ▼
Streaming Response
```

---

# Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- React Router
- TanStack Query
- React Hook Form
- Zod
- shadcn/ui
- React Markdown
- Lucide React
- Sonner

---

## Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Multer
- BullMQ
- Redis

---

## AI Stack

- OpenAI GPT-4.1 Mini
- OpenAI Embeddings
- ChromaDB
- Retrieval Augmented Generation (RAG)

---

## Storage

- Cloudflare R2

---

# Project Structure

```
server/
│
├── src/
│   ├── lib/
│   ├── modules/
│   │   ├── auth/
│   │   ├── knowledge-bases/
│   │   ├── documents/
│   │   └── chat/
│   │
│   ├── retrieval/
│   │   ├── query-embedding.ts
│   │   ├── vector-search.service.ts
│   │   ├── context-expansion.service.ts
│   │   ├── context-builder.ts
│   │   ├── prompt-builder.ts
│   │   └── chat.service.ts
│   │
│   ├── workers/
│   ├── queue/
│   ├── storage/
│   └── utils/
│
└── prisma/
```

```
client/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── features/
│   │   ├── auth/
│   │   ├── knowledge-bases/
│   │   ├── documents/
│   │   └── chat/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   └── routes/
```

---

# Environment Variables

## Backend

```env
PORT=5000

DATABASE_URL=

JWT_SECRET=

OPENAI_API_KEY=

REDIS_URL=

CHROMA_URL=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
```

---

## Frontend

```env
VITE_API_URL=http://localhost:5000
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/sagar-pardhi/ai-personal-knowledge-base.git

cd ai-personal-knowledge-base
```

---

## Backend

```bash
cd server

pnpm install
```

Create Prisma database

```bash
pnpm prisma migrate dev
```

Generate Prisma Client

```bash
pnpm prisma generate
```

Run backend

```bash
pnpm dev
```

---

## Worker

Run the BullMQ worker

```bash
pnpm worker
```

---

## Frontend

```bash
cd client

pnpm install

pnpm dev
```

---

# API Endpoints

## Authentication

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

---

## Knowledge Bases

```
GET     /api/kbs
POST    /api/kbs
GET     /api/kbs/:id
PATCH   /api/kbs/:id
DELETE  /api/kbs/:id
```

---

## Documents

```
POST    /api/documents/upload
GET     /api/documents
GET     /api/documents/:id
DELETE  /api/documents/:id
```

---

## Chat

```
POST /api/chat
POST /api/chat/stream
```

---

# AI Pipeline

### Document Upload

- Upload PDF/TXT
- Store in Cloudflare R2

### Background Processing

- Parse document
- Clean extracted text
- Split into chunks
- Generate embeddings
- Store vectors in ChromaDB
- Save chunk metadata in PostgreSQL

### Question Answering

- Generate query embedding
- Perform vector similarity search
- Expand neighboring chunks
- Merge context blocks
- Build optimized prompt
- Stream response from OpenAI

---

# Current Features

- JWT Authentication
- Knowledge Base Management
- Document Upload
- Cloudflare R2 Integration
- BullMQ Background Jobs
- PDF Parsing
- Text Chunking
- OpenAI Embeddings
- ChromaDB Integration
- Semantic Search
- Context Expansion
- Prompt Builder
- Streaming AI Responses
- Markdown Rendering
- Source Citations

---

# Future Improvements

- DOCX Support
- OCR Support
- Image Understanding
- Hybrid Search (BM25 + Vector)
- Reranking
- Conversation History
- Multiple LLM Providers
- AI Generated Document Summaries
- Suggested Questions
- Citation Highlighting
- Syntax Highlighting
- Export Chat
- Team Workspaces

---

# Screenshots

> Add screenshots of the following pages:

- Login
- Register
- Dashboard
- Knowledge Base
- Document Upload
- AI Chat

---

# License

MIT License

---

# Author

**Sagar**

Full Stack Developer

- React
- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma
- AI / RAG Applications
- OpenAI
- ChromaDB
