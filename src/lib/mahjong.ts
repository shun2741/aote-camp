import type {
  MahjongData,
  MahjongGame,
  MahjongPlayerResult,
} from "../types/trip";

export type MahjongGameRow = {
  name: string;
  point: number;
  rank: number;
  rawScore: number;
  umaScore: number;
  okaScore: number;
  totalScore: number;
  totalAmount: number;
};

export type MahjongGameSummary = {
  label: string;
  rows: MahjongGameRow[];
};

export type MahjongStanding = {
  name: string;
  score: number;
  amount: number;
};

export type MahjongSummary = {
  title: string;
  gameCount: number;
  rate: number;
  standings: MahjongStanding[];
  games: MahjongGameSummary[];
  totalSettlementAmount: number;
};

const resolveRanks = (results: MahjongPlayerResult[]): MahjongPlayerResult[] => {
  if (results.every((result) => result.rank)) {
    return results;
  }

  const sorted = [...results].sort((left, right) => {
    if (right.point !== left.point) {
      return right.point - left.point;
    }

    return left.name.localeCompare(right.name, "ja");
  });

  return results.map((result) => {
    const rank = sorted.findIndex((entry) => entry.name === result.name) + 1;
    return {
      ...result,
      rank,
    };
  });
};

const summarizeGame = (game: MahjongGame, data: MahjongData): MahjongGameSummary => {
  const rankedResults = resolveRanks(game.results);
  const rows = rankedResults
    .map((result) => {
      const rank = result.rank ?? 4;
      const rawScore = (result.point - data.rule.returnPoint) / 1000;
      const umaScore = data.rule.uma[rank - 1];
      const okaScore = rank === 1 ? data.rule.oka : 0;
      const totalScore = rawScore + umaScore + okaScore;
      const totalAmount = Math.round(totalScore * data.rule.rate * 1000);

      return {
        name: result.name,
        point: result.point,
        rank,
        rawScore,
        umaScore,
        okaScore,
        totalScore,
        totalAmount,
      };
    })
    .sort((left, right) => left.rank - right.rank);

  return {
    label: game.label,
    rows,
  };
};

export const calculateMahjongSummary = (data: MahjongData): MahjongSummary => {
  const games = data.games.map((game) => summarizeGame(game, data));
  const totals = new Map<string, MahjongStanding>();

  games.forEach((game) => {
    game.rows.forEach((row) => {
      const current = totals.get(row.name) ?? {
        name: row.name,
        score: 0,
        amount: 0,
      };

      current.score += row.totalScore;
      current.amount += row.totalAmount;
      totals.set(row.name, current);
    });
  });

  const standings = [...totals.values()].sort((left, right) => right.score - left.score);
  const totalSettlementAmount = standings
    .filter((standing) => standing.amount > 0)
    .reduce((sum, standing) => sum + standing.amount, 0);

  return {
    title: data.title,
    gameCount: games.length,
    rate: data.rule.rate,
    standings,
    games,
    totalSettlementAmount,
  };
};
