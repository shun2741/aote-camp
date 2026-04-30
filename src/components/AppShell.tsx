import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type AppShellProps = {
  title: string;
  subtitle?: string;
  backTo?: string;
  backLabel?: string;
  bottomNav?: ReactNode;
  children: ReactNode;
};

export const AppShell = ({
  title,
  subtitle,
  backTo,
  backLabel = "戻る",
  bottomNav,
  children,
}: AppShellProps) => (
  <div className="app-shell">
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__lead">
          {backTo ? (
            <Link className="back-link" to={backTo}>
              {backLabel}
            </Link>
          ) : (
            <Link className="brand-mark" to="/">
              旅
            </Link>
          )}
          <div>
            <p className="app-header__title">{title}</p>
            {subtitle ? <p className="app-header__subtitle">{subtitle}</p> : null}
          </div>
        </div>
        <Link className="brand-chip" to="/">
          旅行一覧
        </Link>
      </div>
    </header>
    <main className={`page-frame ${bottomNav ? "page-frame--with-nav" : ""}`}>{children}</main>
    {bottomNav}
  </div>
);
