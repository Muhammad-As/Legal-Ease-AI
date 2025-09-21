import os
import logging
from typing import List

from dotenv import load_dotenv
import vertexai
from vertexai.generative_models import GenerativeModel, GenerationConfig

logger = logging.getLogger("legalease.llm")

_initialized = False


def _load_env() -> tuple[str | None, str, str, str]:
    """Load environment variables, including from .env if present."""
    load_dotenv()
    project = os.getenv("GOOGLE_CLOUD_PROJECT")
    location = os.getenv("GOOGLE_CLOUD_LOCATION", "us-central1")
    model_name = os.getenv("VERTEX_MODEL", "gemini-2.0-flash-001")
    embed_model_name = os.getenv("VERTEX_EMBED_MODEL", "text-embedding-004")
    return project, location, model_name, embed_model_name


def _init():
    global _initialized
    if _initialized:
        return
    project, location, _model_name, _ = _load_env()
    if not project:
        raise RuntimeError("GOOGLE_CLOUD_PROJECT not set")
    vertexai.init(project=project, location=location)
    logger.info("Vertex AI initialized (project=%s, location=%s)", project, location)
    _initialized = True


def _generate_with_model_name(model_name: str, prompt: str, gen_cfg: GenerationConfig, system: str | None):
    mdl = GenerativeModel(model_name)
    if system:
        return mdl.generate_content([prompt], generation_config=gen_cfg, system_instruction=system)
    return mdl.generate_content([prompt], generation_config=gen_cfg)


def chat(prompt: str, model: str | None = None, system: str | None = None) -> str:
    """Generate a chat response via Vertex AI Gemini.

    Args:
        prompt: The user prompt/content to generate from.
        model: Optional model override (defaults to env VERTEX_MODEL).
        system: Optional system instruction to steer responses.
    """
    _init()
    gen_cfg = GenerationConfig(temperature=0.3, max_output_tokens=512)

    # Build candidate list with caller's choice first, then env + known-good fallbacks
    _project, _location, env_model, _embed = _load_env()
    fallbacks: list[str] = [
        env_model,
        "gemini-2.0-flash-001",
        "gemini-2.0-flash-lite-001",
        "gemini-1.5-flash-002",
        "gemini-1.5-pro-002",
    ]
    candidates: list[str] = []
    if model:
        candidates.append(model)
    for m in fallbacks:
        if m and m not in candidates:
            candidates.append(m)

    def _extract_text(resp) -> str:
        text = getattr(resp, "text", None)
        if isinstance(text, str) and text.strip():
            return text.strip()
        parts: List[str] = []
        for cand in getattr(resp, "candidates", []) or []:
            content = getattr(cand, "content", None)
            if content:
                for part in getattr(content, "parts", []) or []:
                    t = getattr(part, "text", None)
                    if t:
                        parts.append(t)
        return "\n".join(parts).strip()

    last_err: Exception | None = None
    for m in candidates:
        try:
            resp = _generate_with_model_name(m, prompt, gen_cfg, system)
            out = _extract_text(resp)
            if out:
                if m != candidates[0]:
                    logger.info("Used fallback model '%s'", m)
                return out
            else:
                logger.warning("Empty response from model '%s', trying next", m)
        except Exception as e:
            last_err = e
            msg = str(e).lower()
            # Continue trying next candidate on common access/availability errors
            if any(s in msg for s in [
                "not found", "was not found", "publisher model", "permission", "access", "unsupported", "location"
            ]):
                logger.warning("Model '%s' unavailable (%s). Trying next.", m, e)
                continue
            # For other errors, break early
            break

    if last_err:
        return f"Error generating content: {last_err}"
    return "Error generating content: No available Vertex model in this project/region"


def embed(texts: List[str], model: str | None = None) -> list[list[float]]:
    """Create embeddings for a list of texts using Vertex AI text-embedding-004.
    Returns an empty list on error.
    """
    try:
        from vertexai.language_models import TextEmbeddingModel

        project, location, _model_name, embed_model = _load_env()
        if not project:
            return []
        vertexai.init(project=project, location=location)
        mdl = TextEmbeddingModel.from_pretrained(model or embed_model)
        resp = mdl.get_embeddings(texts)
        # Each item has `.values` with the vector
        return [getattr(e, "values", []) for e in resp]
    except Exception:
        return []
