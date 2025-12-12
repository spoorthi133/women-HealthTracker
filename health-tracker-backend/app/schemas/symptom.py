from datetime import date, datetime
from uuid import UUID
from pydantic import BaseModel

class SymptomLogResponse(BaseModel):
    id: UUID
    user_id: UUID
    log_date: date
    notes: str
    created_at: datetime   # ✅ FIXED

    class Config:
        from_attributes = True
