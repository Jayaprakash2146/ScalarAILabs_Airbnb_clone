# Airbnb Clone — Full-Stack Marketplace

A pixel-focused, full-stack clone of Airbnb built for the SDE assignment: browse and search stays, book
date ranges with real availability blocking, manage bookings as a guest, and run a full listing CRUD as a
host — all inside a faithful recreation of Airbnb's clean, photo-forward interface.

> Educational project. Not affiliated with Airbnb, Inc. Payments, messaging, identity verification and
> real-time maps are mocked or simplified.

---

## Tech Stack

| Layer    | Technology |
| -------- | ---------- |
| Frontend | **Next.js 14 (App Router) + TypeScript + Tailwind CSS** |
| Backend  | **Python FastAPI** (SQLAlchemy ORM, Pydantic v2) |
| Database | **SQLite** (relational schema, seeded demo data) |
| Map      | **Leaflet + react-leaflet** (interactive pins, OpenStreetMap tiles — no API key) |
| Media    | Unsplash placeholder images, pravatar avatars, local upload storage (cloud-bucket stand-in) |

## Features

### Guest experience
- **Explore grid** with Airbnb-style cards: photo carousels, wishlist hearts, ratings
- **Pill search bar** (location · date range · guests) driving server-side filtering
- **Category row** (Trending, Beachfront, Cabins, …) + **Filters modal** (price range, property/room
  type, amenities)
- **Sorting** (recommended / price / rating) and **pagination**
- **Listing detail**: 5-photo mosaic gallery with lightbox, amenities, live availability calendar,
  price breakdown (nightly × nights + cleaning + 14% service fee), reviews with rating bars
- **Booking flow**: date-range picker that blocks already-booked nights, guest-count validation
  (max capacity), mocked checkout modal, confirmation
- **My Trips**: upcoming/past bookings with cancel (which releases the dates)
- **Wishlist**: heart any listing, view saved homes
- **Reviews**: guests can review a listing after a completed stay (bonus)

### Host experience (full CRUD)
- **Create listing** (title, description, photos via URL, price, cleaning fee, location, capacity,
  category, amenities)
- **Edit / delete** listings (ownership enforced server-side)
- **Host dashboard**: owned listings + received bookings (upcoming/past/cancelled) with guest info

### Airbnb feel
- Sticky header with collapsing search pill, user menu
- Toast notifications, skeleton loading states, modals, popovers
- Responsive layout (mobile / tablet / desktop), Airbnb colour system (Rausch `#FF385C`, Hof `#222222`)

### Mocked sections (per assignment)
- Payments (checkout simulates success), messaging (simulated chat thread in a modal),
  identity verification (placeholder chip on the host card), real-time map pins
  (an interactive Leaflet map with price pins replaces the static map)
- **Experiences & Services verticals** — the header tabs (All / Homes / Experiences / Services)
  are all functional: Experiences and Services are separate browsable verticals with their own
  landing rows, detail pages and mocked booking flows, powered by static mock data
- **"About the space"** — listing descriptions truncate with a Show more button that opens a
  floating window containing the full description, space facts and things to note
- **Info pages** — every footer link (Support, Hosting, Airbnb columns, Privacy/Terms/Company
  details) opens a real content page; inspiration city tiles run real searches on our listings

### Bonus features implemented
- **Interactive map with listing pins** — "Show map" toggle on Explore renders an
  Airbnb-style Leaflet map where every listing is a price chip; clicking a pin opens a
  popup mini-card linking to the listing (auto-fit bounds to results)
