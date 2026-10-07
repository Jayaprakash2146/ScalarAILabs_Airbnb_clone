"""Reviews: list for a listing, create (allowed after a completed stay)."""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas, services
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/listings/{listing_id}/reviews", tags=["reviews"])


def _serialize(r: models.Review) -> schemas.ReviewOut:
    return schemas.ReviewOut.model_validate(r)


@router.get("", response_model=list[schemas.ReviewOut])
def list_reviews(listing_id: int, db: Session = Depends(get_db)):
    listing = db.get(models.Listing, listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")
    return (
        db.query(models.Review)
        .options(joinedload(models.Review.author))
        .filter(models.Review.listing_id == listing_id)
        .order_by(models.Review.created_at.desc())
        .all()
    )


@router.post("", response_model=schemas.ReviewOut, status_code=201)
def create_review(
    listing_id: int,
    payload: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    listing = db.get(models.Listing, listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")

    # Bonus rule: only guests with a completed, confirmed stay may review.
    has_completed_stay = (
        db.query(models.Booking)
        .filter(
            models.Booking.listing_id == listing_id,
            models.Booking.guest_id == user.id,
            models.Booking.status == "confirmed",
            models.Booking.check_out <= date.today(),
        )
        .first()
    )
    if not has_completed_stay:
        raise HTTPException(403, "You can review a place after your stay is completed")

    # One review per guest per listing.
    already = (
        db.query(models.Review)
        .filter(models.Review.listing_id == listing_id, models.Review.guest_id == user.id)
        .first()
    )
    if already:
        raise HTTPException(409, "You have already reviewed this place")

    review = models.Review(
        listing_id=listing_id,
        guest_id=user.id,
        booking_id=has_completed_stay.id,
        rating=payload.rating,
        comment=payload.comment.strip(),
    )
    db.add(review)
    services.sync_listing_rating(db, listing_id)
    db.commit()
    db.refresh(review)
    return review
