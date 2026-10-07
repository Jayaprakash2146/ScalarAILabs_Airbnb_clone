"""Listing browse/search + host CRUD endpoints."""
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_, func
from sqlalchemy.orm import Session, joinedload
from .. import models, schemas, services
from ..auth import get_current_user
from ..database import get_db

router = APIRouter(prefix="/api/listings", tags=["listings"])


def get_listing_or_404(db: Session, listing_id: int) -> models.Listing:
    listing = (
        db.query(models.Listing)
        .options(joinedload(models.Listing.host), joinedload(models.Listing.images))
        .filter(models.Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


def listing_to_card(listing: models.Listing) -> schemas.ListingCard:
    return schemas.ListingCard.model_validate(listing)


@router.get("", response_model=schemas.ListingPage)
def search_listings(
    db: Session = Depends(get_db),
    location: Optional[str] = Query(None, description="City or country substring"),
    check_in: Optional[date] = None,
    check_out: Optional[date] = None,
    guests: Optional[int] = Query(None, ge=1),
    min_price: Optional[int] = Query(None, ge=0),
    max_price: Optional[int] = Query(None, ge=0),
    property_type: Optional[str] = None,
    room_type: Optional[str] = None,
    category: Optional[str] = None,
    amenities: Optional[str] = Query(None, description="Comma-separated amenity ids"),
    sort: str = Query("recommended", pattern="^(recommended|price_asc|price_desc|rating_desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=50),
):
    query = (
        db.query(models.Listing)
        .options(joinedload(models.Listing.images))
        .join(models.User, models.Listing.host_id == models.User.id)
    )

    if location:
        like = f"%{location.strip()}%"
        query = query.filter(
            or_(models.Listing.city.ilike(like), models.Listing.country.ilike(like),
                models.Listing.address.ilike(like))
        )
    if guests:
        query = query.filter(models.Listing.max_guests >= guests)
    if min_price is not None:
        query = query.filter(models.Listing.price_per_night >= min_price)
    if max_price is not None:
        query = query.filter(models.Listing.price_per_night <= max_price)
    if property_type and property_type != "Any":
        query = query.filter(models.Listing.property_type == property_type)
    if room_type and room_type != "Any":
        query = query.filter(models.Listing.room_type == room_type)
    if category and category != "All":
        query = query.filter(models.Listing.category == category)
    if amenities:
        ids = [int(a) for a in amenities.split(",") if a.strip().isdigit()]
        if ids:
            query = query.join(models.ListingAmenity).filter(
                models.ListingAmenity.amenity_id.in_(ids)
            ).group_by(models.Listing.id).having(
                func.count(models.ListingAmenity.amenity_id) == len(ids)
            )

    # Date availability: exclude listings with an overlapping confirmed booking.
    if check_in and check_out:
        if check_in >= check_out:
            raise HTTPException(400, "check_in must be before check_out")
        busy = (
            db.query(models.Booking.listing_id)
            .filter(
                models.Booking.status == "confirmed",
                models.Booking.check_in < check_out,
                models.Booking.check_out > check_in,
            )
            .subquery()
        )
        query = query.filter(~models.Listing.id.in_(db.query(busy)))

    total = query.count()
    if sort == "price_asc":
        query = query.order_by(models.Listing.price_per_night.asc())
    elif sort == "price_desc":
        query = query.order_by(models.Listing.price_per_night.desc())
    elif sort == "rating_desc":
        query = query.order_by(models.Listing.rating.desc(), models.Listing.reviews_count.desc())
    else:  # recommended: superhosts first, then rating then newest
        query = query.order_by(
            models.User.is_superhost.desc(),
            models.Listing.rating.desc(),
            models.Listing.id.desc(),
        )

    pages = max(1, (total + page_size - 1) // page_size)
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return schemas.ListingPage(
        items=[listing_to_card(l) for l in items], total=total, page=page, pages=pages
    )


@router.get("/meta/categories")
def categories(db: Session = Depends(get_db)):
    rows = db.query(models.Listing.category, func.count(models.Listing.id)).group_by(
        models.Listing.category
    ).all()
    return [{"name": name, "count": count} for name, count in rows]


@router.get("/meta/amenities", response_model=list[schemas.AmenityOut])
def amenities(db: Session = Depends(get_db)):
    return db.query(models.Amenity).order_by(models.Amenity.id).all()


@router.get("/mine", response_model=list[schemas.ListingCard])
def my_listings(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    """Listings owned by the current user (host dashboard)."""
    return (
        db.query(models.Listing)
        .options(joinedload(models.Listing.images))
        .filter(models.Listing.host_id == user.id)
        .order_by(models.Listing.id.desc())
        .all()
    )


@router.get("/{listing_id}", response_model=schemas.ListingDetail)
def listing_detail(listing_id: int, db: Session = Depends(get_db)):
    listing = (
        db.query(models.Listing)
        .options(
            joinedload(models.Listing.host),
            joinedload(models.Listing.images),
            joinedload(models.Listing.amenities),
        )
        .filter(models.Listing.id == listing_id)
        .first()
    )
    if not listing:
        raise HTTPException(404, "Listing not found")
    return schemas.ListingDetail.model_validate(listing)


@router.get("/{listing_id}/availability", response_model=list[schemas.DateRangeOut])
def listing_availability(listing_id: int, db: Session = Depends(get_db)):
    """Booked date ranges that must be blocked on the calendar."""
    bookings = (
        db.query(models.Booking)
        .filter(models.Booking.listing_id == listing_id, models.Booking.status == "confirmed")
        .all()
    )
    return [schemas.DateRangeOut(check_in=b.check_in, check_out=b.check_out) for b in bookings]


# ---------------- Host CRUD ----------------
@router.post("", response_model=schemas.ListingDetail, status_code=201)
def create_listing(
    payload: schemas.ListingCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    listing = models.Listing(
        host_id=user.id,
        **payload.model_dump(exclude={"image_urls", "amenity_ids"}),
    )
    for i, url in enumerate(payload.image_urls[:10]):
        if url.strip():
            listing.images.append(models.ListingImage(url=url.strip(), sort_order=i))
    if payload.amenity_ids:
        ams = db.query(models.Amenity).filter(models.Amenity.id.in_(payload.amenity_ids)).all()
        listing.amenities = ams

    if not user.is_host:
        user.is_host = True
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return listing


def _require_owner(db: Session, listing_id: int, user: models.User) -> models.Listing:
    listing = get_listing_or_404(db, listing_id)
    if listing.host_id != user.id:
        raise HTTPException(403, "You do not own this listing")
    return listing


@router.put("/{listing_id}", response_model=schemas.ListingDetail)
def update_listing(
    listing_id: int,
    payload: schemas.ListingUpdate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    listing = _require_owner(db, listing_id, user)
    for field, value in payload.model_dump(exclude={"image_urls", "amenity_ids"}).items():
        setattr(listing, field, value)

    if payload.image_urls is not None:
        listing.images.clear()
        for i, url in enumerate(payload.image_urls[:10]):
            if url.strip():
                listing.images.append(models.ListingImage(url=url.strip(), sort_order=i))
    if payload.amenity_ids is not None:
        listing.amenities = (
            db.query(models.Amenity).filter(models.Amenity.id.in_(payload.amenity_ids)).all()
        )
    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/{listing_id}", response_model=schemas.Message)
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    listing = _require_owner(db, listing_id, user)
    db.delete(listing)
    db.commit()
    return schemas.Message(detail="Listing deleted")
