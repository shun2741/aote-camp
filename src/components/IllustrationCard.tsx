import { useState } from "react";

type IllustrationCardProps = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
};

export const IllustrationCard = ({
  src,
  alt,
  eyebrow,
  title,
  description,
}: IllustrationCardProps) => {
  const [hasError, setHasError] = useState(false);

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
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
        />
      )}
      <div className="illustration-card__body">
        <p className="eyebrow">{eyebrow}</p>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </section>
  );
};
