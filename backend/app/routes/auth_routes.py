"""Mocked authentication: log in with an email; unknown emails auto-register."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=schemas.UserOut)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        # Auto-register: mocked identity, per assignment real auth is simplified.
        name = (payload.name or payload.email.split("@")[0]).strip() or "Guest"
        avatar_seed = payload.email.split("@")[0]
        user = models.User(
            name=name,
            email=payload.email,
            avatar_url=f"https://i.pravatar.cc/150?u={avatar_seed}",
            is_host=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
