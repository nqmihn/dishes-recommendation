# 🍜 Dishes Recommendation — Product Chatbot AI

A menu management system with AI-powered dish recommendations. Built with two NestJS backends, a React frontend, and a full infrastructure stack orchestrated via Docker Compose.

---

## 📐 Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                      Client (FE)                         │
│                         
└────────────────────────┬─────────────────────────────────┘
                         │ HTTP
          ┌──────────────▼──────────────┐
          │        main (NestJS)         │
          │  - Products / Categories     │
          │  - Chat sessions             │
          │  - Meilisearch search        │
          └──────┬───────────┬──────────┘
                 │ RabbitMQ  │ HTTP
                 │           │
    ┌────────────▼──┐   ┌────▼─────────────────┐
    │  ai (NestJS)  │   │      Meilisearch      │
    │  - Embedding  │   │      (full-text)      │
    │  - OpenAI     │   └──────────────────────┘
    │  - pgvector   │
    └───────┬───────┘
            │
    ┌───────▼────────────────┐
    │  PostgreSQL (pgvector)  │
    │  Redis  ·  RabbitMQ     │
    └────────────────────────┘
```

---

## 📦 Repository Structure

```
.
├── docker/           # Docker Compose and service configs
│   ├── docker-compose.yml
│   └── .env.example
├── main/             # Core backend — NestJS
├── ai/               # AI backend — NestJS
└── fe/               # Frontend — React + TypeScript (AI-generated)
```

---

## 🏛️ Backend Architecture — Clean Architecture

Both `main` and `ai` follow the same **Clean Architecture** pattern, keeping business logic fully independent of frameworks, databases, and delivery mechanisms.

```
┌─────────────────────────────────────────────────────────────┐
│                        app/                                  │
│          (Delivery layer — NestJS controllers, DTOs)         │
│              HTTP controllers · Request/Response DTOs        │
├─────────────────────────────────────────────────────────────┤
│                       domain/                                │
│          (Business layer — framework-agnostic)               │
│   models/        Domain entities & value objects             │
│   usecases/      One class per use case (single purpose)     │
│   services/      Domain services (e.g. OpenAI, embedding)    │
│   repositories/  Repository interfaces (abstractions only)   │
├─────────────────────────────────────────────────────────────┤
│                        data/                                 │
│          (Infrastructure layer — TypeORM implementation)     │
│   entities/      TypeORM entity definitions                  │
│   repositories/  Concrete repository implementations        │
│   datasources/   External data sources (HTTP clients, etc.)  │
└─────────────────────────────────────────────────────────────┘
```

### Dependency rule

Dependencies only point **inward**: `app` → `domain` ← `data`. The domain layer never imports from `app` or `data`, ensuring it stays portable and fully unit-testable.

### Example — `main` / Products module

```
modules/product/
├── app/
│   └── http/
│       ├── controllers/   # ProductController — handles HTTP, delegates to usecases
│       └── dtos/          # CreateProductDto, ListProductQueryDto, …
├── domain/
│   ├── models/            # ProductModel, ProductVariantModel, …
│   ├── usecases/          # CreateProductUsecase, ListProductUsecase, …
│   ├── services/          # (domain services if needed)
│   └── repositories/      # IProductRepository (interface)
└── data/
    ├── entities/           # ProductEntity (TypeORM @Entity)
    ├── repositories/       # ProductRepository implements IProductRepository
    └── datasources/        # Raw datasource helpers
```



**Stack:** NestJS · TypeORM · PostgreSQL · Redis · Meilisearch · RabbitMQ


### Product Indexing Flow

```
main creates / updates a product
            │
            ▼
  RabbitMQ (ai-product-queue)
            │
            ▼
  ai consumes event
  → OpenAI generates a Vietnamese description
            │
            ▼
  Hugging Face produces a vector embedding
            │
            ▼
  Stored in PostgreSQL (pgvector)
```



## 🐳 Running with Docker Compose

### 1. Create the Compose `.env` file

```bash
cd docker
cp .env.example .env
```

Edit `.env` and set the required values:

```env
PROJECT_NAME=dishes-recommendation  # used as a prefix for Docker volume names

# Host-exposed ports
MAIN_PORT=36363            # core API
FE_PORT=36370              # frontend
POSTGRES_PORT=31842
MEILISEARCH_PORT=31824
RABBITMQ_DASHBOARD_PORT=36366
```

### 2. Create `.env` files for each service

```bash
# Core backend
cp main/.env.example main/.env

# AI backend — fill in the API keys below
cp ai/.env.example ai/.env
```

Open `ai/.env` and fill in the required credentials:

```env
OPENAI_API_KEY=sk-...
HF_API_TOKEN=hf_...
```

### 3. Start the full stack

```bash
cd docker
docker compose up -d
```

Or start only specific services:

```bash
# Infrastructure only
docker compose up -d postgres redis rabbitmq meilisearch

# Add the backends
docker compose up -d main ai

# Frontend
cd fe && npm install && npm run dev

```



### 4. Access the services

| Service | URL |
|---------|-----|
| Frontend | `http://localhost:<FE_PORT>` |
| Core API (Swagger) | `http://localhost:<MAIN_PORT>/api/documentation` |
| RabbitMQ Dashboard | `http://localhost:<RABBITMQ_DASHBOARD_PORT>` |
| Meilisearch | `http://localhost:<MEILISEARCH_PORT>` |
| PostgreSQL | `localhost:<POSTGRES_PORT>` |

> With the default values from `.env.example`: FE → `:5173`, API → `:36363`, RabbitMQ UI → `:36366`

---

## 🌐 Frontend

> ⚠️ **The frontend is AI-generated and is intended solely for displaying data** from the backend APIs. It is not production-ready.

**Stack:** React 19 · TypeScript · Vite · React Router · Axios · Lucide Icons

**Features:**
- Home page — product grid with search, category filter, tag filter, and pagination
- Product detail page — image gallery, variants, option groups
- Chat widget — floating chat button, AI conversation with product recommendations displayed inline (image + link to detail page)

### Environment Variable

```env
# fe/.env
VITE_API_BASE_URL=     # leave empty to use the Vite dev proxy (default)
```

The Vite dev server is pre-configured to proxy `/api/*` requests to `http://localhost:3000`, so no changes are needed when running alongside Docker.

---

## 🛠️ Tech Stack & Versions

| Component | Version |
|-----------|---------|
| Node.js | 22 (Alpine) |
| NestJS | ^11 |
| TypeORM | ^0.3 |
| PostgreSQL | 17 + pgvector |
| Redis | 8.2 |
| RabbitMQ | 4.2 |
| Meilisearch | v1.16 |
| OpenAI SDK | ^4 |
| React | 19 |
| Vite | 8 |

