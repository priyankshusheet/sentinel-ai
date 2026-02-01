# Sentinel AI

Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO) platform prototype.

## Task List

- [ ] Project Setup
    - [x] Initialize Git repository (optional/implicit)
    - [x] Create Backend Directory Structure (FastAPI) <!-- id: 0 -->
    - [x] Create Frontend Directory Structure (React + Vite + Tailwind) <!-- id: 1 -->
    - [x] Configure PostgreSQL and Pinecone connection stubs <!-- id: 2 -->

- [ ] Backend Development (FastAPI)
    - [x] Setup virtual environment and requirements.txt <!-- id: 3 -->
    - [x] Create main app entry point (`main.py`) <!-- id: 4 -->
    - [ ] Define API schemas and models <!-- id: 5 -->
    - [ ] Implement Module 1: The "Eyes" (Analytics Engine) endpoints <!-- id: 6 -->
    - [ ] Implement Module 2: The "Hands" (Optimization Suite) endpoints <!-- id: 7 -->
    - [ ] Implement Module 3: The "Brain" (Strategy) endpoints <!-- id: 8 -->

- [ ] Frontend Development (React + Tailwind)
    - [ ] Setup Tailwind CSS with "Deep Navy/Charcoal" and "Electric Teal" theme <!-- id: 9 -->
    - [ ] Create Layout and Sidebar Navigation <!-- id: 10 -->
    - [ ] Build "Commander" Dashboard Home <!-- id: 11 -->
    - [ ] Implement Visibility Meter Component <!-- id: 12 -->
    - [ ] Implement Citation Node Map (Visual Graph with D3/Three.js or similar) <!-- id: 13 -->
    - [ ] Implement Revenue Impact Widget & AEO To-Do List <!-- id: 14 -->

- [ ] Integration & Testing
    - [ ] Connect Frontend to Backend APIs <!-- id: 15 -->
    - [ ] Verify RAG Logic Stubs <!-- id: 16 -->
    - [ ] Final UI/UX Polish <!-- id: 17 -->

## Implementation Plan

### Goal Description
Build a high-fidelity prototype for "SENTINEL AI," a GEO (Generative Engine Optimization) platform. The system will feature a modern React dashboard and a Python FastAPI backend to handle SEO/AEO analytics and optimization tasks.

### User Review Required
> [!IMPORTANT]
> This is a prototype build. Actual integration with live LLM APIs (OpenAI, Anthropic) and Vector Databases (Pinecone) will be architected but may use mock data for initial UI/UX demonstration if API keys are not provided.
> The "Citation Node Map" will be implemented using a graph visualization library (e.g., `react-force-graph` or `recharts` dependent on complexity).

### Proposed Changes

#### Project Structure
Root directory: `/sentinel-ai`
- `backend/`: FastAPI Python application
- `frontend/`: React Vite application

#### Backend [Python/FastAPI]
**[NEW] `backend/requirements.txt`**
Dependencies: `fastapi`, `uvicorn`, `sqlalchemy`, `pydantic`, `beautifulsoup4`, `requests`, `python-dotenv`.

**[NEW] `backend/app/main.py`**
Entry point for the API.

**[NEW] `backend/app/api/`**
- `routes/analytics.py`: Endpoints for "The Eyes" (Prompt ranking, Sentiment).
- `routes/optimization.py`: Endpoints for "The Hands" (Schema audit, Content gap).
- `routes/strategy.py`: Endpoints for "The Brain" (Community pulse, Agentic readiness).

**[NEW] `backend/app/services/`**
- `llm_service.py`: Stub/Interface for LLM interactions.
- `scraper_service.py`: Logic for parsing HTML/Schema.

#### Frontend [React/Vite/Tailwind]
**[NEW] `frontend/package.json`**
Dependencies: `react`, `react-dom`, `lucide-react`, `recharts`, `framer-motion` (for animations), `clsx`, `tailwind-merge`.

**[NEW] `frontend/tailwind.config.js`**
Configuration for "Deep Navy" (#0a192f or similar) and "Electric Teal" (#64ffda).

**[NEW] `frontend/src/components/layout/`**
- `Sidebar.tsx`: Navigation.
- `DashboardLayout.tsx`: Main wrapper.

**[NEW] `frontend/src/pages/`**
- `Dashboard.tsx`: The "Commander" view.
- `Analytics.tsx`: Detailed data views.

**[NEW] `frontend/src/components/dashboard/`**
- `VisibilityMeter.tsx`: Gauge chart.
- `CitationNodeMap.tsx`: Visual graph component.
- `RevenueWidget.tsx`: Stats display.
- `ActionList.tsx`: AEO To-Do list.

### Verification Plan

#### Automated Tests
- Backend: Run `pytest` (if added) or manual curl requests to endpoints.
- Frontend: Run `npm run dev` and verify UI renders.

#### Manual Verification
- Start Backend: `uvicorn app.main:app --reload`
- Start Frontend: `npm run dev`
- User walkthrough of the specific Dashboard features (Visibility Meter, Graph, Sidebar).