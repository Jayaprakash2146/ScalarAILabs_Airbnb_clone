"""Simple per-user wishlist (favourites)."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/wishlist", tags=["wishlist"])


@router.get("", response_model=list[schemas.WishlistOut])
def my_wishlist(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    rows = (
        db.query(models.WishlistItem)
        .options(joinedload(models.WishlistItem.listing).joinedload(models.Listing.images))
        .filter(models.WishlistItem.user_id == user.id)
        .order_by(models.WishlistItem.created_at.desc())
        .all()
    )
    return [schemas.WishlistOut(listing=row.listing) for row in rows]


@router.post("/{listing_id}")
def toggle_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    listing = db.get(models.Listing, listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")

    existing = (
        db.query(models.WishlistItem)
        .filter(
            models.WishlistItem.user_id == user.id,
            models.WishlistItem.listing_id == listing_id,
        )
        .first()
    )
    if existing:
        db.delete(existing)
        db.commit()
        return {"wishlisted": False}
    db.add(models.WishlistItem(user_id=user.id, listing_id=listing_id))
    db.commit()
    return {"wishlisted": True}


@router.get("/ids")
def my_wishlist_ids(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    rows = db.query(models.WishlistItem.listing_id).filter(
        models.WishlistItem.user_id == user.id
    ).all()
    return {"listing_ids": [r[0] for r in rows]}
