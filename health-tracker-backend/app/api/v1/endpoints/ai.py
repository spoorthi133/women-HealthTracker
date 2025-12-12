# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List

# from app.core.database import get_db
# from app.api.deps import get_current_user
# from app.models.models import User, AIInsight
# from app.schemas.ai import (
#     AIAnalysisRequest,
#     AIQuestionRequest,
#     AIInsightResponse,
#     AIAnalysisResponse,
#     AIQuestionResponse,
#     AICyclePredictionResponse
# )
# from app.services.ai_service_gemini import ai_service

# router = APIRouter(prefix="/ai", tags=["AI"])


# @router.post("/analyze", response_model=AIAnalysisResponse)
# async def analyze_health_data(
#     request: AIAnalysisRequest,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     try:
#         insight = await ai_service.analyze_health_data(
#             db=db,
#             user_id=current_user.id,
#             days=request.days,
#             analysis_type=request.analysis_type
#         )
#         return {"insight": insight}
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=str(e)
#         )


# @router.post("/ask", response_model=AIQuestionResponse)
# async def ask_ai_question(
#     request: AIQuestionRequest,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     try:
#         answer = await ai_service.ask_question(
#             db=db,
#             user_id=current_user.id,
#             question=request.question
#         )
#         return {
#             "question": request.question,
#             "answer": answer
#         }
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=str(e)
#         )


# @router.get("/insights", response_model=List[AIInsightResponse])
# def get_insights(
#     skip: int = 0,
#     limit: int = 20,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     return (
#         db.query(AIInsight)
#         .filter(AIInsight.user_id == current_user.id)
#         .order_by(AIInsight.created_at.desc())
#         .offset(skip)
#         .limit(limit)
#         .all()
#     )


# @router.get("/predict-cycle", response_model=AICyclePredictionResponse)
# async def predict_next_cycle(
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     try:
#         return await ai_service.predict_next_cycle(
#             db=db,
#             user_id=current_user.id
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, AIInsight
from app.schemas.ai import (
    AIAnalysisRequest,
    AIQuestionRequest,
    AIInsightResponse,
    AIAnalysisResponse,
    AIQuestionResponse,
    AICyclePredictionResponse,
)
from app.services.ai_service_gemini import ai_service

router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/analyze", response_model=AIAnalysisResponse)
async def analyze_health_data(
    request: AIAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        insight = await ai_service.analyze_health_data(
            db=db,
            user_id=current_user.id,
            days=request.days,
            analysis_type=request.analysis_type,
        )
        return {"insight": insight, "stored_insight_id": None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ask", response_model=AIQuestionResponse)
async def ask_ai_question(
    request: AIQuestionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        answer = await ai_service.ask_question(
            db=db,
            user_id=current_user.id,
            question=request.question,
        )
        return {"question": request.question, "answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/insights", response_model=List[AIInsightResponse])
def get_insights(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(AIInsight)
        .filter(AIInsight.user_id == current_user.id)
        .order_by(AIInsight.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/predict-cycle", response_model=AICyclePredictionResponse)
async def predict_next_cycle(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return await ai_service.predict_next_cycle(db=db, user_id=current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
