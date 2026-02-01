from pydantic import BaseModel
from typing import List, Optional

# ===== Analytics Module (The Eyes) =====
class BrandMention(BaseModel):
    source: str
    sentiment: float  # -1.0 to 1.0
    context: str

class AnalyzedPrompt(BaseModel):
    query: str
    mentions: List[BrandMention]
    visibility_score: float

# ===== Optimization Module (The Hands) =====
class SchemaAuditRequest(BaseModel):
    url: str

class SchemaIssue(BaseModel):
    type: str
    severity: str  # "high", "medium", "low"
    message: str
    recommendation: str

class SchemaAuditResult(BaseModel):
    url: str
    schemas_found: List[str]
    issues: List[SchemaIssue]
    score: float  # 0-100

class ContentGapRequest(BaseModel):
    topic: str
    current_content: Optional[str] = None

class ContentGapResult(BaseModel):
    topic: str
    missing_points: List[str]
    suggested_content: str
    priority: str  # "high", "medium", "low"

# ===== Strategy Module (The Brain) =====
class CommunityMention(BaseModel):
    platform: str
    sentiment: float
    volume: int
    trending: bool

class CommunityPulse(BaseModel):
    brand: str
    overall_sentiment: float
    mentions: List[CommunityMention]
    total_mentions: int

class AgenticReadiness(BaseModel):
    brand: str
    score: float  # 0-100
    factors: dict
    recommendations: List[str]

class RevenueImpact(BaseModel):
    visibility_score: float
    estimated_monthly_impact: float
    ai_driven_traffic: int
    citation_count: int

class ActionItem(BaseModel):
    id: str
    title: str
    priority: str  # "critical", "high", "medium", "low"
    category: str
    impact: str
    completed: bool = False
