/** Small inline SVG icon set (stroke follows currentColor). */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const SearchIcon = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const GlobeIcon = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.6 3.9 5.7 3.9 9s-1.4 6.4-3.9 9c-2.5-2.6-3.9-5.7-3.9-9S9.5 5.6 12 3Z" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...p}
  >
    <path d="M12 2.5 9.1 8.6l-6.6.9 4.8 4.6-1.2 6.6L12 17.6l5.9 3.1-1.2-6.6 4.8-4.6-6.6-.9L12 2.5Z" />
  </svg>
);

export function HeartIcon({ filled = false, ...p }: P & { filled?: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill={filled ? "currentColor" : "rgba(0,0,0,0.5)"}
      stroke="#fff"
      strokeWidth={2}
      {...p}
    >
      <path d="M16 28c7-4.7 12-10.5 12-16a6.6 6.6 0 0 0-12-3.6A6.6 6.6 0 0 0 4 12c0 5.5 5 11.3 12 16Z" />
    </svg>
  );
}

export const ChevronLeft = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <path d="m15 5-7 7 7 7" />
  </svg>
);

export const ChevronRight = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <path d="m9 5 7 7-7 7" />
  </svg>
);

export const ChevronDown = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <path d="m5 9 7 7 7-7" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const FilterIcon = (p: P) => (
  <svg {...base(p)} width="16" height="16">
    <path d="M3 7h18M7 12h10M10 17h4" />
  </svg>
);

export const GoogleIcon = (p: P) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...p}
  >
    <path d="M21.6 12.2c0-.7-.06-1.4-.18-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z" />
    <path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a5.9 5.9 0 0 1-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
    <path d="M6.4 14a6 6 0 0 1 0-3.8V7.6H3.1a10 10 0 0 0 0 8.9L6.4 14Z" />
    <path d="M12 6a5.4 5.4 0 0 1 3.8 1.5L18.7 5A9.6 9.6 0 0 0 12 2.2a10 10 0 0 0-8.9 5.4l3.3 2.6A5.9 5.9 0 0 1 12 6Z" />
  </svg>
);

/** The authentic Airbnb Bélo mark (simple-icons path). */
export const Logo = (p: P) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...p}
  >
    <path d="M12.001 18.275c-1.353-1.697-2.148-3.184-2.413-4.457-.263-1.027-.16-1.848.291-2.465.477-.71 1.188-1.056 2.121-1.056s1.643.345 2.12 1.063c.446.61.558 1.432.286 2.465-.291 1.298-1.085 2.785-2.412 4.458zm9.601 1.14c-.185 1.246-1.034 2.28-2.2 2.783-2.253.98-4.483-.583-6.392-2.704 3.157-3.951 3.74-7.028 2.385-9.018-.795-1.14-1.933-1.695-3.394-1.695-2.944 0-4.563 2.49-3.927 5.382.37 1.565 1.352 3.343 2.917 5.332-.98 1.085-1.91 1.856-2.732 2.333-.636.344-1.245.558-1.828.609-2.679.399-4.778-2.2-3.825-4.88.132-.345.395-.98.845-1.961l.025-.053c1.464-3.178 3.242-6.79 5.285-10.795l.053-.132.58-1.116c.45-.822.635-1.19 1.351-1.643.346-.21.77-.315 1.246-.315.954 0 1.698.558 2.016 1.007.158.239.345.557.582.953l.558 1.089.08.159c2.041 4.004 3.821 7.608 5.279 10.794l.026.025.533 1.22.318.764c.243.613.294 1.222.213 1.858zm1.22-2.39c-.186-.583-.505-1.271-.9-2.094v-.03c-1.889-4.006-3.642-7.608-5.307-10.844l-.111-.163C15.317 1.461 14.468 0 12.001 0c-2.44 0-3.476 1.695-4.535 3.898l-.081.16c-1.669 3.236-3.421 6.843-5.303 10.847v.053l-.559 1.22c-.21.504-.317.768-.345.847C-.172 20.74 2.611 24 5.98 24c.027 0 .132 0 .265-.027h.372c1.75-.213 3.554-1.325 5.384-3.317 1.829 1.989 3.635 3.104 5.382 3.317h.372c.133.027.239.027.265.027 3.37.003 6.152-3.261 4.802-6.975z" />
  </svg>
);