- **Leave a review after a completed stay** — enforced server-side (403 until the
  guest's check-out date has passed) with a star-rating + comment modal
- **Superhost badges / ratings aggregation** — badge on cards and detail page,
  denormalised `rating`/`reviews_count` recomputed on every review write, plus
  Airbnb-style six-category rating bars
- **Image upload** — `POST /api/uploads` accepts multipart images (≤5 MB, JPEG/PNG/WebP/GIF),
  stores them and serves them statically; wired into the host listing form via an
  "Upload from device" button alongside URL input
- **Dark mode** — sun/moon toggle in the header, persisted in localStorage, applied
  pre-paint to avoid flash, and themed across every surface
- **Responsive design** — layouts adapt across mobile / tablet / desktop (grids collapse,
  search pill simplifies, calendar scrolls, bottom-sheet modals)

---

## Setup & Run

### 1. Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
python -m app.seed        # create + seed SQLite (also runs automatically on startup)
uvicorn app.main:app --reload --port 8000
```

API is now at `http://localhost:8000` (interactive docs at `/docs`).

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev               # http://localhost:3000
```

`NEXT_PUBLIC_API_BASE` env var overrides the API URL (defaults to `http://localhost:8000`).

### Demo accounts (seeded)

| Email | Role |
| ----- | ---- |
| `guest@demo.com` | Guest with trips & review history |
| `ananya@demo.com` | Host (Superhost) with listings |
| `rohan@demo.com` | Host (Superhost) with listings |

Log in with any email on `/login` — unknown emails are auto-registered (mocked auth, per assignment).

---

## Architecture Overview

```
frontend/  Next.js App Router
├── src/app/                 routes (/, /listing/[id], /trips, /host, /host/listings/new,
│                            /host/listings/[id]/edit, /wishlist, /login)
├── src/components/          reusable UI (Header, SearchBar, ListingCard, DateRangeCalendar,
│                            BookingWidget, CheckoutModal, FiltersModal, PhotoGallery, …)
├── src/lib/                 api client, auth context, toast system, formatters, constants
└── src/types/               TS mirrors of the API schemas

backend/   FastAPI
├── app/main.py              app factory, CORS, router mounting, auto-seed on startup
├── app/database.py          SQLAlchemy engine/session (SQLite)
├── app/models.py            ORM models & relationships
├── app/schemas.py           Pydantic request/response models
├── app/auth.py              mocked auth (X-User-Email header → user)
├── app/services.py          availability checks, price breakdown, rating sync
├── app/routes/              auth, listings (search+CRUD), bookings, reviews, wishlist
└── app/seed.py              demo data generator
```

**Request flow:** React client components → typed fetch wrapper (`src/lib/api.ts`) attaches
`X-User-Email` header → FastAPI validates with Pydantic → SQLAlchemy queries SQLite → JSON back.

**Availability invariant:** a booking is rejected with `409` if any confirmed booking on the same
listing overlaps (`existing.check_in < new.check_out AND existing.check_out > new.check_in`).
The explore search excludes listings with overlapping stays for the requested dates, and the
detail-page calendar disables blocked nights.

---

## Database Schema

```
users            listings           listing_images     amenities
──────           ───────            ──────────────     ─────────
id PK            id PK              id PK              id PK
name             host_id FK →users  listing_id FK      name UNIQUE
email UNIQUE     title              url                icon
avatar_url       description        sort_order
is_host          city, country
is_superhost     address, lat, lng
created_at       price_per_night
                 cleaning_fee
                 property_type
                 room_type
                 category
                 max_guests
                 bedrooms, beds, bathrooms
                 rating (denorm.)   listing_amenities  bookings           reviews
                 reviews_count      ─────────────────  ────────           ───────
                 created_at         listing_id PK/FK   id PK              id PK
                                    amenity_id PK/FK   listing_id FK      listing_id FK
                                                       guest_id FK        guest_id FK
wishlist_items                        booking_id FK (nullable)
──────────────                        check_in, check_out
user_id PK/FK                         num_guests
listing_id PK/FK                      nights, nightly_price
created_at                            cleaning_fee, service_fee
                                      total_price
                                      status (confirmed|cancelled)
                                      created_at
```

Key design decisions:
- **Denormalised `rating`/`reviews_count`** on `listings`, recomputed on review writes — grid pages
  need rating on every card without an aggregate join per row.
- **Composite PK** on `wishlist_items` (user_id, listing_id) enforces one favourite per listing per user.
- **Unique email** on users; **index** on `bookings(listing_id, check_in, check_out)` for fast overlap
  queries; indexes on hot filters (`city`, `price_per_night`, `category`).
- **Cascading deletes**: removing a listing removes its images, bookings and reviews.
- Bookings snapshot prices at booking time so later price edits never mutate history.

---

## API Overview

Base URL: `http://localhost:8000` · Full interactive docs at `/docs`

| Method | Path | Description |
| ------ | ---- | ----------- |
| POST | `/api/auth/login` | Log in / auto-register by email |
| GET | `/api/listings` | Search: `location, check_in, check_out, guests, min_price, max_price, property_type, room_type, category, amenities, sort, page, page_size` |
| GET | `/api/listings/mine` | Current host's listings |
| GET | `/api/listings/{id}` | Listing detail (host, images, amenities) |
| GET | `/api/listings/{id}/availability` | Booked date ranges |
| GET | `/api/listings/{id}/reviews` | Reviews for a listing |
| POST | `/api/listings` | Create listing (host) |
| PUT | `/api/listings/{id}` | Update listing (owner only) |
| DELETE | `/api/listings/{id}` | Delete listing (owner only) |
| POST | `/api/listings/{id}/reviews` | Review a completed stay |
| POST | `/api/bookings` | Book (validates dates, capacity, overlap → `409` on conflict) |
| GET | `/api/bookings/mine` | Guest's trips |
| DELETE | `/api/bookings/{id}` | Cancel booking (releases dates) |
| GET | `/api/bookings/host` | Bookings on the host's listings |
| GET | `/api/wishlist` · `/api/wishlist/ids` | Favourites |
| POST | `/api/wishlist/{listing_id}` | Toggle favourite |
| POST | `/api/uploads` | Upload an image (multipart, ≤5 MB) → returns its URL |
| GET | `/api/listings/meta/categories` · `/meta/amenities` | Filter metadata |
| GET | `/api/health` | Health probe |

Authentication is a **mocked header scheme** (`X-User-Email`) — intentionally simple per the
assignment; every mutating route still verifies identity and ownership server-side.

---

## Assumptions

- Currency is ₹ (INR) with whole-rupee prices; service fee fixed at 14% of subtotal.
- One flat wishlist per user (no named lists).
- Minimum stay is 1 night; check-out is exclusive (Airbnb semantics).
- "Confirmed" status is instant on checkout (payments mocked); cancellation is free & instant.
- Reviews require a completed confirmed stay whose check-out is in the past; one review
  per guest per listing.
- Hosts self-serve: any logged-in user becomes a host by creating their first listing.
- Photos are external URLs (Unsplash) **or** uploaded files; uploads land in `backend/uploads/`
  served at `/uploads` — a local stand-in for a cloud bucket, swap `app/routes/uploads.py`
  for S3/Cloudinary without changing the API contract. SVG uploads are rejected (XSS safety).
- Guest↔host messaging is simulated in the browser with canned replies; no transport.
- The interactive map uses OpenStreetMap tiles via Leaflet (no API key, no live pricing).

## Possible Extensions
JWT sessions, image upload to S3/Cloudinary, live map pricing, real guest/host messaging,
i18n, Postgres migration via a single engine URL change.


## Deployed on Vercel 
Live Link : https://scalar-ai-labs-airbnb-clone-xynv.vercel.app/

