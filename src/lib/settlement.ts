export type SettlementPayment = {
  from: string;
  to: string;
  amount: number;
};

export const splitAmountEvenly = (
  amount: number,
  participants: string[],
): Record<string, number> => {
  if (participants.length === 0) {
    return {};
  }

  const baseShare = Math.floor(amount / participants.length);
  let remainder = amount - baseShare * participants.length;

  return participants.reduce<Record<string, number>>((accumulator, participant) => {
    const extra = remainder > 0 ? 1 : 0;
    accumulator[participant] = baseShare + extra;
    remainder -= extra;
    return accumulator;
  }, {});
};

export const buildSettlementPayments = (
  balances: Array<{ name: string; net: number }>,
): SettlementPayment[] => {
  const debtors = balances
    .filter((balance) => balance.net < 0)
    .map((balance) => ({ ...balance, remaining: Math.abs(balance.net) }))
    .sort((left, right) => right.remaining - left.remaining);

  const creditors = balances
    .filter((balance) => balance.net > 0)
    .map((balance) => ({ ...balance, remaining: balance.net }))
    .sort((left, right) => right.remaining - left.remaining);

  const payments: SettlementPayment[] = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];
    const amount = Math.min(debtor.remaining, creditor.remaining);

    if (amount > 0) {
      payments.push({
        from: debtor.name,
        to: creditor.name,
        amount,
      });
    }

    debtor.remaining -= amount;
    creditor.remaining -= amount;

    if (debtor.remaining === 0) {
      debtorIndex += 1;
    }

    if (creditor.remaining === 0) {
      creditorIndex += 1;
    }
  }

  return payments;
};
