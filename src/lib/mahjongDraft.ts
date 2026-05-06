import type { MahjongDraftGame, MahjongDraftState } from "../types/shared";
import type { MahjongPlayerResult, Trip } from "../types/trip";

export const defaultMahjongRule = {
  rate: 0.5,
  uma: [20, 10, -10, -20] as [number, number, number, number],
  oka: 20,
  startPoint: 25000,
  returnPoint: 30000,
};

export const createEmptyDraftGame = (gameNumber: number, players: string[] = []): MahjongDraftGame => ({
  label: `${gameNumber}半荘目`,
  players,
  points: Object.fromEntries(players.map((player) => [player, `${defaultMahjongRule.startPoint}`])),
});

export const createInitialMahjongDraftState = (): MahjongDraftState => ({
  games: [createEmptyDraftGame(1)],
});

export const normalizeMahjongDraftGame = (game: MahjongDraftGame): MahjongDraftGame => ({
  ...game,
  points: Object.fromEntries(
    game.players.map((player) => [player, game.points[player] ?? `${defaultMahjongRule.startPoint}`]),
  ),
});

const sanitizePlayers = (players: unknown, validMembers: string[]) =>
  Array.isArray(players)
    ? players.filter((player): player is string => typeof player === "string" && validMembers.includes(player)).slice(0, 4)
    : [];

const sanitizeLegacyResults = (results: unknown, validMembers: string[]) =>
  Array.isArray(results)
    ? results.filter(
        (result): result is MahjongPlayerResult =>
          typeof result === "object" &&
          result !== null &&
          typeof (result as MahjongPlayerResult).name === "string" &&
          typeof (result as MahjongPlayerResult).point === "number" &&
          validMembers.includes((result as MahjongPlayerResult).name),
      )
    : [];

export const migrateMahjongDraftState = (value: unknown, trip: Trip): MahjongDraftState => {
  const fallback = createInitialMahjongDraftState();

  if (!value || typeof value !== "object" || !("games" in value) || !Array.isArray((value as { games?: unknown[] }).games)) {
    return fallback;
  }

  const rawGames = (value as { games: unknown[] }).games;
  const migratedGames = rawGames
    .map((rawGame, index) => {
      if (!rawGame || typeof rawGame !== "object") {
        return null;
      }

      const record = rawGame as {
        label?: unknown;
        players?: unknown;
        points?: unknown;
        results?: unknown;
      };

      const label = typeof record.label === "string" && record.label.trim() ? record.label : `${index + 1}半荘目`;
      const legacyResults = sanitizeLegacyResults(record.results, trip.members);
      const players =
        sanitizePlayers(record.players, trip.members).length > 0
          ? sanitizePlayers(record.players, trip.members)
          : legacyResults.map((result) => result.name).slice(0, 4);

      const points =
        legacyResults.length > 0
          ? Object.fromEntries(legacyResults.map((result) => [result.name, `${result.point}`]))
          : typeof record.points === "object" && record.points !== null
            ? Object.fromEntries(
                players.map((player) => {
                  const rawPoint = (record.points as Record<string, unknown>)[player];
                  return [player, typeof rawPoint === "string" ? rawPoint : `${defaultMahjongRule.startPoint}`];
                }),
              )
            : Object.fromEntries(players.map((player) => [player, `${defaultMahjongRule.startPoint}`]));

      return normalizeMahjongDraftGame({
        label,
        players,
        points,
      });
    })
    .filter((game): game is MahjongDraftGame => game !== null);

  return migratedGames.length > 0 ? { games: migratedGames } : fallback;
};

export const buildCompletedMahjongGames = (draft: MahjongDraftState) =>
  draft.games
    .map((game, gameIndex) => ({ game: normalizeMahjongDraftGame(game), gameIndex }))
    .filter(({ game }) => game.players.length === 4)
    .map(({ game, gameIndex }) => ({
      label: game.label,
      gameIndex,
      results: game.players.map((player) => ({
        name: player,
        point: Number(game.points[player]) || 0,
      })),
    }));
