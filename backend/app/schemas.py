from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict, model_validator

from .models import Listing


# ---------------- Auth ----------------
class LoginRequest(BaseModel):
    email: EmailStr
    name: Optional[str] = None  # used when auto-registering a new user


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    avatar_url: str
    is_host: bool
    is_superhost: bool
    created_at: datetime


# ---------------- Listings ----------------
class AmenityOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    icon: str


class HostOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    avatar_url: str
    is_superhost: bool
    created_at: datetime


class ListingImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    url: str
    sort_order: int


class ListingCard(BaseModel):
    """Compact representation used by grid views and map pins."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    city: str
    country: str
    price_per_night: int
    rating: float
    reviews_count: int
    category: str
    property_type: str
    room_type: str
    max_guests: int
    bedrooms: int
    beds: int
    bathrooms: float
    lat: float
    lng: float
    superhost: bool = False
    images: list[ListingImageOut]

    @model_validator(mode="before")
    @classmethod
    def extract_superhost(cls, data):
        """Pull the Superhost flag off the related host when serialising ORM rows."""
        if not isinstance(data, Listing):
            return data
        payload = {}
        for name in cls.model_fields:
            if name == "superhost":
                continue
            payload[name] = getattr(data, name)
        host = data.host
        payload["superhost"] = bool(host.is_superhost) if host is not None else False
        return payload


class ListingDetail(ListingCard):
    description: str
    address: str
    lat: float
    lng: float
    cleaning_fee: int
    bedrooms: int
    beds: int
    bathrooms: float
    host: HostOut
    amenities: list[AmenityOut]


class ListingCreate(BaseModel):
    title: str = Field(min_length=5, max_length=200)
    description: str = ""
    city: str
    country: str = "India"
    address: str = ""
    lat: float = 0.0
    lng: float = 0.0
    price_per_night: int = Field(gt=0)
    cleaning_fee: int = Field(ge=0, default=0)
    property_type: str = "Apartment"
    room_type: str = "Entire home"
    category: str = "Trending"
    max_guests: int = Field(ge=1, default=2)
    bedrooms: int = Field(ge=1, default=1)
    beds: int = Field(ge=1, default=1)
    bathrooms: float = Field(ge=0.5, default=1.0)
    image_urls: list[str] = []
    amenity_ids: list[int] = []


class ListingUpdate(ListingCreate):
    pass


class ListingPage(BaseModel):
    items: list[ListingCard]
    total: int
    page: int
    pages: int


class DateRangeOut(BaseModel):
    """Booked (unavailable) date ranges for a listing."""
    check_in: date
    check_out: date


# ---------------- Bookings ----------------
class BookingCreate(BaseModel):
    listing_id: int
    check_in: date
    check_out: date
    num_guests: int = Field(ge=1)


class BookingGuest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    avatar_url: str


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    check_in: date
    check_out: date
    num_guests: int
    nights: int
    nightly_price: int
    cleaning_fee: int
    service_fee: int
    total_price: int
    status: str
    created_at: datetime
    listing: ListingCard
    guest: BookingGuest


class HostBookingOut(BookingOut):
    """From the host's perspective, includes guest contact."""
    pass


# ---------------- Reviews ----------------
class ReviewCreate(BaseModel):
    rating: int = Field(ge=1, le=5)
    comment: str = ""


class ReviewOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    rating: int
    comment: str
    created_at: datetime
    author: BookingGuest


# ---------------- Wishlist ----------------
class WishlistOut(BaseModel):
    listing: ListingCard


class Message(BaseModel):
    detail: str
