from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from app.core.database import Base

class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    type = Column(String, nullable=False)  # analyze | chat
    input_text = Column(Text, nullable=True)
    response_text = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
