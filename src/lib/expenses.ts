import type { Expense } from "../types/trip";
import { buildSettlementPayments, splitAmountEvenly } from "./settlement";

export type ExpenseMemberBalance = {
  name: string;
  paid: number;
  share: number;
  net: number;
};

export type ExpenseSummary = {
  totalAmount: number;
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
): ExpenseSummary => {
  const paidTotals = new Map(members.map((member) => [member, 0]));
  const shareTotals = new Map(members.map((member) => [member, 0]));

  expenses.forEach((expense) => {
    paidTotals.set(expense.paidBy, (paidTotals.get(expense.paidBy) ?? 0) + expense.amount);

    const shares = splitAmountEvenly(expense.amount, expense.participants);
    Object.entries(shares).forEach(([participant, share]) => {
      shareTotals.set(participant, (shareTotals.get(participant) ?? 0) + share);
    });
  });

  const balances = members.map((member) => {
    const paid = paidTotals.get(member) ?? 0;
    const share = shareTotals.get(member) ?? 0;

    return {
      name: member,
      paid,
      share,
      net: paid - share,
    };
  });

  return {
    totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    balances,
    payments: buildSettlementPayments(balances),
  };
};