/** Category icons keyed by name (simple line glyphs). */
const CATEGORY_PATHS: Record<string, string> = {
  trending: "M3 17l6-6 4 4 8-8M21 7v6h-6",
  views: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  beach:
    "M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0M3 15c1-5 5-9 9-9 0 0-1 4-3 6M12 6c3-2 7-2 9 0M7 10c0-3 1-5 5-5",
  cabin:
    "M3 21V10l9-7 9 7v11M9 21v-6h6v6M8 10h8M10 7h4",
  pool:
    "M2 18c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M8 14V4a2 2 0 1 1 4 0M16 14V4a2 2 0 1 1 4 0M8 8h8M8 12h8",
  tiny:
    "M4 21V8l8-5 8 5v13M10 21v-5h4v5M9 10h6",
  countryside:
    "M3 21h18M5 21V10l4-4 4 4v11M13 21v-7l3-3 3 3v7M8 21v-4",
  treehouse:
    "M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9Zm-3 9h6M12 12v6M9 9l1.5 3M15 9l-1.5 3",
  room: "M4 4h16v16H4zM4 10h16M10 10v10",
  design: "M12 3l2.5 5 5.5 1-4 4 1 5.5L12 16l-5 2.5L8 13 4 9l5.5-1L12 3Z",
  camping:
    "M12 4 2 20h20L12 4Zm0 8-4 8h8l-4-8Z",
  lake: "M2 16c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M2 20c2-1.5 4-1.5 6 0s4 1.5 6 0 4-1.5 6 0M12 3l5 8H7l5-8Z",
  luxe: "M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5M8 8h8M8 16h8",
};

export function CategoryIcon({ name, ...p }: P & { name: string }) {
  const d = CATEGORY_PATHS[name] ?? CATEGORY_PATHS.design;
  return (
    <svg {...base({ strokeWidth: 1.5, ...p })}>
      <path d={d} />
    </svg>
  );
}


/** ---- Colourful tab icons mirroring Airbnb's All/Homes/Experiences/Services glyphs ---- */

export const GlobeTabIcon = (p: P) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...p}>
    <circle cx="16" cy="16" r="12" fill="#8ED0F0" />
    <path
      d="M11 6.6c-2.3 1-4.2 2.8-5.3 5.1 1.4-.4 3.1-.2 4.3.8 1.4 1.2 3.5 1.2 5-.1 1.1-1 2.7-1.3 4-.7l4.6 1.9A12 12 0 0 0 12.9 5.3c-.6-.1-1.3 0-1.9.3Zm-6.9 8.6A12 12 0 0 0 15.6 28c1.9 0 3.7-.4 5.3-1.2-.4-1.6-1.6-3-3.3-3.3-1.9-.4-3.8-.4-5.6-1.3-1.4-.7-2.6-1.9-3.5-3.2-.6-.9-1.4-1.7-2.4-2.1Zm17.3 8.6a12 12 0 0 0 6.4-8.6c-1.2-.6-2.7-.5-3.8.4-1.4 1.1-2 2.9-1.7 4.6.1.7.4 1.4-.2 1.9-.3.3-.6.4-.7.7Z"
      fill="#5FBD58"
    />
    <circle cx="16" cy="16" r="11.4" fill="none" stroke="#3E9AD9" strokeWidth="1.2" />
  </svg>
);

export const HomesTabIcon = (p: P) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...p}>
    <path d="M3 14.5 16 4l13 10.5" fill="none" stroke="#D1603D" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 13.6V27h20V13.6" fill="#F6E7C9" />
    <path d="M6 13.6V27h20V13.6" fill="none" stroke="#D1603D" strokeWidth="2.4" strokeLinecap="round" />
    <rect x="13" y="18.5" width="6" height="8.5" rx="0.8" fill="#8A5A33" />
    <rect x="9.5" y="17" width="4" height="4" rx="0.6" fill="#BFDBF7" />
    <rect x="18.5" y="17" width="4" height="4" rx="0.6" fill="#BFDBF7" />
  </svg>
);

export const ExperiencesTabIcon = (p: P) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...p}>
    <path d="M16 2.5c5.5 0 10 4 10 9.4 0 5.1-4.6 9.3-8.4 11.6h-3.2C10.6 21.2 6 17 6 11.9 6 6.5 10.5 2.5 16 2.5Z" fill="#FF8A80" />
    <path d="M16 2.5c-2 0-3.8.6-5.3 1.6L13 23.5h6l2.3-19.4A10.4 10.4 0 0 0 16 2.5Z" fill="#E0453E" />
    <path d="M11 23.5h10l-1.2 1.8h-7.6L11 23.5Z" fill="#C62828" />
    <path d="M13.6 25.3h4.8l.8 2.6a1.6 1.6 0 0 1-1.5 2h-3.4a1.6 1.6 0 0 1-1.5-2l.8-2.6Z" fill="#8A5A33" />
  </svg>
);

export const ServicesTabIcon = (p: P) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...p}>
    <circle cx="16" cy="7.5" r="2.2" fill="#9AA0A6" />
    <path d="M6.5 22a9.5 9.5 0 0 1 19 0Z" fill="#C7CBD1" />
    <path d="M6.5 22a9.5 9.5 0 0 1 4.4-8 6.8 6.8 0 0 0-1.9 8Z" fill="#DEE1E6" />
    <rect x="4" y="22.6" width="24" height="3.2" rx="1.6" fill="#9AA0A6" />
  </svg>
);