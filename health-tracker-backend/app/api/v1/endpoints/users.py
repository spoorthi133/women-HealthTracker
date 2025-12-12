from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.user import User as UserSchema, UserUpdate
from app.crud import user as user_crud
from app.api.deps import get_current_user
from app.models.models import User

router = APIRouter()

@router.get("/")
def list_users():
    return [{"id": 1, "name": "Spoorthi"}]

@router.get("/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.put("/me", response_model=UserSchema)
def update_current_user(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user information"""
    updated_user = user_crud.update_user(db, current_user.id, user_update)
    return updated_user