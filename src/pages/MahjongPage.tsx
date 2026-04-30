import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { formatCurrency, formatNumber } from "../lib/format";
import { calculateMahjongSummary } from "../lib/mahjong";
import { NotFoundPage } from "./NotFoundPage";

export const MahjongPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const summary = trip.mahjong ? calculateMahjongSummary(trip.mahjong) : null;

  return (
    <AppShell
      title="麻雀"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="概要"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="麻雀精算"
          description="素点、ウマ、オカをまとめて計算し、最終収支と支払い一覧に落とし込みます。"
          meta={[
            { label: "ルール", value: "1・2の点5" },
            { label: "半荘数", value: `${trip.mahjong?.games.length ?? 0}` },
            { label: "人数", value: `${trip.mahjong?.games[0]?.results.length ?? 0}` },
          ]}
        />

        {!summary ? (
          <EmptyState
            title="麻雀結果がまだありません"
            description="旅行後に半荘データを追加すれば、そのまま精算まで表示できます。"
          />
        ) : (
          <>
            <section className="stack-md">
              <SectionHeader
                title="最終結果"
                description="半荘ごとのスコアを合算した最終順位です。"
              />
              <div className="detail-grid">
                {summary.standings.map((standing, index) => (
                  <StandardCard key={standing.name} className={index === 0 ? "surface-card--winner" : ""}>
                    <p className="eyebrow">#{index + 1}</p>
                    <h3>{standing.name}</h3>
                    <p className="numeric-highlight">{standing.amount >= 0 ? "+" : ""}{formatCurrency(standing.amount)}</p>
                    <p className="muted-text">合計スコア {standing.score >= 0 ? "+" : ""}{formatNumber(standing.score)}</p>
                  </StandardCard>
                ))}
              </div>
            </section>

            <section className="stack-md">
              <SectionHeader
                title="支払い一覧"
                description="最終収支を相殺した支払い指示です。"
              />
              <StandardCard className="stack-sm">
                {summary.payments.map((payment) => (
                  <div className="payment-row" key={`${payment.from}-${payment.to}`}>
                    <span>{payment.from}</span>
                    <strong>
                      {payment.from} → {payment.to}
                    </strong>
                    <span>{formatCurrency(payment.amount)}</span>
                  </div>
                ))}
              </StandardCard>
            </section>

            <section className="stack-md">
              <SectionHeader
                title="半荘ごとの結果"
                description="各半荘の順位、スコア、円換算結果を確認できます。"
              />
              <div className="stack-md">
                {summary.games.map((game) => (
                  <StandardCard key={game.label}>
                    <div className="card-header">
                      <div>
                        <p className="eyebrow">半荘</p>
                        <h3>{game.label}</h3>
                      </div>
                    </div>
                    <div className="score-grid">
                      {game.rows.map((row) => (
                        <div className="score-row" key={`${game.label}-${row.name}`}>
                          <div>
                            <span className="score-row__rank">#{row.rank}</span>
                            <strong>{row.name}</strong>
                          </div>
                          <div className="score-row__details">
                            <span>{row.point.toLocaleString("ja-JP")}点</span>
                            <span>
                              {row.totalScore >= 0 ? "+" : ""}
                              {formatNumber(row.totalScore)}
                            </span>
                            <strong>{row.amount >= 0 ? "+" : ""}{formatCurrency(row.amount)}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </StandardCard>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
};
