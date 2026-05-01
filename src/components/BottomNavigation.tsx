import { NavLink } from "react-router-dom";
import { InfoIcon, type InfoIconName } from "./InfoIcon";

type BottomNavigationProps = {
  tripId: string;
};

const items = [
  { label: "概要", icon: "trip", to: "" },
  { label: "予定", icon: "schedule", to: "/schedule" },
  { label: "宿", icon: "hotel", to: "/hotel" },
  { label: "経費", icon: "expenses", to: "/expenses" },
  { label: "麻雀", icon: "mahjong", to: "/mahjong" },
] satisfies Array<{ label: string; icon: InfoIconName; to: string }>;

export const BottomNavigation = ({ tripId }: BottomNavigationProps) => (
  <nav className="bottom-nav" aria-label="旅行ナビゲーション">
    {items.map((item) => (
      <NavLink
        key={item.label}
        to={`/trips/${tripId}${item.to}`}
        end={item.to === ""}
        className={({ isActive }) =>
          `bottom-nav__link ${isActive ? "bottom-nav__link--active" : ""}`
        }
      >
        <span className="bottom-nav__icon" aria-hidden="true">
          <InfoIcon name={item.icon} className="bottom-nav__icon-svg" />
        </span>
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);
