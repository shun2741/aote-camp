import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { StandardCard } from "../components/StandardCard";

export const NotFoundPage = () => (
  <AppShell title="Not Found" subtitle="Page missing">
    <StandardCard className="stack-sm">
      <h2>ページが見つかりません</h2>
      <p>指定された旅行データ、またはページパスが存在しません。</p>
      <Link className="button button--primary" to="/">
        トップへ戻る
      </Link>
    </StandardCard>
  </AppShell>
);
