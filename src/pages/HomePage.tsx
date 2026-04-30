import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { StatusTag } from "../components/StatusTag";
import { latestTrip, trips } from "../data/trips";
import { formatDateRange } from "../lib/format";

export const HomePage = () => (
  <AppShell title="AOTE Camp" subtitle="Friends travel board">
    <div className="stack-lg">
      <HeroCard
        eyebrow="Ride the Trip."
        title="仲間との旅を、クールにまとめる。"
        description="毎年の旅行を1つのURLに集約。予定、宿、経費、麻雀精算までスマホで素早く確認できます。"
        meta={[
          { label: "Trips", value: `${trips.length}` },
          { label: "Latest", value: latestTrip.title },
          { label: "Focus", value: "Mobile First" },
        ]}
        actions={
          <Link className="button button--primary" to={`/trips/${latestTrip.id}`}>
            最新の旅へ
          </Link>
        }
      />

      <section className="stack-md">
        <SectionHeader
          title="Latest Drop"
          description="今年の旅行ページに最短で入るためのショートカット。"
        />
        <StandardCard className="trip-highlight">
          <div className="trip-highlight__body">
            <div>
              <div className="inline-cluster">
                <StatusTag type="status" value={latestTrip.status} />
                <span className="eyebrow">{latestTrip.destination}</span>
              </div>
              <h2>{latestTrip.title}</h2>
              <p>{latestTrip.summary}</p>
            </div>
            <div className="metric-grid">
              <div className="metric-card">
                <span>日程</span>
                <strong>{formatDateRange(latestTrip.startDate, latestTrip.endDate)}</strong>
              </div>
              <div className="metric-card">
                <span>参加人数</span>
                <strong>{latestTrip.members.length}人</strong>
              </div>
            </div>
          </div>
          <Link className="button button--secondary" to={`/trips/${latestTrip.id}`}>
            ページを開く
          </Link>
        </StandardCard>
      </section>

      <section className="stack-md">
        <SectionHeader
          title="Trip Archive"
          description="過去分も同じUIで蓄積。来年以降はデータ追加だけで増やせます。"
        />
        <div className="trip-grid">
          {trips.map((trip) => (
            <StandardCard className="trip-card" key={trip.id}>
              <div className="inline-cluster">
                <StatusTag type="status" value={trip.status} />
                <span className="eyebrow">{trip.destination}</span>
              </div>
              <h3>{trip.title}</h3>
              <p>{trip.summary}</p>
              <dl className="detail-list">
                <div>
                  <dt>日程</dt>
                  <dd>{formatDateRange(trip.startDate, trip.endDate)}</dd>
                </div>
                <div>
                  <dt>参加者</dt>
                  <dd>{trip.members.length}人</dd>
                </div>
              </dl>
              <Link className="button button--ghost" to={`/trips/${trip.id}`}>
                詳細を見る
              </Link>
            </StandardCard>
          ))}
        </div>
      </section>
    </div>
  </AppShell>
);
