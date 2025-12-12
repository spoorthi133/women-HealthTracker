from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.models.models import SymptomLog
from app.schemas.symptom import SymptomCreate


def create_symptom(
    db: Session,
    *,
    user_id: UUID,
    symptom_in: SymptomCreate,
) -> SymptomLog:
    symptom = SymptomLog(
        user_id=user_id,
        log_date=symptom_in.log_date,
        notes=symptom_in.notes,
    )
    db.add(symptom)
    db.commit()
    db.refresh(symptom)
    return symptom


def get_symptoms_by_user(
    db: Session,
    *,
    user_id: UUID,
) -> List[SymptomLog]:
    return (
        db.query(SymptomLog)
        .filter(SymptomLog.user_id == user_id)
        .order_by(SymptomLog.log_date.desc())
        .all()
    )
