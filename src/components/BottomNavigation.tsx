import { NavLink } from "react-router-dom";

type BottomNavigationProps = {
  tripId: string;
};

const items = [
  { label: "概要", icon: "OV", to: "" },
  { label: "予定", icon: "SC", to: "/schedule" },
  { label: "宿", icon: "HT", to: "/hotel" },
  { label: "経費", icon: "EX", to: "/expenses" },
  { label: "麻雀", icon: "MJ", to: "/mahjong" },
];

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
        <span className="bottom-nav__icon">{item.icon}</span>
        <span>{item.label}</span>
      </NavLink>
    ))}
  </nav>
);
