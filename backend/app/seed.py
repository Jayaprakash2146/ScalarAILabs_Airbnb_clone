"""Seeds the SQLite database with demo users, listings, bookings and reviews.

Run automatically on startup when the database is empty, or manually:
    python -m app.seed
"""
from datetime import date, timedelta
import random

from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models
from .database import Base, SessionLocal, engine
from .models import utcnow

random.seed(42)

U = "https://images.unsplash.com/photo-{}?auto=format&fit=crop&w=1200&q=80"

HOSTS = [
    dict(name="Ananya Mehta", email="ananya@demo.com", is_superhost=True),
    dict(name="Rohan Kapoor", email="rohan@demo.com", is_superhost=True),
    dict(name="Priya Nair", email="priya@demo.com", is_superhost=True),
    dict(name="Vikram Singh", email="vikram@demo.com", is_superhost=False),
    dict(name="Sara Fernandes", email="sara@demo.com", is_superhost=True),
    dict(name="Dev Patel", email="dev@demo.com", is_superhost=False),
]

GUESTS = [
    dict(name="Aarav Sharma", email="guest@demo.com"),
    dict(name="Ishaan Verma", email="ishaan@example.com"),
    dict(name="Meera Iyer", email="meera@example.com"),
    dict(name="Kabir Malhotra", email="kabir@example.com"),
    dict(name="Diya Reddy", email="diya@example.com"),
    dict(name="Arjun Menon", email="arjun@example.com"),
    dict(name="Nisha Gupta", email="nisha@example.com"),
    dict(name="Rahul Joshi", email="rahul@example.com"),
]

AMENITIES = [
    ("Wifi", "wifi"), ("Kitchen", "kitchen"), ("Air conditioning", "ac"),
    ("Swimming pool", "pool"), ("Free parking", "parking"), ("Hot tub", "hottub"),
    ("Washer", "washer"), ("TV", "tv"), ("Dedicated workspace", "workspace"),
    ("BBQ grill", "bbq"), ("Fireplace", "fireplace"), ("Gym", "gym"),
    ("Beach access", "beach"), ("Mountain view", "mountain"), ("Pets allowed", "pets"),
]

