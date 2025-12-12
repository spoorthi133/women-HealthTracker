from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, Cycle
from pydantic import BaseModel

router = APIRouter(prefix="/cycles", tags=["Cycles"])


# ==================== SCHEMAS ====================

class CycleCreate(BaseModel):
    cycle_start_date: date
    cycle_length: int = 28
    period_length: int = 5


class CycleResponse(BaseModel):
    id: UUID
    user_id: UUID
    cycle_start_date: date
    cycle_length: int
    period_length: int

    class Config:
        from_attributes = True


# ==================== ROUTES ====================

@router.get("/", response_model=List[CycleResponse])
def get_cycles(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycles = (
        db.query(Cycle)
        .filter(Cycle.user_id == current_user.id)
        .order_by(Cycle.last_period_date.desc())
        .all()
    )

    # ✅ Map DB → Frontend format
    return [
        CycleResponse(
            id=c.id,
            user_id=c.user_id,
            cycle_start_date=c.last_period_date,
            cycle_length=c.cycle_length,
            period_length=c.period_length,
        )
        for c in cycles
    ]


# @router.post("/", response_model=CycleResponse, status_code=status.HTTP_201_CREATED)
# def create_cycle(
#     cycle_data: CycleCreate,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     cycle = Cycle(
#         user_id=current_user.id,
#         last_period_date=cycle_data.cycle_start_date,  # ✅ CRITICAL FIX
#         cycle_length=cycle_data.cycle_length,
#         period_length=cycle_data.period_length,
#     )

#     db.add(cycle)
#     db.commit()
#     db.refresh(cycle)

#     return CycleResponse(
#         id=cycle.id,
#         user_id=cycle.user_id,
#         cycle_start_date=cycle.last_period_date,
#         cycle_length=cycle.cycle_length,
#         period_length=cycle.period_length,
#     )

@router.post("/", response_model=CycleResponse, status_code=201)
def create_cycle(
    cycle_data: CycleCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycle = Cycle(
        user_id=current_user.id,
        last_period_date=cycle_data.cycle_start_date,  
        cycle_length=cycle_data.cycle_length,
        period_length=cycle_data.period_length,
    )

    db.add(cycle)
    db.commit()
    db.refresh(cycle)

    return CycleResponse(
        id=cycle.id,
        user_id=cycle.user_id,
        cycle_start_date=cycle.last_period_date,
        cycle_length=cycle.cycle_length,
        period_length=cycle.period_length,
    )


@router.delete("/{cycle_id}")
def delete_cycle(
    cycle_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cycle = (
        db.query(Cycle)
        .filter(
            Cycle.id == cycle_id,
            Cycle.user_id == current_user.id,
        )
        .first()
    )

    if not cycle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cycle not found",
        )

    db.delete(cycle)
    db.commit()
    return {"message": "Cycle deleted successfully"}
