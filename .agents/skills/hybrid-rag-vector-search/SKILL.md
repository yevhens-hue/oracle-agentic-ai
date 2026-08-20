---
name: hybrid-rag-vector-search
description: Production RAG & Hybrid Vector Search Architecture. Covers document chunking strategies, dense embedding generation, sparse BM25 keyword search, Hybrid Search with Reciprocal Rank Fusion (RRF), Cross-Encoder Re-ranking, and LLM context window augmentation.
---

# 🔍 Hybrid RAG & Vector Search Architecture

Retrieval-Augmented Generation (RAG) grounds LLM responses in real-time, private domain data. **Hybrid RAG** combines dense vector (semantic) search with sparse keyword (BM25) search to maximize precision and recall.

---

## 🏗️ End-to-End Hybrid RAG Pipeline

```
Raw Documents (PDF / Markdown / DB)
       │
       ▼
[1. Extraction & Chunking] (Recursive Character / Sliding Window Overlap)
       │
       ├─────────────────────────────────┐
       ▼                                 ▼
[2A. Dense Embedding Model]       [2B. Sparse Inverted Index]
(e.g., OpenAI / Cohere / ONNX)    (BM25 / Full-Text Search)
       │                                 │
       ▼                                 ▼
[3A. Vector Cosine Distance]      [3B. Keyword Match Rank]
       │                                 │
       └────────────────┬────────────────┘
                        ▼
          [4. Reciprocal Rank Fusion (RRF)]
                        │
                        ▼
          [5. Cross-Encoder Re-ranker]
                        │
                        ▼
          [6. Augmented Context Prompt ➔ LLM]
```

---

## 1. Chunking Strategies

* **Recursive Character Chunking:** Splits text by natural boundaries (`\n\n`, `\n`, ` `, `""`) maintaining semantic coherence.
* **Sliding Window Overlap:** Ensures continuity across boundaries. Recommended parameters: `chunk_size = 500-1000 tokens`, `overlap = 10-15%`.

---

## 2. Reciprocal Rank Fusion (RRF)

Combines ranked result lists from Vector Search and Keyword Search into a unified relevance score without needing score normalization:

$$\text{RRF\_Score}(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$

Where $k \approx 60$, and $r_m(d)$ is document $d$'s rank position in search method $m$.

```python
def reciprocal_rank_fusion(vector_results, keyword_results, k=60):
    scores = {}
    
    # Process vector search results
    for rank, doc_id in enumerate(vector_results):
        scores[doc_id] = scores.get(doc_id, 0) + (1 / (k + rank + 1))
        
    # Process keyword search results
    for rank, doc_id in enumerate(keyword_results):
        scores[doc_id] = scores.get(doc_id, 0) + (1 / (k + rank + 1))
        
    # Sort documents by fused RRF score descending
    sorted_docs = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return sorted_docs
```

---

## 3. Cross-Encoder Re-Ranking

Dense vector retrieval returns top $K \approx 50$ candidates fast. A **Cross-Encoder Re-ranker** (e.g., `cohere-rerank-v3` or `bge-reranker-large`) evaluates raw text pairs `(query, document_chunk)` to pick the top $N \approx 5$ most relevant chunks.

---

## 4. Context Window Augmentation

Inject re-ranked chunks into the LLM system prompt using clear XML delimiters:

```markdown
You are a precise technical domain expert.
Use ONLY the provided context chunks below to answer the user request.
If the context does not contain enough information, state "I do not have sufficient information in the knowledge base."

<context>
[Chunk 1 - Re-rank Score: 0.94]
{chunk_1_text}

[Chunk 2 - Re-rank Score: 0.88]
{chunk_2_text}
</context>

User Query: {user_query}
```
