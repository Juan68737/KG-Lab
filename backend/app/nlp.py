"""spaCy-powered extraction: sentences, named entities, and subject-verb-object
relations from the dependency parse. The model is loaded lazily on first use."""

from functools import lru_cache

import spacy

from .schemas import Entity, ExtractResponse, Relation

_SUBJECT_DEPS = {"nsubj", "nsubjpass"}
_OBJECT_DEPS = {"dobj", "attr", "dative", "oprd"}


@lru_cache(maxsize=1)
def _nlp() -> "spacy.language.Language":
    return spacy.load("en_core_web_sm")


def _phrase(token, chunk_map: dict[int, str]) -> str:
    """Prefer the noun chunk a token belongs to; fall back to the token text."""
    return chunk_map.get(token.i, token.text)


def extract(text: str) -> ExtractResponse:
    doc = _nlp()(text)

    # Map every token in a noun chunk to that chunk's text for nicer span labels.
    chunk_map: dict[int, str] = {}
    for chunk in doc.noun_chunks:
        for tok in chunk:
            chunk_map[tok.i] = chunk.text

    sentences = [s.text.strip() for s in doc.sents if s.text.strip()]

    entities = [Entity(text=ent.text, label=ent.label_) for ent in doc.ents]

    relations: list[Relation] = []
    seen: set[tuple[str, str, str]] = set()
    for token in doc:
        if token.pos_ not in ("VERB", "AUX"):
            continue
        subjects = [c for c in token.children if c.dep_ in _SUBJECT_DEPS]
        objects = [c for c in token.children if c.dep_ in _OBJECT_DEPS]
        for prep in (c for c in token.children if c.dep_ == "prep"):
            objects.extend(g for g in prep.children if g.dep_ == "pobj")

        for s in subjects:
            for o in objects:
                subj = _phrase(s, chunk_map)
                obj = _phrase(o, chunk_map)
                rel = token.lemma_
                key = (subj.lower(), rel.lower(), obj.lower())
                if subj.lower() != obj.lower() and key not in seen:
                    seen.add(key)
                    relations.append(Relation(subj=subj, rel=rel, obj=obj))

    return ExtractResponse(sentences=sentences, entities=entities, relations=relations)
