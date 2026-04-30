import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { HeroCard } from "../components/HeroCard";
import { IllustrationCard } from "../components/IllustrationCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { StatusTag } from "../components/StatusTag";
import { TripBoardCard } from "../components/TripBoardCard";
import { latestTrip, trips } from "../data/trips";
import { formatDateRange } from "../lib/format";

const latestMoments = latestTrip.schedule
  .flatMap((day) => day.events.map((event) => ({ ...event, day: day.label })))
  .filter((event) => event.important || event.time)
  .slice(0, 4)
  .map((event) => ({
    time: event.time,
    label: event.title,
    detail: event.location ?? event.day,
  }));

export const HomePage = () => (
  <AppShell title="AOTE Camp" subtitle="みんなで見る旅行ノート">
    <div className="stack-lg">
      <HeroCard
        eyebrow="みんなの旅しおり"
        title="次の予定も、あとからの精算も、ここでひとまとめ。"
        description="集合時間、宿、立替、麻雀の結果まで、友達同士で見返しやすい形に整理した旅行ページです。"
        meta={[
          { label: "旅行数", value: `${trips.length}` },
          { label: "最新", value: latestTrip.title },
          { label: "見やすさ", value: "スマホ優先" },
        ]}
        actions={
          <Link className="button button--primary" to={`/trips/${latestTrip.id}`}>
            最新の旅へ
          </Link>
        }
      />

      <TripBoardCard
        title={latestTrip.title}
        subtitle="今回のざっくり流れ"
        note="集合からテニス、夜の麻雀まで、1画面で把握できる旅のしおり。"
        moments={latestMoments}
        stats={[
          { label: "日程", value: formatDateRange(latestTrip.startDate, latestTrip.endDate) },
          { label: "参加人数", value: `${latestTrip.members.length}人` },
          { label: "メイン会場", value: latestTrip.destination },
        ]}
      />

      <IllustrationCard
        src="/hero-gw-tennis.png"
        alt="ゴールデンウィークのテニス合宿イメージ"
        eyebrow="旅のイメージ"
        title="現地に着いた瞬間の空気感を先に共有"
        description="トップの大きな絵として使う想定です。集合前に見ても、どんな旅かすぐ伝わる位置に置いています。"
      />

      <section className="stack-md">
        <SectionHeader
          title="まず見るページ"
          description="今年の旅行にすぐ入れるショートカットです。"
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
          title="これまでの旅行"
          description="過去分も同じ見た目で並べて、あとから見返しやすくしています。"
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
