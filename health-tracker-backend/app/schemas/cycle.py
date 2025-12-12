from pydantic import BaseModel
from datetime import date
from typing import List
from uuid import UUID


class CycleCreate(BaseModel):
    cycle_start_date: date
    cycle_length: int = 28
    period_length: int = 5



class CycleResponse(BaseModel):
    id: UUID
    last_period_date: date
    cycle_length: int
    period_length: int

    class Config:
        from_attributes = True


class CyclePrediction(BaseModel):
    next_period: date
    upcoming_periods: List[date]
    is_irregular: bool
