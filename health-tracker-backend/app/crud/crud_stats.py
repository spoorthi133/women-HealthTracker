from sqlalchemy.orm import Session
from sqlalchemy import func
from uuid import UUID

from app.models.models import Cycle, SymptomLog


def get_average_cycle_length(db: Session, *, user_id: UUID):
    return (
        db.query(func.avg(func.date_part("day", Cycle.cycle_end_date - Cycle.cycle_start_date)))
        .filter(
            Cycle.user_id == user_id,
            Cycle.cycle_end_date.isnot(None),
        )
        .scalar()
    )


def get_last_cycle(db: Session, *, user_id: UUID):
    return (
        db.query(Cycle)
        .filter(Cycle.user_id == user_id)
        .order_by(Cycle.cycle_start_date.desc())
        .first()
    )


def get_symptoms_summary(db: Session, *, user_id: UUID):
    total = (
        db.query(func.count(SymptomLog.id))
        .filter(SymptomLog.user_id == user_id)
        .scalar()
    )
    return total
