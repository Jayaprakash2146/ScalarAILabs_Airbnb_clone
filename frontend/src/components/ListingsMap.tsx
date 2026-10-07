"use client";

/**
 * Bonus: interactive map with listing price pins.
 * Built on react-leaflet (OpenStreetMap tiles, no API key required).
 * Each pin is an Airbnb-style price chip; clicking opens a popup mini-card.
 */
import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatPrice } from "@/lib/format";
import type { ListingCardData } from "@/types";

function FitBounds({ listings }: { listings: ListingCardData[] }) {
  const map = useMap();
  useEffect(() => {
    if (listings.length === 0) return;
    if (listings.length === 1) {
      map.setView([listings[0].lat, listings[0].lng], 13);
      return;
    }
    const bounds = L.latLngBounds(listings.map((l) => [l.lat, l.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 12 });
  }, [map, listings]);
  return null;
}

export default function ListingsMap({ listings }: { listings: ListingCardData[] }) {
  const pins = useMemo(() => {
    return listings.filter((l) => l.lat !== 0 || l.lng !== 0).map((l) => {
      const icon = L.divIcon({
        className: "",
        html: `<div class="airbnb-price-pin">${formatPrice(l.price_per_night)}</div>`,
        iconSize: undefined,
      });
      return { listing: l, icon };
    });
  }, [listings]);

  const center = useMemo<[number, number]>(() => {
    if (listings.length === 0) return [20.5937, 78.9629]; // India
    const lat = listings.reduce((s, l) => s + l.lat, 0) / listings.length;
    const lng = listings.reduce((s, l) => s + l.lng, 0) / listings.length;
    return [lat, lng];
  }, [listings]);

  return (
    <div className="overflow-hidden rounded-2xl border border-line dark:border-[#38383d] shadow-card">
      <MapContainer
        center={center}
        zoom={5}
        scrollWheelZoom
        className="h-[70vh] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds listings={listings} />
        {pins.map(({ listing, icon }) => (
          <Marker key={listing.id} position={[listing.lat, listing.lng]} icon={icon}>
            <Popup>
              <div className="w-44">
                {listing.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.images[0].url}
                    alt={listing.title}
                    className="mb-2 h-24 w-full rounded-lg object-cover"
                  />
                )}
                <p className="mb-0.5 text-[10px] font-bold uppercase tracking-wide text-[#717171]">
                  {listing.superhost ? "★ Superhost · " : ""}
                  {listing.property_type}
                </p>
                <a
                  href={`/listing/${listing.id}`}
                  className="line-clamp-1 text-sm font-semibold text-[#222222] hover:underline"
                >
                  {listing.title}
                </a>
                <p className="text-xs text-[#717171]">
                  {listing.city}, {listing.country}
                </p>
                <p className="mt-1 text-sm">
                  <span className="font-semibold">{formatPrice(listing.price_per_night)}</span> night
                  {listing.rating > 0 && (
                    <span className="float-right text-xs">
                      ★ {listing.rating.toFixed(2)}
                    </span>
                  )}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
