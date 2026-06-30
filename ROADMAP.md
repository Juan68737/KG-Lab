# KG Lab — Product Roadmap

How the curriculum, the two interactive modes, and the compute architecture fit together.
This is the reference for what we're building and why. UI styling lives in `DESIGN_SYSTEM.md`.

---

## 1. The two modes — Playground vs Agent mode

Every lesson has the same tabs (Overview / Playground / Agent mode / Papers / Code). The two
interactive tabs answer different questions:

| | **Playground** | **Agent mode** |
| --- | --- | --- |
| Who drives | **You** | **An LLM agent** |
| What you do | Manipulate the algorithm directly — sliders, drop a query, toggle params | Give the agent a goal in natural language |
| What you watch | The mechanism (how the algorithm behaves) | The agent's reasoning + tool calls streaming |
| Question answered | "How does this algorithm work?" | "Why does an AI system reach for it, and how does it use it?" |
| Scope | One technique, in isolation, manual | The technique as a **tool** inside an agent loop |

**Example (HNSW):**
- *Playground* — slide `M`/`ef`, drop a query point, watch the greedy descent find neighbors.
- *Agent mode* — type "find papers like X in under 50ms"; the agent calls `vector_search`, sees
  recall is low, bumps `ef`, retries, returns results and explains.

Playground is the microscope on each piece. Agent mode is where the pieces become an agent's
toolkit. This is the whole point of the site: **KG + Agents**.

### The unifying idea: a progressive tool belt

Agent mode is **one agent loop** across the whole curriculum. Each module hands the agent a new
tool. The KG is the agent's memory/knowledge substrate; each module adds a way to read, write, or
reason over it. By Module 5 the agent holds the entire toolkit — that progression *is* "how KG and
agents combine."

| Module | Tool the agent gains |
| --- | --- |
| 0 Foundations | *(reasoning only — baseline)* |
| 1 Vector Retrieval | `vector_search` |
| 2 Graph Construction | `entity_extract`, `graph_write` |
| 3 Graph ML | `pagerank`, `community`, `neighbors` |
| 4 Hybrid Retrieval | `hybrid_retrieve`, `rerank` |
| 5 Agentic + Research | `traverse`, `community_summary`, `temporal_filter` → full GraphRAG agent |

---

## 2. The shared corpus (the spine)

One dataset flows through all six modules: **~300–500 arXiv ML-paper abstracts on one sub-topic**
(rich entities: methods, authors, datasets, tasks; real multi-hop questions).

- Module 1 **indexes** it for vector search.
- Module 2 **extracts a KG** from it (entities + relations).
- Module 3 **analyzes** that KG (communities, centrality).
- Module 4 **retrieves** over both text and graph.
- Module 5's agent **answers** hard questions over the whole thing.

Same data visibly transforming from text → vectors → graph → answers is the through-line. It's why
the agent's tools stack instead of being six disconnected demos.

---

## 3. Compute architecture — Python backend + React client

The field is Python; the app is React/TS. **Decision (locked):** real ML/NLP/KG work runs in a
**Python FastAPI backend** using the actual libraries (spaCy, sentence-transformers, networkx,
faiss, …). Playgrounds are **thin React clients** that call the API — the frontend never bundles ML.
We chose real Python over hand-rolled JS so demos are honest, not toys. JS is kept only for **light
visualization** (SVG graphs, layout, the bits with no real algorithm to fake).

| Layer | Role | Tech | Where |
| --- | --- | --- | --- |
| **Frontend** | UI + light viz | React/TS, SVG | Browser (Vercel) |
| **Backend** | Real ML/NLP/KG + (later) agent loop | **Python FastAPI** + uv: spaCy, sentence-transformers, networkx, faiss, Claude API | `localhost:8000` in dev; hosted service in prod |
| **Reference** | The "truth" shown in the Code tab | The same Python library code | Code tab |

Endpoints so far: `POST /api/extract` (spaCy NER + dependency relations), `POST /api/embed`
(sentence-transformers vectors). Dev: Vite proxies `/api` → `:8000` (`just up` runs both).

- **Why a backend, not JS-in-browser:** real spaCy/faiss/sentence-transformers beat JS ports; the
  agent loop needs a server anyway (Claude API key). One backend serves both playgrounds and agents.
- **Runtime:** `uv` pins Python 3.12 (system Python is 3.14, which lacks some ML wheels). Models
  lazy-load on first request so the server boots instantly.
- **Deploy (later):** containerize the backend (python:3.12) → Railway/Render/Fly; frontend on
  Vercel pointing at the API URL via an env var.

### Per-technique backend map

