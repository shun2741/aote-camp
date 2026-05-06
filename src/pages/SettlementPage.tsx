import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { usePersistentState } from "../hooks/usePersistentState";
import { calculateExpenseSummary } from "../lib/expenses";
import {
  buildCompletedMahjongGames,
  createInitialMahjongDraftState,
  defaultMahjongRule,
  migrateMahjongDraftState,
} from "../lib/mahjongDraft";
import { formatCurrency, formatDateRange } from "../lib/format";
import { calculateMahjongSummary } from "../lib/mahjong";
import type { MahjongDraftState } from "../types/shared";
import { NotFoundPage } from "./NotFoundPage";

export const SettlementPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const [draftExpenses] = usePersistentState(`trip-expenses:${trip.id}`, trip.expenses);
  const [mahjongDraft] = usePersistentState<MahjongDraftState>(
    `trip-mahjong:${trip.id}`,
    createInitialMahjongDraftState(),
  );

  const migratedMahjongDraft = useMemo(
    () => migrateMahjongDraftState(mahjongDraft as unknown, trip),
    [mahjongDraft, trip],
  );

  const mahjongSummary = useMemo(() => {
    const completedGames = buildCompletedMahjongGames(migratedMahjongDraft);
    return completedGames.length > 0
      ? calculateMahjongSummary({
          title: `${trip.title} 麻雀`,
          rule: defaultMahjongRule,
          games: completedGames.map(({ label, results }) => ({ label, results })),
        })
      : null;
  }, [migratedMahjongDraft, trip.title]);

  const summary = useMemo(
    () => calculateExpenseSummary(trip.members, draftExpenses, mahjongSummary?.standings ?? []),
    [draftExpenses, mahjongSummary?.standings, trip.members],
  );

  return (
    <AppShell title="精算まとめ" subtitle={trip.title} backTo={`/trips/${trip.id}/expenses`} backLabel="経費">
      <div className="stack-lg settlement-sheet">
        <HeroCard
          eyebrow={trip.destination}
          title="精算まとめ"
          icon="expenses"
          meta={[
            { label: "日程", value: formatDateRange(trip.startDate, trip.endDate) },
            { label: "通常経費", value: formatCurrency(summary.expenseTotalAmount) },
            { label: "麻雀精算", value: formatCurrency(summary.mahjongTotalAmount) },
          ]}
          actions={
            <button className="button button--primary print-hide" type="button" onClick={() => window.print()}>
              印刷 / PDF保存
            </button>
          }
        />

        <section className="stack-md">
          <SectionHeader title="支払い一覧" />
          <StandardCard className="stack-sm">
            {summary.payments.length === 0 ? (
              <p className="muted-text">まだ精算はありません。</p>
            ) : (
              summary.payments.map((payment) => (
                <div className="payment-row" key={`${payment.from}-${payment.to}`}>
                  <span>{payment.from}</span>
                  <strong>
                    {payment.from} → {payment.to}
                  </strong>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
              ))
            )}
          </StandardCard>
        </section>

        <section className="stack-md">
          <SectionHeader title="メンバー別内訳" />
          <div className="stack-md">
            {summary.balances.map((balance) => (
              <StandardCard key={balance.name}>
                <div className="card-header">
                  <div>
                    <p className="eyebrow">{balance.name}</p>
                    <h3>精算内訳</h3>
                  </div>
                  <strong className={balance.net >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                    {balance.net >= 0 ? "+" : "-"}
                    {formatCurrency(Math.abs(balance.net))}
                  </strong>
                </div>
                <div className="detail-grid">
                  <div className="metric-card">
                    <span>立替</span>
                    <strong>{formatCurrency(balance.paid)}</strong>
                  </div>
                  <div className="metric-card">
                    <span>通常負担</span>
                    <strong>{formatCurrency(balance.share)}</strong>
                  </div>
                  <div className="metric-card">
                    <span>麻雀</span>
                    <strong className={balance.mahjong >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                      {balance.mahjong >= 0 ? "+" : ""}
                      {formatCurrency(balance.mahjong)}
                    </strong>
                  </div>
                </div>
                <div className="breakdown-list">
                  {balance.breakdown.map((item, index) => (
                    <div className="breakdown-row" key={`${balance.name}-${item.label}-${index}`}>
                      <span>{item.label}</span>
                      <strong className={item.amount >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                        {item.amount >= 0 ? "+" : ""}
                        {formatCurrency(item.amount)}
                      </strong>
                    </div>
                  ))}
                </div>
              </StandardCard>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};
