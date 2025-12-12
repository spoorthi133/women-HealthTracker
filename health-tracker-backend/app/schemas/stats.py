from pydantic import BaseModel
from typing import Optional
from datetime import date


class AverageCycleResponse(BaseModel):
    average_cycle_length_days: Optional[float]


class LastCycleResponse(BaseModel):
    cycle_start_date: date
    cycle_end_date: Optional[date]


class SymptomsSummaryResponse(BaseModel):
    total_logs: int
