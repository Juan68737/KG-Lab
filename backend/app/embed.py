"""Sentence-Transformers embeddings (all-MiniLM-L6-v2). Raw (un-normalized)
vectors are returned so the client can show cosine vs dot vs L2 differing.
The model is loaded lazily on first use."""

from functools import lru_cache

from .schemas import EmbedResponse

_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def _model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(_MODEL_NAME)


def embed(texts: list[str]) -> EmbedResponse:
    model = _model()
    vectors = model.encode(texts, normalize_embeddings=False).tolist()
    dim = len(vectors[0]) if vectors else 0
    return EmbedResponse(model=_MODEL_NAME, dim=dim, vectors=vectors)
