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
};

export type MahjongGameSummary = {
  label: string;
  rows: MahjongGameRow[];
};

export type MahjongStanding = {
  name: string;
  score: number;
};

export type MahjongSummary = {
  title: string;
  gameCount: number;
  standings: MahjongStanding[];
  games: MahjongGameSummary[];
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

      return {
        name: result.name,
        point: result.point,
        rank,
        rawScore,
        umaScore,
        okaScore,
        totalScore,
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
      };

      current.score += row.totalScore;
      totals.set(row.name, current);
    });
  });

  const standings = [...totals.values()].sort((left, right) => right.score - left.score);

  return {
    title: data.title,
    gameCount: games.length,
    standings,
    games,
  };
};
