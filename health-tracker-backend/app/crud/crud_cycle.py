from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.models.models import Cycle
from app.schemas.cycle import CycleCreate


def create_cycle(
    db: Session,
    *,
    user_id: UUID,
    cycle_in: CycleCreate,
) -> Cycle:
    cycle = Cycle(
        user_id=user_id,
        cycle_start_date=cycle_in.cycle_start_date,
        cycle_end_date=cycle_in.cycle_end_date,
    )
    db.add(cycle)
    db.commit()
    db.refresh(cycle)
    return cycle


def get_cycles_by_user(
    db: Session,
    *,
    user_id: UUID,
) -> List[Cycle]:
    return (
        db.query(Cycle)
        .filter(Cycle.user_id == user_id)
        .order_by(Cycle.cycle_start_date.desc())
        .all()
    )
