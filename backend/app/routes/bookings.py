"""Booking endpoints: create (mocked checkout), my trips, cancel, host view."""
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas, services
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


@router.post("", response_model=schemas.BookingOut, status_code=201)
def create_booking(
    payload: schemas.BookingCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    listing = db.get(models.Listing, payload.listing_id)
    if not listing:
        raise HTTPException(404, "Listing not found")

    today = date.today()
    if payload.check_in < today:
        raise HTTPException(400, "Check-in date cannot be in the past")
    if payload.check_in >= payload.check_out:
        raise HTTPException(400, "Check-out must be after check-in")
    if payload.num_guests > listing.max_guests:
        raise HTTPException(400, f"This place allows up to {listing.max_guests} guests")

    # Overlap protection — the core availability invariant.
    if services.overlapping_booking(db, listing.id, payload.check_in, payload.check_out):
        raise HTTPException(409, "These dates are no longer available")

    nights = (payload.check_out - payload.check_in).days
    if nights < 1:
        raise HTTPException(400, "Stay must be at least one night")
    breakdown = services.price_breakdown(listing, nights)

    booking = models.Booking(
        listing_id=listing.id,
        guest_id=user.id,
        check_in=payload.check_in,
        check_out=payload.check_out,
        num_guests=payload.num_guests,
        nights=nights,
        nightly_price=breakdown["nightly_price"],
        cleaning_fee=breakdown["cleaning_fee"],
        service_fee=breakdown["service_fee"],
        total_price=breakdown["total"],
        status="confirmed",  # payment is mocked: instantly confirmed
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/mine", response_model=list[schemas.BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Booking)
        .options(joinedload(models.Booking.listing).joinedload(models.Listing.images),
                 joinedload(models.Booking.guest))
        .filter(models.Booking.guest_id == user.id)
        .order_by(models.Booking.created_at.desc())
        .all()
    )


@router.delete("/{booking_id}", response_model=schemas.Message)
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    booking = db.get(models.Booking, booking_id)
    if not booking:
        raise HTTPException(404, "Booking not found")
    if booking.guest_id != user.id:
        raise HTTPException(403, "You can only cancel your own bookings")
    booking.status = "cancelled"
    db.commit()
    return schemas.Message(detail="Booking cancelled")


@router.get("/host", response_model=list[schemas.BookingOut])
def host_bookings(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """All bookings received on listings owned by the current user."""
    return (
        db.query(models.Booking)
        .options(joinedload(models.Booking.listing).joinedload(models.Listing.images),
                 joinedload(models.Booking.guest))
        .join(models.Listing, models.Booking.listing_id == models.Listing.id)
        .filter(models.Listing.host_id == user.id)
        .order_by(models.Booking.created_at.desc())
        .all()
    )