# (host_idx, title, city, country, price, cleaning, category, property_type, room_type,
#  guests, bedrooms, beds, baths, lat, lng, [images], [amenity ids 1-based])
LISTINGS = [
    (0, "Serene Beachfront Villa with Private Pool", "Goa", "India", 12500, 1500, "Beachfront",
     "Villa", "Entire home", 8, 4, 5, 3.5, 15.2993, 74.1240,
     ["1600585154340-be6161a56a0c", "1520250497591-112f2f40a3f4", "1507525428034-b723cf961d3e",
      "1519046904884-53103b34b206", "1600607687939-ce8a6c25118c"],
     [1, 2, 3, 4, 5, 7, 13]),
    (1, "Cozy Pinewood Cabin in the Himalayas", "Manali", "India", 4800, 800, "Cabins",
     "Cabin", "Entire home", 4, 2, 2, 2.0, 32.2432, 77.1892,
     ["1542718610-a1d656d1884c", "1518780664697-55e3ad937233", "1470770841072-f978cf4d019e",
      "1506905925346-21bda4d32df4", "1441974231531-c6227db76b6e"],
     [1, 3, 9, 11, 14]),
    (2, "Royal Heritage Haveli in the Pink City", "Jaipur", "India", 9800, 1200, "Design",
     "Castle", "Entire home", 6, 3, 4, 3.0, 26.9124, 75.7873,
     ["1476514525535-07fb3b4ae5f1", "1560448204-e02f11c3d0e2", "1493809842364-78817add7ffb",
      "1505693416388-ac5ce068fe85", "1554995207-c18c203602cb"],
     [1, 2, 4, 7, 9]),
    (3, "Lakeview Cottage with Wraparound Deck", "Udaipur", "India", 6700, 900, "Lakefront",
     "House", "Entire home", 5, 2, 3, 2.5, 24.5854, 73.7125,
     ["1439066615861-d1af74d74000", "1470770841072-f978cf4d019e", "1560185007-cde436f6a4d0",
      "1600607687920-4e2a09cf159d", "1493663284031-b7e3aefcae8e"],
     [1, 2, 5, 7, 14]),
    (4, "Modern Sea-Facing Apartment in Bandra", "Mumbai", "India", 7200, 1000, "Amazing views",
     "Apartment", "Entire home", 3, 2, 2, 2.0, 19.0596, 72.8295,
     ["1522708323590-d24dbb6b0267", "1484154218962-a197022b5858", "1540518614846-7eded433c457",
      "1584622650111-993a426fbf0a", "1502672260266-1c1ef2d93688"],
     [1, 2, 3, 7, 8, 9]),
    (5, "Sunlit Studio in Indiranagar", "Bengaluru", "India", 3200, 450, "Rooms",
     "Apartment", "Private room", 2, 1, 1, 1.0, 12.9719, 77.6412,
     ["1502672260266-1c1ef2d93688", "1505693416388-ac5ce068fe85", "1493809842364-78817add7ffb",
      "1484154218962-a197022b5858", "1560448075-bb485b067938"],
     [1, 2, 3, 7, 8, 9]),
    (0, "Riverside Treehouse Retreat", "Rishikesh", "India", 5400, 700, "Treehouses",
     "Treehouse", "Entire home", 2, 1, 1, 1.0, 30.0869, 78.2676,
     ["1441974231531-c6227db76b6e", "1506905925346-21bda4d32df4", "1464822759023-fed622ff2c3b",
      "1470770841072-f978cf4d019e", "1587061949409-02df41d5e562"],
     [1, 3, 9, 11, 14]),
    (1, "Colonial-Style Villa Near the French Quarter", "Pondicherry", "India", 5900, 800, "Trending",
     "House", "Entire home", 6, 3, 3, 2.5, 11.9416, 79.8083,
     ["1520250497591-112f2f40a3f4", "1519974719765-e6559eac2575", "1507525428034-b723cf961d3e",
      "1560184897-ae75f418493e", "1600596542815-ffad4c1539a9"],
     [1, 2, 3, 5, 7, 13]),
    (2, "Miniature Capsule Cabin — Tiny Home Escape", "Lonavala", "India", 2900, 400, "Tiny homes",
     "Tiny home", "Entire home", 2, 1, 1, 1.0, 18.7546, 73.4062,
     ["1518780664697-55e3ad937233", "1449158743715-0a90ebb6d2d8", "1470770841072-f978cf4d019e",
      "1441974231531-c6227db76b6e", "1506905925346-21bda4d32df4"],
     [1, 5, 9, 11]),
    (3, "Infinity Pool Penthouse with Skyline Views", "Mumbai", "India", 15000, 2000, "Luxe",
     "Apartment", "Entire home", 4, 2, 3, 2.5, 19.1136, 72.8697,
     ["1613490493576-7fde63acd811", "1600607687939-ce8a6c25118c", "1600566753086-00f18fb6b3ea",
      "1540518614846-7eded433c457", "1584622650111-993a426fbf0a"],
     [1, 2, 3, 4, 7, 8, 12]),
    (4, "Desert Camp Under the Stars", "Jodhpur", "India", 4100, 600, "Camping",
     "Campsite", "Entire home", 4, 2, 4, 2.0, 26.2389, 73.0243,
     ["1464822759023-fed622ff2c3b", "1506905925346-21bda4d32df4", "1476514525535-07fb3b4ae5f1",
      "1441974231531-c6227db76b6e", "1521401830884-6c03c1c87ebb"],
     [1, 5, 9, 14]),
    (5, "Backwater Boathouse in God's Own Country", "Kochi", "India", 7600, 900, "Amazing views",
     "House", "Entire home", 4, 2, 2, 2.0, 9.9312, 76.2673,
     ["1439066615861-d1af74d74000", "1520250497591-112f2f40a3f4", "1519046904884-53103b34b206",
      "1507525428034-b723cf961d3e", "1600585154340-be6161a56a0c"],
     [1, 2, 5, 7, 13, 14]),
    (0, "Grand Poolside Estate with Banana Groves", "Goa", "India", 9900, 1200, "Pools",
     "Villa", "Entire home", 10, 5, 6, 4.5, 15.5527, 73.7517,
     ["1600585154526-990dced4db0d", "1520250497591-112f2f40a3f4", "1600596542815-ffad4c1539a9",
      "1600607687920-4e2a09cf159d", "1600607687939-ce8a6c25118c"],
     [1, 2, 3, 4, 5, 7, 13]),
    (1, "Quaint Himalayan Stone Cottage", "Shimla", "India", 4600, 650, "Countryside",
     "House", "Entire home", 4, 2, 2, 1.5, 31.1048, 77.1734,
     ["1449158743715-0a90ebb6d2d8", "1542718610-a1d656d1884c", "1506905925346-21bda4d32df4",
      "1470770841072-f978cf4d019e", "1464822759023-fed622ff2c3b"],
     [1, 3, 5, 9, 11, 14]),
    (2, "Skyline Loft in the Heart of the City", "Bengaluru", "India", 5600, 700, "Trending",
     "Loft", "Entire home", 3, 1, 2, 1.5, 12.9352, 77.6245,
     ["1502672260266-1c1ef2d93688", "1554995207-c18c203602cb", "1493663284031-b7e3aefcae8e",
      "1484154218962-a197022b5858", "1560448204-e02f11c3d0e2"],
     [1, 2, 3, 7, 8, 9, 12]),
    (3, "Fisher-Style Beach Shack on the Sand", "Alibaug", "India", 5300, 750, "Beachfront",
     "House", "Entire home", 4, 2, 2, 2.0, 18.6412, 72.8721,
     ["1519046904884-53103b34b206", "1507525428034-b723cf961d3e", "1519974719765-e6559eac2575",
      "1520250497591-112f2f40a3f4", "1600585154340-be6161a56a0c"],
     [1, 2, 5, 7, 13]),
    (4, "Designer Apartment with Rooftop Terrace", "New Delhi", "India", 6800, 850, "Design",
     "Apartment", "Entire home", 3, 2, 2, 2.0, 28.6139, 77.2090,
     ["1560448204-e02f11c3d0e2", "1554995207-c18c203602cb", "1584622650111-993a426fbf0a",
      "1505693416388-ac5ce068fe85", "1540518614846-7eded433c457"],
     [1, 2, 3, 7, 8, 9]),
    (5, "Whitewashed Villa Overlooking the Arabian Sea", "Goa", "India", 8900, 1100, "Amazing views",
     "Villa", "Entire home", 8, 4, 4, 3.5, 15.5527, 73.7517,
     ["1600596542815-ffad4c1539a9", "1507525428034-b723cf961d3e", "1600585154526-990dced4db0d",
      "1519046904884-53103b34b206", "1520250497591-112f2f40a3f4"],
     [1, 2, 3, 4, 5, 7, 13, 14]),
    (0, "Hilltop Glass Cabin with 180° Valley Views", "Manali", "India", 8200, 1000, "Amazing views",
     "Cabin", "Entire home", 2, 1, 1, 1.0, 32.2396, 77.1887,
     ["1470770841072-f978cf4d019e", "1506905925346-21bda4d32df4", "1542718610-a1d656d1884c",
      "1441974231531-c6227db76b6e", "1464822759023-fed622ff2c3b"],
     [1, 3, 9, 11, 14]),
    (1, "Pastoral Farmstay with Horses & Trails", "Nashik", "India", 3800, 500, "Countryside",
     "Farm stay", "Entire home", 6, 3, 3, 2.0, 19.9975, 73.7898,
     ["1449158743715-0a90ebb6d2d8", "1570129477492-45c003edd2be", "1518780664697-55e3ad937233",
      "1470770841072-f978cf4d019e", "1441974231531-c6227db76b6e"],
     [1, 2, 5, 9, 15]),
    (2, "Boutique Suite in a Heritage Courtyard", "Jaipur", "India", 4700, 600, "Rooms",
     "Boutique hotel", "Private room", 2, 1, 1, 1.0, 26.9239, 75.8267,
     ["1512918728675-ed5a9ecdebfd", "1540518614846-7eded433c457", "1505693416388-ac5ce068fe85",
      "1584622650111-993a426fbf0a", "1554995207-c18c203602cb"],
     [1, 2, 3, 7, 8]),
    (3, "Lakeside Yurt with Wood-Fired Hot Tub", "Udaipur", "India", 6200, 800, "Tiny homes",
     "Yurt", "Entire home", 2, 1, 2, 1.0, 24.5787, 73.6863,
     ["1542718610-a1d656d1884c", "1439066615861-d1af74d74000", "1470770841072-f978cf4d019e",
      "1464822759023-fed622ff2c3b", "1506905925346-21bda4d32df4"],
     [1, 5, 9, 6, 14]),
    (4, "Santorini-Style White Villa with Plunge Pool", "Alibaug", "India", 13500, 1800, "Pools",
     "Villa", "Entire home", 6, 3, 4, 3.0, 18.6412, 72.8721,
     ["1613490493576-7fde63acd811", "1600585154526-990dced4db0d", "1520250497591-112f2f40a3f4",
      "1600607687920-4e2a09cf159d", "1600566753086-00f18fb6b3ea"],
     [1, 2, 3, 4, 5, 7, 13]),
    (5, "Forest Dome with Stargazing Window", "Coorg", "India", 6900, 900, "Camping",
     "Dome", "Entire home", 2, 1, 1, 1.0, 12.3375, 75.8069,
     ["1441974231531-c6227db76b6e", "1542718610-a1d656d1884c", "1506905925346-21bda4d32df4",
      "1476514525535-07fb3b4ae5f1", "1464822759023-fed622ff2c3b"],
     [1, 5, 9, 11, 14]),
]

