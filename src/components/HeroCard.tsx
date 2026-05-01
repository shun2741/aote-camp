import type { ReactNode } from "react";
import { InfoIcon, type InfoIconName } from "./InfoIcon";

type HeroCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: Array<{ label: string; value: string }>;
  actions?: ReactNode;
  icon?: InfoIconName;
  backgroundImage?: string;
};

export const HeroCard = ({
  eyebrow,
  title,
  description,
  meta,
  actions,
  icon,
  backgroundImage,
}: HeroCardProps) => (
  <section className={`hero-card ${backgroundImage ? "hero-card--with-image" : ""}`.trim()}>
    {backgroundImage ? (
      <div
        className="hero-card__media"
        style={{
          backgroundImage: `url(${backgroundImage.startsWith("/") ? `${import.meta.env.BASE_URL}${backgroundImage.slice(1)}` : backgroundImage})`,
        }}
      />
    ) : null}
    <div className="hero-card__backdrop" />
    <div className="hero-card__content">
      {eyebrow || icon ? (
        <div className="hero-card__lead">
          {icon ? (
            <span className="icon-chip hero-card__icon" aria-hidden="true">
              <InfoIcon name={icon} className="icon-chip__icon" />
            </span>
          ) : null}
          {eyebrow ? <p className="hero-card__eyebrow">{eyebrow}</p> : null}
        </div>
      ) : null}
      <h1 className="hero-card__title">{title}</h1>
      {description ? <p className="hero-card__description">{description}</p> : null}
      {meta?.length ? (
        <div className="hero-card__meta">
          {meta.map((item) => (
            <div className="hero-card__meta-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {actions ? <div className="hero-card__actions">{actions}</div> : null}
    </div>
  </section>
);
