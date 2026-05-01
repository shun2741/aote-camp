import { useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { StatusTag } from "../components/StatusTag";
import { getTripById } from "../data/trips";
import { usePersistentState } from "../hooks/usePersistentState";
import { calculateExpenseSummary } from "../lib/expenses";
import { formatCurrency } from "../lib/format";
import { splitAmountEvenly } from "../lib/settlement";
import type { Expense, ExpenseCategory } from "../types/trip";
import { NotFoundPage } from "./NotFoundPage";

type ExpenseFormState = {
  title: string;
  amount: string;
  paidBy: string;
  participants: string[];
  category: ExpenseCategory;
  memo: string;
};

const makeInitialFormState = (members: string[]): ExpenseFormState => ({
  title: "",
  amount: "",
  paidBy: members[0] ?? "",
  participants: members,
  category: "other",
  memo: "",
});

const toExpensePayload = (form: ExpenseFormState): Expense | null => {
  const amount = Number(form.amount);

  if (!form.title.trim() || !Number.isFinite(amount) || amount <= 0 || form.participants.length === 0) {
    return null;
  }

  return {
    title: form.title.trim(),
    amount: Math.round(amount),
    paidBy: form.paidBy,
    participants: form.participants,
    category: form.category,
    memo: form.memo.trim() || undefined,
  };
};

export const ExpensesPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const [draftExpenses, setDraftExpenses, resetDraftExpenses] = usePersistentState(
    `trip-expenses:${trip.id}`,
    trip.expenses,
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formState, setFormState] = useState<ExpenseFormState>(() => makeInitialFormState(trip.members));
  const summary = calculateExpenseSummary(trip.members, draftExpenses);

  const resetForm = () => {
    setEditingIndex(null);
    setFormState(makeInitialFormState(trip.members));
  };

  const handleParticipantToggle = (member: string) => {
    setFormState((current) => {
      const exists = current.participants.includes(member);
      const nextParticipants = exists
        ? current.participants.filter((participant) => participant !== member)
        : [...current.participants, member];

      return {
        ...current,
        participants: nextParticipants,
      };
    });
  };

  const handleSubmit = () => {
    const nextExpense = toExpensePayload(formState);

    if (!nextExpense) {
      return;
    }

    setDraftExpenses((current) => {
      if (editingIndex === null) {
        return [...current, nextExpense];
      }

      return current.map((expense, index) => (index === editingIndex ? nextExpense : expense));
    });
    resetForm();
  };

  const handleEdit = (expense: Expense, index: number) => {
    setEditingIndex(index);
    setFormState({
      title: expense.title,
      amount: `${expense.amount}`,
      paidBy: expense.paidBy,
      participants: expense.participants,
      category: expense.category ?? "other",
      memo: expense.memo ?? "",
    });
  };

  const handleDelete = (index: number) => {
    setDraftExpenses((current) => current.filter((_, currentIndex) => currentIndex !== index));

    if (editingIndex === index) {
      resetForm();
    }
  };

  return (
    <AppShell
      title="経費"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="概要"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="経費と割り勘"
          icon="expenses"
          meta={[
            { label: "総額", value: formatCurrency(summary.totalAmount) },
            { label: "件数", value: `${draftExpenses.length}` },
            { label: "精算数", value: `${summary.payments.length}` },
          ]}
        />

        <section className="stack-md">
          <SectionHeader title="経費を入力" />
          <StandardCard className="stack-md">
            <div className="form-grid">
              <label className="field">
                <span>項目名</span>
                <input
                  value={formState.title}
                  onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                  placeholder="例: 宿代"
                />
              </label>
              <label className="field">
                <span>金額</span>
                <input
                  inputMode="numeric"
                  value={formState.amount}
                  onChange={(event) => setFormState((current) => ({ ...current, amount: event.target.value }))}
                  placeholder="例: 124260"
                />
              </label>
              <label className="field">
                <span>立替者</span>
                <select
                  value={formState.paidBy}
                  onChange={(event) => setFormState((current) => ({ ...current, paidBy: event.target.value }))}
                >
                  {trip.members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>カテゴリ</span>
                <select
                  value={formState.category}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      category: event.target.value as ExpenseCategory,
                    }))
                  }
                >
                  <option value="hotel">宿</option>
                  <option value="transport">交通</option>
                  <option value="food">食費</option>
                  <option value="activity">アクティビティ</option>
                  <option value="other">その他</option>
                </select>
              </label>
            </div>

            <div className="stack-xs">
              <span className="field-label">対象メンバー</span>
              <div className="chip-selector">
                {trip.members.map((member) => {
                  const isSelected = formState.participants.includes(member);
                  return (
                    <button
                      className={`select-chip ${isSelected ? "select-chip--selected" : ""}`}
                      key={member}
                      type="button"
                      onClick={() => handleParticipantToggle(member)}
                    >
                      {member}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="field">
              <span>メモ</span>
              <textarea
                rows={3}
                value={formState.memo}
                onChange={(event) => setFormState((current) => ({ ...current, memo: event.target.value }))}
                placeholder="例: 7人分 / クーポン適用後"
              />
            </label>

            <div className="inline-cluster">
              <button className="button button--primary" type="button" onClick={handleSubmit}>
                {editingIndex === null ? "経費を追加" : "内容を更新"}
              </button>
              <button className="button button--secondary" type="button" onClick={resetForm}>
                入力をクリア
              </button>
              <button className="button button--ghost" type="button" onClick={resetDraftExpenses}>
                保存内容をリセット
              </button>
            </div>
          </StandardCard>
        </section>

        <section className="stack-md">
          <SectionHeader title="メンバー別まとめ" />
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
                <p
                  className={`balance-chip ${balance.net >= 0 ? "balance-chip--positive" : "balance-chip--negative"}`}
                >
                  {balance.net >= 0 ? "受け取り" : "支払い"} {formatCurrency(Math.abs(balance.net))}
                </p>
              </StandardCard>
            ))}
          </div>
        </section>

        <section className="stack-md">
          <SectionHeader title="精算結果" />
          <StandardCard className="stack-sm">
            {summary.payments.length === 0 ? (
              <EmptyState
                title="まだ精算は出ていません"
                description="経費を追加すると、ここに支払い指示が並びます。"
              />
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
          <SectionHeader title="経費一覧" />
          {draftExpenses.length === 0 ? (
            <EmptyState
              title="経費はまだありません"
              description="上のフォームから追加すると、ここに一覧が出ます。"
            />
          ) : (
            <div className="stack-md">
              {draftExpenses.map((expense, index) => {
                const shares = splitAmountEvenly(expense.amount, expense.participants);
                const firstShare = shares[expense.participants[0]] ?? 0;
                const hasMixedShare = new Set(Object.values(shares)).size > 1;

                return (
                  <StandardCard key={`${expense.title}-${expense.amount}-${index}`}>
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
                    <div className="inline-cluster">
                      <button className="button button--secondary" type="button" onClick={() => handleEdit(expense, index)}>
                        編集
                      </button>
                      <button className="button button--ghost" type="button" onClick={() => handleDelete(index)}>
                        削除
                      </button>
                    </div>
                  </StandardCard>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
};