DESCRIPTIONS = [
    "Wake up to sun-dappled mornings and end your days under a blanket of stars. "
    "This thoughtfully designed home pairs warm, natural textures with every modern comfort — "
    "a full chef's kitchen, ultra-fast wifi for remote work, and a plunge pool that catches the evening breeze. "
    "Guests rave about the quiet lane, the friendly neighbourhood cafés, and the golden-hour light that floods the living room.",

    "A labour of love restored over two years, this stay blends heritage craft with contemporary design. "
    "Every room frames a postcard view. Sip chai on the veranda as mist rolls over the hills, "
    "then gather around the firepit after dark. Ideal for slow mornings, long breakfasts and even longer conversations.",

    "Perfectly positioned minutes from the action yet tucked away on a serene street. "
    "You'll love the hand-picked art, hotel-quality linen, and the rain shower that reviewers call 'better than a spa'. "
    "We stock the kitchen with local coffee and fresh basics so your first morning feels like home.",
]

COMMENTS = [
    "Absolutely stunning place — the photos don't do it justice. Our host was incredibly responsive and even left fresh fruit for us. Would book again in a heartbeat!",
    "One of the best stays we've ever had. The space is even more beautiful in person and the location is perfect — walkable to everything yet totally peaceful at night.",
    "Seamless check-in, spotless rooms and thoughtful touches everywhere. The kitchen is a dream to cook in. Highly recommended for a quiet getaway.",
    "We came for a workation and ended up extending our stay! Great wifi, comfortable workspace and gorgeous views from every window.",
    "Host went above and beyond — early check-in, local recommendations, and a handwritten note. The place itself is immaculate and beautifully designed.",
    "Perfect weekend escape. Cozy, clean and full of character. The sunrise from the deck alone is worth the trip.",
    "Great value for money. Comfortable beds, powerful showers, and a lovely outdoor area where we spent most of our evenings.",
    "A magical stay. Falling asleep to the sounds of nature and waking up to mist was unforgettable. Thank you for a wonderful experience!",
]


