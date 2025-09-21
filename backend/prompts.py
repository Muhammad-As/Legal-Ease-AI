def summary_prompt(text: str) -> str:
    return f"""
    Summarize the following legal document concisely:
    1. 5-8 bullet points for a lawyer.
    2. A simple explanation for a 15-year-old (3-5 sentences).
    Be precise and avoid redundancy.

    Text:
    {text}
    """


def combine_summaries_prompt(summaries: list[str]) -> str:
    return f"""
    You are a legal summarization expert. Combine these section summaries into one concise overall summary with:
    1) 5-8 bullet points for a lawyer
    2) A simple ELI15 explanation (3-5 sentences)
    Ensure no duplication and keep it faithful to the source.

    Section summaries:
    {chr(10).join(f"- {s}" for s in summaries)}
    """


def risks_prompt(text: str) -> str:
    return f"""
    Identify risky clauses in this legal text.
    Output strictly as a JSON array of objects (no code fences, no extra text):
    [
      {{
        "clause": "...",
        "risk_level": "LOW" | "MEDIUM" | "HIGH",
        "reason": "..."
      }}
    ]

    Text:
    {text}
    """


def qa_prompt(text: str, question: str) -> str:
    return f"""
    You are a helpful legal assistant. Based on this document, answer the user question.

    Document:
    {text}

    Question: {question}

    Answer simply and clearly.
    """


def qa_prompt_with_context(contexts: list[tuple[int, str]], question: str) -> str:
    context_str = "\n\n".join([f"[Chunk {i}]\n{c}" for i, c in contexts])
    return f"""
    You are a helpful legal assistant. Use ONLY the provided context to answer the question.
    - If the answer is not in the context, say you cannot find it.
    - Cite evidence inline using [Chunk X] markers.

    Context:
    {context_str}

    Question: {question}

    Provide a concise answer with citations like [Chunk 0].
    """
