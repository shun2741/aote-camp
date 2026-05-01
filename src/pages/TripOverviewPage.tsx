import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { HeroCard } from "../components/HeroCard";
import { InfoIcon, type InfoIconName } from "../components/InfoIcon";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { StatusTag } from "../components/StatusTag";
import { TripBoardCard } from "../components/TripBoardCard";
import { getTripById } from "../data/trips";
import { formatDateRange, joinNames } from "../lib/format";
import { NotFoundPage } from "./NotFoundPage";

const menuItems = [
  {
    key: "schedule",
    label: "スケジュール",
    description: "日別の予定と移動を時系列で確認",
    suffix: "/schedule",
    icon: "schedule",
  },
  {
    key: "hotel",
    label: "ホテル",
    description: "宿泊先、部屋割り、チェックイン情報",
    suffix: "/hotel",
    icon: "hotel",
  },
  {
    key: "expenses",
    label: "経費",
    description: "立替一覧と最終精算額",
    suffix: "/expenses",
    icon: "expenses",
  },
  {
    key: "mahjong",
    label: "麻雀",
    description: "半荘ごとの点数を集計",
    suffix: "/mahjong",
    icon: "mahjong",
  },
] satisfies Array<{ key: string; label: string; description: string; suffix: string; icon: InfoIconName }>;

export const TripOverviewPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const keyMoments = trip.schedule
    .flatMap((day) =>
      day.events.map((event) => ({
        time: event.time,
        label: event.title,
        detail: event.location ?? day.label,
        important: event.important,
      })),
    )
    .filter((event) => event.important || event.time)
    .slice(0, 4);

  return (
    <AppShell
      title={trip.title}
      subtitle={trip.destination}
      backTo="/"
      backLabel="一覧"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title={trip.title}
          icon="trip"
          meta={[
            { label: "日程", value: formatDateRange(trip.startDate, trip.endDate) },
            { label: "参加者", value: `${trip.members.length}人` },
            { label: "状態", value: trip.status === "planning" ? "計画中" : "実施済み" },
          ]}
        />

        <TripBoardCard
          title="今回の流れ"
          subtitle={trip.destination}
          note="集合からテニス、夜の麻雀まで。"
          moments={keyMoments}
          stats={[
            { label: "日程", value: formatDateRange(trip.startDate, trip.endDate) },
            { label: "参加者", value: `${trip.members.length}人` },
            { label: "状態", value: trip.status === "planning" ? "計画中" : "実施済み" },
          ]}
        />

        <section className="stack-md">
          <SectionHeader title="旅のまとめ" />
          <div className="detail-grid">
            <StandardCard>
              <div className="inline-cluster">
                <StatusTag type="status" value={trip.status} />
              </div>
              <h3>概要メモ</h3>
              <p>{trip.summary}</p>
            </StandardCard>
            <StandardCard>
              <h3>参加メンバー</h3>
              <p>{joinNames(trip.members)}</p>
            </StandardCard>
          </div>
        </section>

        <section className="stack-md">
          <SectionHeader title="ページを開く" />
          <div className="action-grid">
            {menuItems.map((item) => (
              <Link className="action-card" key={item.key} to={`/trips/${trip.id}${item.suffix}`}>
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
};
