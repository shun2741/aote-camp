import { Link, useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { StatusTag } from "../components/StatusTag";
import { getTripById } from "../data/trips";
import { formatDateRange, joinNames } from "../lib/format";
import { NotFoundPage } from "./NotFoundPage";

const menuItems = [
  {
    key: "schedule",
    label: "スケジュール",
    description: "日別の予定と移動を時系列で確認",
    suffix: "/schedule",
  },
  {
    key: "hotel",
    label: "ホテル",
    description: "宿泊先、部屋割り、チェックイン情報",
    suffix: "/hotel",
  },
  {
    key: "expenses",
    label: "経費",
    description: "立替一覧と最終精算額",
    suffix: "/expenses",
  },
  {
    key: "mahjong",
    label: "麻雀",
    description: "ウマ・オカ込みの収支を集計",
    suffix: "/mahjong",
  },
];

export const TripOverviewPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

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
          description={trip.summary}
          meta={[
            { label: "日程", value: formatDateRange(trip.startDate, trip.endDate) },
            { label: "参加者", value: `${trip.members.length}人` },
            { label: "状態", value: trip.status === "planning" ? "計画中" : "実施済み" },
          ]}
        />

        <section className="stack-md">
          <SectionHeader
            title="旅のまとめ"
            description="今回の旅行の全体像と、必要なページへの入口をまとめています。"
          />
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
          <SectionHeader
            title="ページを開く"
            description="旅行中でも押しやすい大きめカードで移動できます。"
          />
          <div className="action-grid">
            {menuItems.map((item) => (
              <Link className="action-card" key={item.key} to={`/trips/${trip.id}${item.suffix}`}>
                <span className="action-card__badge">{item.label.slice(0, 2)}</span>
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
