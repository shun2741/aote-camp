import { Link } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { HeroCard } from "../components/HeroCard";
import { InfoIcon, type InfoIconName } from "../components/InfoIcon";
import { SectionHeader } from "../components/SectionHeader";
import { TripBoardCard } from "../components/TripBoardCard";
import { latestTrip } from "../data/trips";
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

const shortcutItems = [
  { label: "旅の概要", description: "参加メンバーと全体像", to: "", icon: "trip" },
  { label: "スケジュール", description: "集合時間と流れ", to: "/schedule", icon: "schedule" },
  { label: "ホテル", description: "宿と館内設備", to: "/hotel", icon: "hotel" },
  { label: "経費", description: "立替と精算", to: "/expenses", icon: "expenses" },
  { label: "麻雀", description: "半荘ごとの点数", to: "/mahjong", icon: "mahjong" },
] satisfies Array<{ label: string; description: string; to: string; icon: InfoIconName }>;

export const HomePage = () => (
  <AppShell title="青テ旅行" subtitle={latestTrip.title}>
    <div className="stack-lg">
      <HeroCard
        eyebrow={latestTrip.title}
        title="青テ旅行"
        icon="trip"
        backgroundImage="/hero-gw-tennis.png"
        meta={[
          { label: "日程", value: formatDateRange(latestTrip.startDate, latestTrip.endDate) },
          { label: "場所", value: latestTrip.destination },
          { label: "参加", value: `${latestTrip.members.length}人` },
        ]}
        actions={
          <Link className="button button--primary" to={`/trips/${latestTrip.id}`}>
            旅を開く
          </Link>
        }
      />

      <TripBoardCard
        title={latestTrip.title}
        subtitle="今回のざっくり流れ"
        note="5/4 13:00集合。テニス、温泉、夜は麻雀。"
        moments={latestMoments}
        stats={[
          { label: "日程", value: formatDateRange(latestTrip.startDate, latestTrip.endDate) },
          { label: "参加人数", value: `${latestTrip.members.length}人` },
          { label: "メイン会場", value: latestTrip.destination },
        ]}
      />

      <section className="stack-md">
        <SectionHeader title="ページ一覧" />
        <div className="action-grid">
          {shortcutItems.map((item) => (
            <Link className="action-card" key={item.label} to={`/trips/${latestTrip.id}${item.to}`}>
              <span className="action-card__badge" aria-hidden="true">
                <InfoIcon name={item.icon} className="action-card__icon-svg" />
              </span>
              <div>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </AppShell>
);
