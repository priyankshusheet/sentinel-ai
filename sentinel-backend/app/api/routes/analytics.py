from fastapi import APIRouter
from app.api.models import AnalyzedPrompt, BrandMention

router = APIRouter()

@router.get("/prompt-rank", response_model=AnalyzedPrompt)
async def rank_prompt(query: str):
    # Stub implementation. Real implementation would call LLM service.
    return AnalyzedPrompt(
        query=query,
        mentions=[
            BrandMention(source="ChatGPT", sentiment=0.8, context="Top recommendation"),
            BrandMention(source="Claude", sentiment=0.5, context="Mentioned as alternative"),
            BrandMention(source="Perplexity", sentiment=0.9, context="Primary source citation")
        ],
        visibility_score=85.0
    )

@router.get("/sentiment-tracker")
async def sentiment_tracker(brand: str):
    return {
        "brand": brand,
        "overall_sentiment": "Positive",
        "score": 0.78
    }
