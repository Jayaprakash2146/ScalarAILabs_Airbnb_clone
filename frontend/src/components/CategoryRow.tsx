"use client";

/** Horizontally scrollable category chip row (Airbnb explore header). */
import { useRef } from "react";
import { CATEGORIES } from "@/lib/constants";
import { CategoryIcon, ChevronLeft, ChevronRight, FilterIcon } from "@/components/Icons";

interface Props {
  active: string;
  onSelect: (category: string) => void;
  onOpenFilters: () => void;
}

export default function CategoryRow({ active, onSelect, onOpenFilters }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    scroller.current?.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <div className="sticky top-[73px] z-40 border-b border-line dark:border-[#38383d] bg-white dark:bg-[#1c1c20]">
      <div className="mx-auto flex max-w-[1760px] items-center gap-4 px-6 md:px-10 lg:px-20">
        <button
          aria-label="Scroll categories left"
          onClick={() => scroll(-1)}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-foggy dark:text-[#a8a8ad] hover:bg-mist dark:hover:bg-[#2a2a2e] md:flex"
        >
          <ChevronLeft width={14} height={14} />
        </button>

        <div
          ref={scroller}
          className="no-scrollbar flex flex-1 items-end gap-8 overflow-x-auto py-3"
        >
          {CATEGORIES.map((c) => {
            const isActive = active === c.name;
            return (
              <button
                key={c.name}
                onClick={() => onSelect(isActive ? "All" : c.name)}
                className={`flex min-w-fit flex-col items-center gap-1.5 border-b-2 pb-2.5 pt-1 transition-colors ${
                  isActive
                    ? "border-hof text-hof dark:text-[#f0f0f0]"
                    : "border-transparent text-foggy dark:text-[#a8a8ad] hover:border-line dark:border-[#38383d] dark:hover:border-[#38383d] hover:text-hof"
                }`}
              >
                <CategoryIcon name={c.icon} width={24} height={24} />
                <span className="whitespace-nowrap text-xs font-medium">{c.name}</span>
              </button>
            );
          })}
        </div>

        <button
          aria-label="Scroll categories right"
          onClick={() => scroll(1)}
          className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full text-foggy dark:text-[#a8a8ad] hover:bg-mist dark:hover:bg-[#2a2a2e] md:flex"
        >
          <ChevronRight width={14} height={14} />
        </button>

        <button
          onClick={onOpenFilters}
          className="ml-2 flex shrink-0 items-center gap-2 rounded-xl border border-line dark:border-[#38383d] px-4 py-3 text-xs font-medium hover:shadow-search"
        >
          <FilterIcon width={14} height={14} />
          Filters
        </button>
      </div>
    </div>
  );
}
