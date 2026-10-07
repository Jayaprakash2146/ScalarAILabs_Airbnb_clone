"""Simplified mocked auth.

Real identity verification is out of scope (per assignment). A user is
"authenticated" by their email; unknown emails are auto-registered as guests.
The frontend stores the logged-in user id and sends it via the X-User-Id
header. Hosts are promoted to host on demand when they create a listing.
"""
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from . import models
from .database import get_db


def _email_header(email: str | None) -> str:
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in.",
        )
    return email


def get_current_user(
    x_user_email: str | None = Header(default=None, alias="X-User-Email"),
    db: Session = Depends(get_db),
) -> models.User:
    """Resolve the caller from the X-User-Email header (mocked session)."""
    email = _email_header(x_user_email)
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unknown user. Please log in again.",
        )
    return user


def get_optional_user(
    x_user_email: str | None = Header(default=None, alias="X-User-Email"),
    db: Session = Depends(get_db),
) -> models.User | None:
    """Same as get_current_user but returns None instead of 401."""
    if not x_user_email:
        return None
    return (
        db.query(models.User)
        .filter(models.User.email == x_user_email)
        .first()
    )
