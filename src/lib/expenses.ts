import type { Expense } from "../types/trip";
import type { MahjongStanding } from "./mahjong";
import { buildSettlementPayments, splitAmountEvenly } from "./settlement";

export type ExpenseBreakdownItem = {
  label: string;
  amount: number;
  group: "paid" | "share" | "mahjong";
};

export type ExpenseMemberBalance = {
  name: string;
  paid: number;
  share: number;
  mahjong: number;
  net: number;
  breakdown: ExpenseBreakdownItem[];
};

export type ExpenseSummary = {
  totalAmount: number;
  expenseTotalAmount: number;
  mahjongTotalAmount: number;
  balances: ExpenseMemberBalance[];
  payments: Array<{
    from: string;
    to: string;
    amount: number;
  }>;
};

export const calculateExpenseSummary = (
  members: string[],
  expenses: Expense[],
  mahjongStandings: MahjongStanding[] = [],
): ExpenseSummary => {
  const paidTotals = new Map(members.map((member) => [member, 0]));
  const shareTotals = new Map(members.map((member) => [member, 0]));
  const mahjongTotals = new Map(members.map((member) => [member, 0]));
  const breakdownMap = new Map<string, ExpenseBreakdownItem[]>(
    members.map((member) => [member, []]),
  );

  expenses.forEach((expense) => {
    paidTotals.set(expense.paidBy, (paidTotals.get(expense.paidBy) ?? 0) + expense.amount);
    breakdownMap.get(expense.paidBy)?.push({
      label: `${expense.title} を立替`,
      amount: expense.amount,
      group: "paid",
    });

    const shares = splitAmountEvenly(expense.amount, expense.participants);
    Object.entries(shares).forEach(([participant, share]) => {
      shareTotals.set(participant, (shareTotals.get(participant) ?? 0) + share);
      breakdownMap.get(participant)?.push({
        label: `${expense.title} の負担`,
        amount: -share,
        group: "share",
      });
    });
  });

  mahjongStandings.forEach((standing) => {
    mahjongTotals.set(standing.name, (mahjongTotals.get(standing.name) ?? 0) + standing.amount);
    breakdownMap.get(standing.name)?.push({
      label: "麻雀精算",
      amount: standing.amount,
      group: "mahjong",
    });
  });

  const balances = members.map((member) => {
    const paid = paidTotals.get(member) ?? 0;
    const share = shareTotals.get(member) ?? 0;
    const mahjong = mahjongTotals.get(member) ?? 0;

    return {
      name: member,
      paid,
      share,
      mahjong,
      net: paid - share + mahjong,
      breakdown: breakdownMap.get(member) ?? [],
    };
  });

  const expenseTotalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const mahjongTotalAmount = mahjongStandings
    .filter((standing) => standing.amount > 0)
    .reduce((sum, standing) => sum + standing.amount, 0);

  return {
    totalAmount: expenseTotalAmount + mahjongTotalAmount,
    expenseTotalAmount,
    mahjongTotalAmount,
    balances,
    payments: buildSettlementPayments(balances),
  };
};
