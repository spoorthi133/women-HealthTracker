from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import Optional
from uuid import UUID
from app.models.models import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password

def get_user_by_id(db: Session, user_id: UUID) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user_in: UserCreate) -> User:
    """Create new user"""
    db_user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password)
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise ValueError("User with this email already exists")

def authenticate(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def update_user(db: Session, user_id: UUID, user_in: UserUpdate) -> Optional[User]:
    """Update user"""
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    
    update_data = user_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    db.commit()
    db.refresh(user)
    return user

def update_password(db: Session, user_id: UUID, new_password: str) -> bool:
    """Update user password"""
    user = get_user_by_id(db, user_id)
    if not user:
        return False
    
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return True