| Technique | Backend library |
| --- | --- |
| Embeddings | sentence-transformers (`all-MiniLM-L6-v2`) — **live** |
| NER + relation extraction | spaCy (`en_core_web_sm`) — **live** |
| Flat kNN, IVF, HNSW, quantization | faiss |
| BM25 / RRF | rank_bm25 + numpy |
| Node2Vec, Louvain/Leiden, PageRank, centrality | networkx |
| GNNs, ColBERT | PyTorch / colbert-ai |
| GraphRAG / KG-RAG / agent loop | Python agent + Claude API |

---

## 4. Curriculum — playground + agent per module

| Module | Playground (in-browser) | Agent-mode scene |
| --- | --- | --- |
| **0 Foundations** | Triple builder (sentence → nodes/edges, RDF ↔ property toggle); live cosine/dot/L2 on two phrases + 2D scatter; chunk + extract a pasted paragraph | Agent describes the pipeline & picks storage for a workload |
| **1 Vector Retrieval** | Flat kNN scatter (show the O(n)); IVF Voronoi cells + `nprobe` slider; HNSW layered-graph descent + `M`/`ef` sliders; PQ reconstruction-error slider | Agent tunes the index to a latency budget, reports recall |
| **2 Graph Construction** | Mentions → canonical nodes; entity-resolution clustering w/ threshold slider; relation edges w/ confidence; typed vs untyped schema | Agent ingests a doc and **builds** the KG, resolving duplicates |
| **3 Graph ML** | Node2Vec random-walk animation (`p`/`q` sliders); Louvain/Leiden communities + modularity; PageRank/betweenness heatmap; hide-an-edge link prediction; GNN message-passing animation | Agent uses centrality/communities to decide what to retrieve |
| **4 Hybrid Retrieval** | BM25 vs dense side-by-side; RRF fusion with weight sliders; cross-encoder rerank score deltas; Matryoshka dim-truncation recall curve; ColBERT token×token heatmap | Agent composes a retrieval stack for a query type, evaluates |
| **5 Agentic + Research** | GraphRAG local vs global (community summaries, map-reduce); KG-RAG traversal path; multi-hop edge chaining; temporal time-slider; eval harness (P@k, nDCG, faithfulness) | Full GraphRAG agent answers a hard question, tool calls visible |

### Lessons per module

- **0 Foundations:** What is a knowledge graph · Embeddings 101 · Text → structure · Where it lives
- **1 Vector Retrieval:** Flat / brute-force kNN · IVF index · HNSW · Quantization & precision
- **2 Graph Construction:** Entity extraction & linking · Entity resolution / dedup · Relation
  extraction · Schema & ontology design
- **3 Graph ML:** Node embeddings (Node2Vec) · Community detection (Louvain/Leiden) · Centrality &
  ranking · Link prediction · GNNs (intro)
- **4 Hybrid Retrieval:** Sparse + dense · Fusion (RRF) · Reranking · Matryoshka embeddings ·
  ColBERT / late interaction
- **5 Agentic + Research:** GraphRAG · KG-RAG · Multi-hop reasoning · Temporal KGs · Evaluation

---

## 5. Data model

Each lesson is a row; the tabs are its facets. Sidebar groups = Modules 0–5.

```ts
type LessonStatus = 'done' | 'active' | 'new' | 'locked'
interface Lesson { id, label, icon, status }
interface Module { number, title, lessons: Lesson[] }
```

Per-lesson content (`{ overview, playground, agent, papers, code }`) will be data-driven so the
tabs render from data instead of hard-coded components (currently only HNSW Overview is built).

---

## 6. Build phases (small commits per phase)

- **Phase 7 — Roadmap & data (Module 0 scope):** this doc; restructure `modules.ts` into Modules
  0–5; **Module 0 unlocked, Modules 1–5 locked**; build Module 0's four Overview lessons; sidebar +
  content panel render the new shape. *(current — branch `jhonathan/module-0`)*
- **Phase 8 — Playground framework:** a shared `Playground` shell + the in-browser compute layer
  (embeddings via transformers.js, graph algos via graphology). Build **M1 HNSW** end-to-end as the
  pattern.
- **Phase 9 — Playgrounds 0–4:** replicate the pattern across the remaining browser-runnable
  lessons; wire the shared arXiv corpus.
- **Phase 10 — Agent backend:** stand up the agent loop + KG tools (Claude API); Agent-mode tab
  streams reasoning/tool calls. Progressive tool belt per module.
- **Phase 11 — Code/Papers + polish:** real Python in the Code tab; references in Papers; eval
  harness; optional Pyodide for M0/M3.
