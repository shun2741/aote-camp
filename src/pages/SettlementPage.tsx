import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { InfoIcon } from "../components/InfoIcon";
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

  const sortedBalances = useMemo(
    () => [...summary.balances].sort((left, right) => right.net - left.net),
    [summary.balances],
  );

  const positiveBalances = sortedBalances.filter((balance) => balance.net > 0);
  const negativeBalances = sortedBalances.filter((balance) => balance.net < 0);

  return (
    <AppShell title="精算まとめ" subtitle={trip.title} backTo={`/trips/${trip.id}/expenses`} backLabel="経費">
      <div className="settlement-sheet">
        <section className="settlement-board">
          <div className="settlement-board__header">
            <div className="settlement-board__title-block">
              <p className="settlement-board__eyebrow">{trip.destination}</p>
              <h1>精算まとめ</h1>
              <p className="settlement-board__subline">
                {formatDateRange(trip.startDate, trip.endDate)} / {trip.members.length}人
              </p>
            </div>
            <div className="settlement-board__actions print-hide">
              <button className="button button--primary" type="button" onClick={() => window.print()}>
                印刷 / PDF保存
              </button>
            </div>
          </div>

          <div className="settlement-metrics">
            <article className="settlement-metric">
              <span>通常経費</span>
              <strong>{formatCurrency(summary.expenseTotalAmount)}</strong>
            </article>
            <article className="settlement-metric">
              <span>麻雀精算</span>
              <strong>{formatCurrency(summary.mahjongTotalAmount)}</strong>
            </article>
            <article className="settlement-metric">
              <span>合計表示</span>
              <strong>{formatCurrency(summary.totalAmount)}</strong>
            </article>
            <article className="settlement-metric">
              <span>支払い件数</span>
              <strong>{summary.payments.length}件</strong>
            </article>
          </div>

          <div className="settlement-top-grid">
            <section className="settlement-panel settlement-panel--payments">
              <div className="settlement-panel__header">
                <span className="icon-chip" aria-hidden="true">
                  <InfoIcon name="expenses" className="icon-chip__icon" />
                </span>
                <div>
                  <p className="eyebrow">Core</p>
                  <h2>支払い一覧</h2>
                </div>
              </div>
              <div className="settlement-payment-list">
                {summary.payments.length === 0 ? (
                  <p className="muted-text">まだ精算はありません。</p>
                ) : (
                  summary.payments.map((payment) => (
                    <div className="settlement-payment-card" key={`${payment.from}-${payment.to}`}>
                      <div className="settlement-payment-card__route">
                        <span>{payment.from}</span>
                        <strong>→</strong>
                        <span>{payment.to}</span>
                      </div>
                      <strong className="settlement-payment-card__amount">{formatCurrency(payment.amount)}</strong>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="settlement-panel">
              <div className="settlement-panel__header">
                <span className="icon-chip" aria-hidden="true">
                  <InfoIcon name="people" className="icon-chip__icon" />
                </span>
                <div>
                  <p className="eyebrow">Overview</p>
                  <h2>最終差額</h2>
                </div>
              </div>
              <div className="settlement-balance-columns">
                <div className="settlement-balance-group">
                  <span className="settlement-balance-group__label">受け取り</span>
                  <div className="settlement-balance-list">
                    {positiveBalances.length === 0 ? (
                      <p className="muted-text">なし</p>
                    ) : (
                      positiveBalances.map((balance) => (
                        <div className="settlement-balance-row" key={`positive-${balance.name}`}>
                          <span>{balance.name}</span>
                          <strong className="score-tone score-tone--positive">+{formatCurrency(balance.net)}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="settlement-balance-group">
                  <span className="settlement-balance-group__label">支払い</span>
                  <div className="settlement-balance-list">
                    {negativeBalances.length === 0 ? (
                      <p className="muted-text">なし</p>
                    ) : (
                      negativeBalances.map((balance) => (
                        <div className="settlement-balance-row" key={`negative-${balance.name}`}>
                          <span>{balance.name}</span>
                          <strong className="score-tone score-tone--negative">{formatCurrency(balance.net)}</strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="settlement-panel">
            <div className="settlement-panel__header">
              <span className="icon-chip" aria-hidden="true">
                <InfoIcon name="route" className="icon-chip__icon" />
              </span>
              <div>
                <p className="eyebrow">Table</p>
                <h2>メンバー別一覧</h2>
              </div>
            </div>
            <div className="settlement-table">
              <div className="settlement-table__head settlement-table__row">
                <span>名前</span>
                <span>立替</span>
                <span>通常負担</span>
                <span>麻雀</span>
                <span>差額</span>
              </div>
              {sortedBalances.map((balance) => (
                <div className="settlement-table__row" key={balance.name}>
                  <strong>{balance.name}</strong>
                  <span>{formatCurrency(balance.paid)}</span>
                  <span>{formatCurrency(balance.share)}</span>
                  <span className={balance.mahjong >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                    {balance.mahjong >= 0 ? "+" : ""}
                    {formatCurrency(balance.mahjong)}
                  </span>
                  <span className={balance.net >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                    {balance.net >= 0 ? "+" : ""}
                    {formatCurrency(balance.net)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="settlement-panel">
            <div className="settlement-panel__header">
              <span className="icon-chip" aria-hidden="true">
                <InfoIcon name="mahjong" className="icon-chip__icon" />
              </span>
              <div>
                <p className="eyebrow">Details</p>
                <h2>個人別内訳</h2>
              </div>
            </div>
            <div className="settlement-breakdown-grid">
              {sortedBalances.map((balance) => (
                <article className="settlement-breakdown-card" key={`breakdown-${balance.name}`}>
                  <div className="settlement-breakdown-card__head">
                    <div>
                      <p className="eyebrow">{balance.name}</p>
                      <h3>内訳</h3>
                    </div>
                    <strong className={balance.net >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                      {balance.net >= 0 ? "+" : ""}
                      {formatCurrency(balance.net)}
                    </strong>
                  </div>
                  <div className="settlement-breakdown-card__meta">
                    <span>立替 {formatCurrency(balance.paid)}</span>
                    <span>通常負担 {formatCurrency(balance.share)}</span>
                    <span className={balance.mahjong >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                      麻雀 {balance.mahjong >= 0 ? "+" : ""}
                      {formatCurrency(balance.mahjong)}
                    </span>
                  </div>
                  <div className="breakdown-list">
                    {balance.breakdown.length === 0 ? (
                      <p className="muted-text">内訳はまだありません。</p>
                    ) : (
                      balance.breakdown.map((item, index) => (
                        <div className="breakdown-row" key={`${balance.name}-${item.label}-${index}`}>
                          <span>{item.label}</span>
                          <strong className={item.amount >= 0 ? "score-tone score-tone--positive" : "score-tone score-tone--negative"}>
                            {item.amount >= 0 ? "+" : ""}
                            {formatCurrency(item.amount)}
                          </strong>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </AppShell>
  );
};
