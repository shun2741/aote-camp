import type { HTMLAttributes, ReactNode } from "react";

type StandardCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

export const StandardCard = ({
  children,
  className,
  ...props
}: StandardCardProps) => (
  <article className={`surface-card ${className ?? ""}`.trim()} {...props}>
    {children}
  </article>
);
