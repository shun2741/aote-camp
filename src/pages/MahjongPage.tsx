import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { usePersistentState } from "../hooks/usePersistentState";
import { formatNumber, formatPelica } from "../lib/format";
import { calculateMahjongSummary } from "../lib/mahjong";
import type { MahjongGame, MahjongPlayerResult, Trip } from "../types/trip";
import { NotFoundPage } from "./NotFoundPage";

type MahjongDraftGame = {
  label: string;
  players: string[];
  points: Record<string, string>;
};

type MahjongDraftState = {
  games: MahjongDraftGame[];
};

const defaultRule = {
  rate: 0.5,
  uma: [20, 10, -10, -20] as [number, number, number, number],
  oka: 20,
  startPoint: 25000,
  returnPoint: 30000,
};

const createEmptyDraftGame = (gameNumber: number, players: string[] = []) => ({
  label: `${gameNumber}半荘目`,
  players,
  points: Object.fromEntries(players.map((player) => [player, `${defaultRule.startPoint}`])),
});

const createInitialDraftState = (trip: Trip): MahjongDraftState => ({
  games:
    trip.mahjong?.games.map((game) => ({
      label: game.label,
      players: game.results.map((result) => result.name),
      points: Object.fromEntries(game.results.map((result) => [result.name, `${result.point}`])),
    })) ?? [createEmptyDraftGame(1, trip.members.slice(0, 4))],
});

const normalizeDraftGame = (game: MahjongDraftGame) => ({
  ...game,
  points: Object.fromEntries(game.players.map((player) => [player, game.points[player] ?? `${defaultRule.startPoint}`])),
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

const migrateMahjongDraftState = (value: unknown, trip: Trip): MahjongDraftState => {
  const fallback = createInitialDraftState(trip);

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
                  return [player, typeof rawPoint === "string" ? rawPoint : `${defaultRule.startPoint}`];
                }),
              )
            : Object.fromEntries(players.map((player) => [player, `${defaultRule.startPoint}`]));

      return normalizeDraftGame({
        label,
        players,
        points,
      });
    })
    .filter((game): game is MahjongDraftGame => game !== null);

  return migratedGames.length > 0 ? { games: migratedGames } : fallback;
};

