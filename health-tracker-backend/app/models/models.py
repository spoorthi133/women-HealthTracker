from sqlalchemy import (
    Column,
    String,
    Integer,
    DateTime,
    Date,
    Boolean,
    Text,
    DECIMAL,
    ARRAY,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    symptom_logs = relationship("SymptomLog", back_populates="user")
    ai_insights = relationship("AIInsight", back_populates="user")
    cycles = relationship("Cycle", back_populates="user")
    settings = relationship("UserSettings", back_populates="user", uselist=False)
    cycles = relationship(
    "Cycle",
    back_populates="user",
    cascade="all, delete-orphan"
)

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)

    date_of_birth = Column(Date)
    height_cm = Column(Integer)
    weight_kg = Column(DECIMAL(5, 2))
    diagnosed_conditions = Column(ARRAY(String))

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="profile")


class SymptomLog(Base):
    __tablename__ = "symptom_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    log_date = Column(Date, nullable=False)

    notes = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="symptom_logs")

    __table_args__ = (
        UniqueConstraint("user_id", "log_date", name="unique_user_log_date"),
    )


class AIInsight(Base):
    __tablename__ = "ai_insights"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    title = Column(String(255))
    content = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="ai_insights")


# class Cycle(Base):
#     __tablename__ = "cycles"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

#     user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

#     last_period_date = Column(Date, nullable=False)
#     cycle_length = Column(Integer, nullable=False)    # gap between periods
#     period_length = Column(Integer, nullable=False)   # bleeding days

#     user = relationship("User", back_populates="cycles")

# class Cycle(Base):
#     __tablename__ = "cycles"

#     id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

#     cycle_start_date = Column(Date, nullable=False)   # ✅ FIXED
#     cycle_length = Column(Integer, nullable=False, default=28)
#     period_length = Column(Integer, nullable=False, default=5)

#     created_at = Column(DateTime(timezone=True), server_default=func.now())

#     user = relationship("User", back_populates="cycles")

class Cycle(Base):
    __tablename__ = "cycles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    last_period_date = Column(Date, nullable=False)
    cycle_length = Column(Integer, nullable=False)
    period_length = Column(Integer, nullable=False)

    user = relationship("User", back_populates="cycles")



class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), primary_key=True)
    reminder_enabled = Column(Boolean, default=True)

    user = relationship("User", back_populates="settings")
