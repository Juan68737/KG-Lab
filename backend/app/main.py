"""KG Lab API — NLP + embeddings (and, later, the agent loop).

Run locally:  uv run uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import embed as embed_mod
from . import nlp as nlp_mod
from .schemas import EmbedRequest, EmbedResponse, ExtractRequest, ExtractResponse

app = FastAPI(title="KG Lab API", version="0.1.0")

# The Vite dev server talks to us directly in development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/extract", response_model=ExtractResponse)
def extract(req: ExtractRequest) -> ExtractResponse:
    return nlp_mod.extract(req.text)


@app.post("/api/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest) -> EmbedResponse:
    return embed_mod.embed(req.texts)
