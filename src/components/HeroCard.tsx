import type { ReactNode } from "react";

type HeroCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: Array<{ label: string; value: string }>;
  actions?: ReactNode;
};

export const HeroCard = ({
  eyebrow,
  title,
  description,
  meta,
  actions,
}: HeroCardProps) => (
  <section className="hero-card">
    <div className="hero-card__backdrop" />
    <div className="hero-card__content">
      {eyebrow ? <p className="hero-card__eyebrow">{eyebrow}</p> : null}
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
