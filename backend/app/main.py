from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import models  # noqa: F401  (ensure models are registered)
from .database import Base, engine
from .routes import auth_routes, listings, bookings, reviews, wishlist, uploads

app = FastAPI(
    title="Airbnb Clone API",
    description="Backend for a full-stack Airbnb clone (FastAPI + SQLite).",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev-friendly; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(listings.router)
app.include_router(bookings.router)
app.include_router(reviews.router)
app.include_router(wishlist.router)
app.include_router(uploads.router)

# Serve uploaded images (stand-in for a cloud bucket).
Path("uploads").mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    # Seed once if the database is empty.
    from .database import SessionLocal
    from .seed import seed_if_empty
    db = SessionLocal()
    try:
        seed_if_empty(db)
    finally:
        db.close()


@app.get("/api/health", tags=["meta"])
def health():
    return {"status": "ok"}
