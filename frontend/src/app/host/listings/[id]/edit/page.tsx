"use client";

import { useParams } from "next/navigation";
import ListingForm from "@/components/ListingForm";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  return <ListingForm listingId={Number(id)} />;
}
