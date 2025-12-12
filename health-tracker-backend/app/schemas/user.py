from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

# User Registration
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")

# User Login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Token Response
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

# User Response (without password)
class User(BaseModel):
    id: UUID
    email: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# User Update
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None

# Change Password
class PasswordChange(BaseModel):
    old_password: str
    new_password: str = Field(..., min_length=8)