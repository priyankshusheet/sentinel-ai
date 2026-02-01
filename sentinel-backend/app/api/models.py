from pydantic import BaseModel
from typing import List, Optional

class BrandMention(BaseModel):
    source: str
    sentiment: float  # -1.0 to 1.0
    context: str

class AnalyzedPrompt(BaseModel):
    query: str
    mentions: List[BrandMention]
    visibility_score: float

class ReadabilityRequest(BaseModel):
    url: str

class ContentGapResult(BaseModel):
    topic: str
    missing_points: List[str]
    suggested_content: str
