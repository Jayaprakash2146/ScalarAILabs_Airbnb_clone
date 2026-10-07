"""Shared business-logic helpers: availability checks and price breakdown."""
from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models

SERVICE_FEE_RATE = 0.14  # Airbnb-style ~14% service fee on the stay subtotal


def overlapping_booking(
    db: Session, listing_id: int, check_in: date, check_out: date
) -> models.Booking | None:
    """Return an active booking on `listing_id` that overlaps [check_in, check_out)."""
    return (
        db.query(models.Booking)
        .filter(
            models.Booking.listing_id == listing_id,
            models.Booking.status == "confirmed",
            models.Booking.check_in < check_out,
            models.Booking.check_out > check_in,
        )
        .first()
    )


def price_breakdown(listing: models.Listing, nights: int) -> dict:
    """Airbnb-style nightly x nights + cleaning + service fee breakdown."""
    subtotal = listing.price_per_night * nights
    cleaning_fee = listing.cleaning_fee if nights > 0 else 0
    service_fee = round((subtotal + cleaning_fee) * SERVICE_FEE_RATE)
    total = subtotal + cleaning_fee + service_fee
    return {
        "nights": nights,
        "nightly_price": listing.price_per_night,
        "subtotal": subtotal,
        "cleaning_fee": cleaning_fee,
        "service_fee": service_fee,
        "total": total,
    }


def sync_listing_rating(db: Session, listing_id: int) -> None:
    """Recompute the denormalised rating / reviews_count on the listing."""
    db.flush()  # ensure pending review writes are visible to the aggregate query
    result = (
        db.query(func.avg(models.Review.rating), func.count(models.Review.id))
        .filter(models.Review.listing_id == listing_id)
        .one()
    )
    avg, count = result
    listing = db.get(models.Listing, listing_id)
    if listing:
        listing.rating = round(float(avg), 2) if avg is not None else 0.0
        listing.reviews_count = int(count or 0)
