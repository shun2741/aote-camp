import type { Expense } from "./trip";

export type SharedSyncKind = "expenses" | "mahjong";

export type SharedSyncRecord<T> = {
  version: 1;
  updatedAt: string;
  updatedBy: string;
  data: T;
};

export type SharedSyncStatusTone = "neutral" | "success" | "error";

export type MahjongDraftGame = {
  label: string;
  players: string[];
  points: Record<string, string>;
};

export type MahjongDraftState = {
  games: MahjongDraftGame[];
};

export type SharedExpensesData = Expense[];
export type SharedMahjongData = MahjongDraftState;
