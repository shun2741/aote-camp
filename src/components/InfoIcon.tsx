type InfoIconName =
  | "image"
  | "route"
  | "tennis"
  | "golf"
  | "mahjong"
  | "bath";

type InfoIconProps = {
  name: InfoIconName;
  className?: string;
};

export const InfoIcon = ({ name, className }: InfoIconProps) => {
  switch (name) {
    case "image":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3.5" y="5" width="17" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="9" cy="10" r="1.8" fill="currentColor" />
          <path
            d="M5.5 16l4.2-4.2a1.4 1.4 0 0 1 2 0l1.8 1.8a1.4 1.4 0 0 0 2 0L18.5 11l2 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "route":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="7" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17" cy="17.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M9.5 7h2.2a3 3 0 0 1 3 3v2a3 3 0 0 0 3 3H19"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case "tennis":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r="5.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6.5 6.5l7 7M13.5 6.5l-7 7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M13.8 13.8l5.2 5.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "golf":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 4v15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M8 4.5l7 2.7-7 2.8z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path d="M4.5 19.5a7.5 2 0 0 0 15 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "mahjong":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="4" y="5" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="9.5" y="5" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <rect x="15" y="5" width="5" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M6.5 9.5h0M12 9.5h0M17.5 9.5h0" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "bath":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12.5h14v2.5a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 12.5V9.8A2.8 2.8 0 0 1 10.8 7H12a2 2 0 0 1 2 2v3.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M7 5.5c.8.5.8 1.5 0 2M12 4.5c.8.5.8 1.5 0 2M17 5.5c.8.5.8 1.5 0 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
};