export const MahjongPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const [draft, setDraft, resetDraft] = usePersistentState<MahjongDraftState>(
    `trip-mahjong:${trip.id}`,
    createInitialDraftState(trip),
  );
  const migratedDraft = migrateMahjongDraftState(draft as unknown, trip);

  useEffect(() => {
    if (JSON.stringify(draft) === JSON.stringify(migratedDraft)) {
      return;
    }

    setDraft(migratedDraft);
  }, [draft, migratedDraft, setDraft]);

  const addGame = () => {
    setDraft((current) => {
      const safeCurrent = migrateMahjongDraftState(current as unknown, trip);
      const lastPlayers = safeCurrent.games[safeCurrent.games.length - 1]?.players ?? [];
      return {
        games: [...safeCurrent.games, createEmptyDraftGame(safeCurrent.games.length + 1, lastPlayers)],
      };
    });
  };

  const removeGame = (index: number) => {
    setDraft((current) => {
      const safeCurrent = migrateMahjongDraftState(current as unknown, trip);
      return {
        games: safeCurrent.games.filter((_, gameIndex) => gameIndex !== index),
      };
    });
  };

  const updateGameLabel = (index: number, label: string) => {
    setDraft((current) => {
      const safeCurrent = migrateMahjongDraftState(current as unknown, trip);
      return {
        games: safeCurrent.games.map((game, gameIndex) => (gameIndex === index ? { ...game, label } : game)),
      };
    });
  };

  const togglePlayer = (gameIndex: number, member: string) => {
    setDraft((current) => {
      const safeCurrent = migrateMahjongDraftState(current as unknown, trip);
      return {
        games: safeCurrent.games.map((game, currentIndex) => {
        if (currentIndex !== gameIndex) {
          return game;
        }

        const exists = game.players.includes(member);

        if (exists) {
          return {
            ...game,
            players: game.players.filter((player) => player !== member),
          };
        }

        if (game.players.length >= 4) {
          return game;
        }

        return {
          ...game,
          players: [...game.players, member],
          points: {
            ...game.points,
            [member]: game.points[member] ?? `${defaultRule.startPoint}`,
          },
        };
      }),
    };
    });
  };

  const updatePoint = (gameIndex: number, playerName: string, rawValue: string) => {
    setDraft((current) => {
      const safeCurrent = migrateMahjongDraftState(current as unknown, trip);
      return {
        games: safeCurrent.games.map((game, currentIndex) =>
        currentIndex === gameIndex
          ? {
              ...game,
              points: {
                ...game.points,
                [playerName]: rawValue,
              },
            }
          : game,
      ),
    };
    });
  };

  const completedGames = migratedDraft.games
    .map((game, gameIndex) => ({ game: normalizeDraftGame(game), gameIndex }))
    .filter(({ game }) => game.players.length === 4)
    .map(({ game, gameIndex }) => ({
      label: game.label,
      gameIndex,
      results: game.players.map((player) => ({
        name: player,
        point: Number(game.points[player]) || 0,
      })),
    }));

  const summary =
    completedGames.length > 0
      ? calculateMahjongSummary({
          title: `${trip.title} 麻雀`,
          rule: defaultRule,
          games: completedGames.map(({ label, results }) => ({ label, results })),
        })
      : null;

  const memberTotals = trip.members
    .map((member) => {
      const standing = summary?.standings.find((entry) => entry.name === member);
      return {
        name: member,
        amount: standing?.amount ?? 0,
        score: standing?.score ?? 0,
      };
    })
    .sort((left, right) => right.amount - left.amount);

  const perGameAmounts = migratedDraft.games.map((game, draftIndex) => {
    const summaryIndex = completedGames.findIndex((entry) => entry.gameIndex === draftIndex);
    const rows = summaryIndex >= 0 ? summary?.games[summaryIndex]?.rows ?? [] : [];
    return {
      label: game.label,
      amounts: Object.fromEntries(rows.map((row) => [row.name, row.amount])),
    };
  });

  return (
    <AppShell
      title="麻雀"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="概要"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow={trip.destination}
          title="麻雀精算"
          description="半荘ごとに卓メンバーを切り替えて入力できます。集計はペリカ表示で、全員分を1つの表にまとめています。"
          meta={[
            { label: "ルール", value: "1・2の点5" },
            { label: "半荘数", value: `${migratedDraft.games.length}` },
            { label: "有効半荘", value: `${completedGames.length}` },
          ]}
        />

        <section className="stack-md">
          <SectionHeader
            title="半荘入力"
            description="半荘ごとに4人を選び、各人の持ち点を入力してください。参加していない人はその半荘では自動的に表で `-` になります。"
          />
          <div className="stack-md">
            <div className="inline-cluster">
              <button className="button button--primary" type="button" onClick={addGame}>
                半荘を追加
              </button>
              <button className="button button--ghost" type="button" onClick={resetDraft}>
                入力をリセット
              </button>
            </div>

            {migratedDraft.games.map((game, gameIndex) => {
              const normalized = normalizeDraftGame(game);
              const totalPoint = normalized.players.reduce(
                (sum, player) => sum + (Number(normalized.points[player]) || 0),
                0,
              );
              const pointDiff = totalPoint - 100000;

              return (
                <StandardCard key={`${game.label}-${gameIndex}`}>
                  <div className="card-header">
                    <label className="field field--inline">
                      <span>半荘名</span>
                      <input value={game.label} onChange={(event) => updateGameLabel(gameIndex, event.target.value)} />
                    </label>
                    <div className="stack-xs">
                      <strong className={`point-total ${pointDiff === 0 ? "point-total--ok" : "point-total--warn"}`}>
                        {normalized.players.length === 4
                          ? `合計 ${totalPoint.toLocaleString("ja-JP")}点`
                          : `メンバー ${normalized.players.length}/4人`}
                      </strong>
                      <button className="button button--ghost" type="button" onClick={() => removeGame(gameIndex)}>
                        この半荘を削除
                      </button>
                    </div>
                  </div>

                  <div className="stack-xs">
                    <span className="field-label">参加メンバー</span>
                    <div className="chip-selector">
                      {trip.members.map((member) => {
                        const isSelected = normalized.players.includes(member);
                        const isDisabled = !isSelected && normalized.players.length >= 4;

                        return (
                          <button
                            className={`select-chip ${isSelected ? "select-chip--selected" : ""}`}
                            disabled={isDisabled}
                            key={`${game.label}-${member}`}
                            type="button"
                            onClick={() => togglePlayer(gameIndex, member)}
                          >
                            {member}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {normalized.players.length !== 4 ? (
                    <EmptyState
                      title="4人選ぶと点数入力が出ます"
                      description="この半荘に参加した4人を選んでください。"
                    />
                  ) : (
                    <div className="point-grid">
                      {normalized.players.map((player) => (
                        <label className="field" key={`${game.label}-${player}`}>
                          <span>{player}</span>
                          <input
                            inputMode="numeric"
                            value={normalized.points[player]}
                            onChange={(event) => updatePoint(gameIndex, player, event.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                </StandardCard>
              );
            })}
          </div>
        </section>

        {!summary ? (
          <EmptyState
            title="まだ集計できる半荘がありません"
            description="4人選択済みの半荘が1つ以上あると、ここから結果表が出ます。"
          />
        ) : (
          <>
            <section className="stack-md">
              <SectionHeader
                title="個人別プラマイ"
                description="誰から誰へではなく、各自の最終プラマイだけをペリカ表示でまとめています。"
              />
              <div className="detail-grid">
                {memberTotals.map((member, index) => (
                  <StandardCard key={member.name} className={index === 0 ? "surface-card--winner" : ""}>
                    <p className="eyebrow">#{index + 1}</p>
                    <h3>{member.name}</h3>
                    <p className="numeric-highlight">{formatPelica(member.amount)}</p>
                    <p className="muted-text">
                      合計スコア {member.score >= 0 ? "+" : ""}
                      {formatNumber(member.score)}
                    </p>
                  </StandardCard>
                ))}
              </div>
            </section>

            <section className="stack-md">
              <SectionHeader
                title="半荘ごとの一覧表"
                description="縦が全メンバー、横が各半荘です。参加していない人は `-` で表示します。"
              />
              <StandardCard>
                <div className="table-scroll">
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>名前</th>
                        {perGameAmounts.map((game) => (
                          <th key={game.label}>{game.label}</th>
                        ))}
                        <th>合計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberTotals.map((member) => (
                        <tr key={member.name}>
                          <th>{member.name}</th>
                          {perGameAmounts.map((game) => {
                            const amount = game.amounts[member.name];
                            return <td key={`${member.name}-${game.label}`}>{amount === undefined ? "-" : formatPelica(amount)}</td>;
                          })}
                          <td className="result-table__total">{formatPelica(member.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </StandardCard>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
};
