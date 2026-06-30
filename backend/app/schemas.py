"""Pydantic request/response models for the KG Lab API."""

from pydantic import BaseModel


# ---- /api/extract ----

class ExtractRequest(BaseModel):
    text: str


class Entity(BaseModel):
    text: str
    label: str  # spaCy entity label, e.g. PERSON, ORG, PRODUCT


class Relation(BaseModel):
    subj: str
    rel: str
    obj: str


class ExtractResponse(BaseModel):
    sentences: list[str]
    entities: list[Entity]
    relations: list[Relation]


# ---- /api/embed ----

class EmbedRequest(BaseModel):
    texts: list[str]


class EmbedResponse(BaseModel):
    model: str
    dim: int
    vectors: list[list[float]]
