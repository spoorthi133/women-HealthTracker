from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime
from uuid import UUID

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.models import User, SymptomLog
from pydantic import BaseModel

router = APIRouter(
    prefix="/symptom-logs",
    tags=["Symptoms"],
)

# -------------------------
# Pydantic Schemas
# -------------------------

class SymptomLogCreate(BaseModel):
    log_date: date
    notes: str


class SymptomLogUpdate(BaseModel):
    log_date: Optional[date] = None
    notes: Optional[str] = None


class SymptomLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    log_date: date
    notes: str
    created_at: Optional[datetime]  # ✅ Allow datetime from DB

    class Config:
        from_attributes = True


# -------------------------
# GET ALL SYMPTOMS (with pagination)
# -------------------------

@router.get("", response_model=List[SymptomLogResponse])
def get_symptom_logs(
    skip: int = 0,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    logs = (
        db.query(SymptomLog)
        .filter(SymptomLog.user_id == current_user.id)
        .order_by(SymptomLog.log_date.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return logs


# -------------------------
# CREATE SYMPTOM LOG
# -------------------------

@router.post("", response_model=SymptomLogResponse, status_code=status.HTTP_201_CREATED)
def create_symptom_log(
    log_data: SymptomLogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # One log per day rule
    existing = (
        db.query(SymptomLog)
        .filter(
            SymptomLog.user_id == current_user.id,
            SymptomLog.log_date == log_data.log_date,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A symptom log already exists for this date",
        )

    log = SymptomLog(
        user_id=current_user.id,
        log_date=log_data.log_date,
        notes=log_data.notes,
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


# -------------------------
# GET SINGLE SYMPTOM LOG
# -------------------------

@router.get("/{log_id}", response_model=SymptomLogResponse)
def get_symptom_log(
    log_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = (
        db.query(SymptomLog)
        .filter(
            SymptomLog.id == log_id,
            SymptomLog.user_id == current_user.id,
        )
        .first()
    )

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom log not found",
        )

    return log


# -------------------------
# UPDATE SYMPTOM LOG
# -------------------------

@router.put("/{log_id}", response_model=SymptomLogResponse)
def update_symptom_log(
    log_id: UUID,
    log_data: SymptomLogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = (
        db.query(SymptomLog)
        .filter(
            SymptomLog.id == log_id,
            SymptomLog.user_id == current_user.id,
        )
        .first()
    )

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom log not found",
        )

    update_data = log_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(log, field, value)

    db.commit()
    db.refresh(log)

    return log


# -------------------------
# DELETE SYMPTOM LOG
# -------------------------

@router.delete("/{log_id}")
def delete_symptom_log(
    log_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    log = (
        db.query(SymptomLog)
        .filter(
            SymptomLog.id == log_id,
            SymptomLog.user_id == current_user.id,
        )
        .first()
    )

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Symptom log not found",
        )

    db.delete(log)
    db.commit()

    return {"message": "Symptom log deleted successfully"}


# -------------------------
# GET TODAY'S SYMPTOM LOG
# -------------------------

@router.get("/today", response_model=SymptomLogResponse)
def get_today_log(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    today = date.today()

    log = (
        db.query(SymptomLog)
        .filter(
            SymptomLog.user_id == current_user.id,
            SymptomLog.log_date == today,
        )
        .first()
    )

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No symptom log found for today",
        )

    return log