def seed_if_empty(db: Session) -> None:
    if db.query(func.count(models.User.id)).scalar() > 0:
        return
    seed(db)


def seed(db: Session) -> None:
    # users ------------------------------------------------------------
    users = {}
    for data in HOSTS + GUESTS:
        u = models.User(
            name=data["name"],
            email=data["email"],
            avatar_url=f"https://i.pravatar.cc/150?u={data['email'].split('@')[0]}",
            is_host=data.get("is_host", False) or data.get("is_superhost", False),
            is_superhost=data.get("is_superhost", False),
            created_at=utcnow() - timedelta(days=random.randint(200, 1200)),
        )
        db.add(u)
        users[data["email"]] = u
    db.commit()

    amenities = db.query(models.Amenity).all()
    if not amenities:
        amenities = [models.Amenity(name=n, icon=i) for n, i in AMENITIES]
        db.add_all(amenities)
        db.commit()

    host_list = [users[h["email"]] for h in HOSTS]
    guest_list = [users[g["email"]] for g in GUESTS]

    # listings -----------------------------------------------------------
    listings = []
    for row in LISTINGS:
        (h_idx, title, city, country, price, cleaning, category, ptype, rtype,
         guests, bedrooms, beds, baths, lat, lng, imgs, amen_ids) = row
        desc = random.choice(DESCRIPTIONS)
        l = models.Listing(
            host_id=host_list[h_idx].id, title=title, description=desc,
            city=city, country=country,
            address=f"{random.randint(1, 99)}, {random.choice(['Palm Lane','Church Road','Hill View','Lake Street','MG Road','Beach Road'])}, {city}",
            lat=lat + random.uniform(-0.02, 0.02), lng=lng + random.uniform(-0.02, 0.02),
            price_per_night=price, cleaning_fee=cleaning,
            property_type=ptype, room_type=rtype, category=category,
            max_guests=guests, bedrooms=bedrooms, beds=beds, bathrooms=baths,
        )
        l.images = [models.ListingImage(url=U.format(pid), sort_order=i)
                    for i, pid in enumerate(imgs)]
        l.amenities = [amenities[a - 1] for a in amen_ids if a <= len(amenities)]
        db.add(l)
        listings.append(l)
    db.commit()

    # bookings -------------------------------------------------------------
    today = date.today()

    def add_booking(l, g, ci, co, status_="confirmed"):
        nights = (co - ci).days
        subtotal = l.price_per_night * nights
        cleaning = l.cleaning_fee
        service = round((subtotal + cleaning) * 0.14)
        b = models.Booking(
            listing_id=l.id, guest_id=g.id, check_in=ci, check_out=co,
            num_guests=random.randint(1, min(4, l.max_guests)),
            nights=nights, nightly_price=l.price_per_night,
            cleaning_fee=cleaning, service_fee=service,
            total_price=subtotal + cleaning + service, status=status_,
        )
        db.add(b)
        return b

    seeded_bookings = []
    for idx, l in enumerate(listings[:8]):
        # a completed past stay
        past = add_booking(l, guest_list[idx % len(guest_list)],
                           today - timedelta(days=45 + idx * 7),
                           today - timedelta(days=45 + idx * 7 - random.randint(2, 5)))
        seeded_bookings.append(past)
        # an upcoming stay (blocks future dates)
        start = today + timedelta(days=5 + idx * 3)
        future = add_booking(l, guest_list[(idx + 3) % len(guest_list)],
                             start, start + timedelta(days=random.randint(2, 4)))
        seeded_bookings.append(future)
    db.commit()

    # reviews ----------------------------------------------------------------
    for idx, l in enumerate(listings):
        n_reviews = random.randint(3, 6)
        for j in range(n_reviews):
            days_ago = random.randint(10, 400)
            db.add(models.Review(
                listing_id=l.id,
                guest_id=guest_list[(idx + j) % len(guest_list)].id,
                rating=random.choices([5, 4, 3], weights=[70, 22, 8])[0],
                comment=random.choice(COMMENTS),
                created_at=utcnow() - timedelta(days=days_ago),
            ))
    db.commit()

    # keep denormalised rating aggregates in sync ------------------------------
    for l in listings:
        from .services import sync_listing_rating
        sync_listing_rating(db, l.id)
    db.commit()
    print(f"Seeded: {len(host_list) + len(guest_list)} users, {len(listings)} listings, "
          f"{len(seeded_bookings)} bookings, reviews for {len(listings)} listings.")


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed(db)
    finally:
        db.close()
