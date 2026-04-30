import { useState } from "react";
import { InfoIcon } from "./InfoIcon";

type IllustrationCardProps = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  icon?: "image";
};

export const IllustrationCard = ({
  src,
  alt,
  eyebrow,
  title,
  description,
  icon = "image",
}: IllustrationCardProps) => {
  const [hasError, setHasError] = useState(false);
  const resolvedSrc = src.startsWith("/") ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src;

  return (
    <section className="illustration-card">
      {hasError ? (
        <div className="illustration-card__fallback" aria-hidden="true">
          <span className="illustration-card__dot illustration-card__dot--a" />
          <span className="illustration-card__dot illustration-card__dot--b" />
          <span className="illustration-card__line illustration-card__line--a" />
          <span className="illustration-card__line illustration-card__line--b" />
        </div>
      ) : (
        <img
          className="illustration-card__image"
          src={resolvedSrc}
          alt={alt}
          onError={() => setHasError(true)}
        />
      )}
      <div className="illustration-card__body">
        <p className="eyebrow">{eyebrow}</p>
        <div className="illustration-card__heading">
          <span className="icon-chip" aria-hidden="true">
            <InfoIcon name={icon} className="icon-chip__icon" />
          </span>
          <h3>{title}</h3>
        </div>
        <p>{description}</p>
      </div>
    </section>
  );
};
