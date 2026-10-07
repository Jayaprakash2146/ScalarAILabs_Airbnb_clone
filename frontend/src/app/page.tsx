import { Suspense } from "react";
import ExploreClient from "@/components/ExploreClient";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-[1760px] px-6 py-10 md:px-10 lg:px-20">
          <div className="h-10 w-64 animate-pulse rounded bg-mist dark:bg-[#2a2a2e]" />
        </div>
      }
    >
      <ExploreClient />
    </Suspense>
  );
}
