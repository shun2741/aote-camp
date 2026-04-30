import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { StatusTag } from "../components/StatusTag";
import { getTripById } from "../data/trips";
import { calculateExpenseSummary } from "../lib/expenses";
import { formatCurrency } from "../lib/format";
import { splitAmountEvenly } from "../lib/settlement";
import { NotFoundPage } from "./NotFoundPage";

export const ExpensesPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const summary = calculateExpenseSummary(trip.members, trip.expenses);

  return (
    <AppShell
      title="Expenses"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="Trip"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="経費と割り勘"
          description="立替一覧を見ながら、本来負担額との差分から最終支払いを自動算出。"
          meta={[
            { label: "Total", value: formatCurrency(summary.totalAmount) },
            { label: "Items", value: `${trip.expenses.length}` },
            { label: "Settlements", value: `${summary.payments.length}` },
          ]}
        />

        {trip.expenses.length === 0 ? (
          <EmptyState
            title="経費データはまだありません"
            description="旅行後にまとめて登録すれば、このページで自動計算できます。"
          />
        ) : (
          <>
            <section className="stack-md">
              <SectionHeader
                title="Summary"
                description="支払済額、本来負担額、差額をメンバー単位で比較。"
              />
              <div className="detail-grid">
                {summary.balances.map((balance) => (
                  <StandardCard key={balance.name}>
                    <p className="eyebrow">{balance.name}</p>
                    <div className="stack-xs">
                      <div className="split-row">
                        <span>支払済</span>
                        <strong>{formatCurrency(balance.paid)}</strong>
                      </div>
                      <div className="split-row">
                        <span>本来負担</span>
                        <strong>{formatCurrency(balance.share)}</strong>
                      </div>
                    </div>
                    <p className={`balance-chip ${balance.net >= 0 ? "balance-chip--positive" : "balance-chip--negative"}`}>
                      {balance.net >= 0 ? "受け取り" : "支払い"} {formatCurrency(Math.abs(balance.net))}
                    </p>
                  </StandardCard>
                ))}
              </div>
            </section>

            <section className="stack-md">
              <SectionHeader
                title="Settlement"
                description="誰が誰にいくら払えば終わるかを最短本数で表示。"
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
                title="Expense List"
                description="カテゴリ、立替者、対象者、1人あたり金額までカードで確認。"
              />
              <div className="stack-md">
                {trip.expenses.map((expense) => {
                  const shares = splitAmountEvenly(expense.amount, expense.participants);
                  const firstShare = shares[expense.participants[0]] ?? 0;
                  const hasMixedShare = new Set(Object.values(shares)).size > 1;

                  return (
                    <StandardCard key={`${expense.title}-${expense.amount}`}>
                      <div className="card-header">
                        <div>
                          <div className="inline-cluster">
                            <StatusTag type="category" value={expense.category} />
                          </div>
                          <h3>{expense.title}</h3>
                        </div>
                        <strong className="numeric-highlight">{formatCurrency(expense.amount)}</strong>
                      </div>
                      <dl className="detail-list">
                        <div>
                          <dt>立替</dt>
                          <dd>{expense.paidBy}</dd>
                        </div>
                        <div>
                          <dt>対象</dt>
                          <dd>{expense.participants.join(" / ")}</dd>
                        </div>
                        <div>
                          <dt>1人あたり</dt>
                          <dd>
                            {formatCurrency(firstShare)}
                            {hasMixedShare ? "前後" : ""}
                          </dd>
                        </div>
                        {expense.memo ? (
                          <div>
                            <dt>メモ</dt>
                            <dd>{expense.memo}</dd>
                          </div>
                        ) : null}
                      </dl>
                    </StandardCard>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
};
