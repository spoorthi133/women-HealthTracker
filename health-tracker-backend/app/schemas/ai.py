from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID


class AIAnalysisRequest(BaseModel):
    days: int = Field(default=30, ge=1, le=365, description="Number of days to analyze")
    analysis_type: Literal["comprehensive", "patterns", "trends"] = Field(
        default="comprehensive",
        description="Type of analysis to perform"
    )


class AIQuestionRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=500, description="Your health question")


class AIInsightResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class AIAnalysisResponse(BaseModel):
    insight: str
    stored_insight_id: Optional[UUID] = None


class AIQuestionResponse(BaseModel):
    question: str
    answer: str


class AICyclePredictionResponse(BaseModel):
    predicted_start_date: Optional[str]
    average_cycle_length: Optional[float]
    confidence: Optional[str]
    analysis: str
    message: Optional[str] = None

class AIAsk(BaseModel):
    question: str


class AIAnalyze(BaseModel):
    days: Optional[int] = 60

