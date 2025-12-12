from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.models import User
from app.schemas.stats import (
    AverageCycleResponse,
    LastCycleResponse,
    SymptomsSummaryResponse,
)
from app.crud.crud_stats import (
    get_average_cycle_length,
    get_last_cycle,
    get_symptoms_summary,
)

router = APIRouter()


@router.get("/average-cycle", response_model=AverageCycleResponse)
def average_cycle(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    avg = get_average_cycle_length(db=db, user_id=current_user.id)
    return {"average_cycle_length_days": avg}


@router.get("/last-cycle", response_model=LastCycleResponse | None)
def last_cycle(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_last_cycle(db=db, user_id=current_user.id)


@router.get("/symptoms-summary", response_model=SymptomsSummaryResponse)
def symptoms_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    total = get_symptoms_summary(db=db, user_id=current_user.id)
    return {"total_logs": total}
