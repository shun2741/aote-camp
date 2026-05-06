import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { SharedSyncPanel } from "../components/SharedSyncPanel";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { usePersistentState } from "../hooks/usePersistentState";
import {
  buildCompletedMahjongGames,
  createEmptyDraftGame,
  createInitialMahjongDraftState,
  defaultMahjongRule,
  migrateMahjongDraftState,
  normalizeMahjongDraftGame,
} from "../lib/mahjongDraft";
import { formatCurrency, formatNumber } from "../lib/format";
import { calculateMahjongSummary } from "../lib/mahjong";
import { fetchSharedState, publishSharedState } from "../lib/sharedSync";
import type { MahjongDraftState, SharedMahjongData, SharedSyncStatusTone } from "../types/shared";
import { NotFoundPage } from "./NotFoundPage";

export const MahjongPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const [draft, setDraft, resetDraft] = usePersistentState<MahjongDraftState>(
    `trip-mahjong:${trip.id}`,
    createInitialMahjongDraftState(),
  );
  const [sharedUpdatedAt, setSharedUpdatedAt] = useState<string>();
  const [sharedUpdatedBy, setSharedUpdatedBy] = useState<string>();
  const [syncMessage, setSyncMessage] = useState<string>();
  const [syncTone, setSyncTone] = useState<SharedSyncStatusTone>("neutral");
  const [isRefreshingShared, setIsRefreshingShared] = useState(false);
  const [isPublishingShared, setIsPublishingShared] = useState(false);
  const migratedDraft = migrateMahjongDraftState(draft as unknown, trip);

  useEffect(() => {
    if (JSON.stringify(draft) === JSON.stringify(migratedDraft)) {
      return;
    }

    setDraft(migratedDraft);
  }, [draft, migratedDraft, setDraft]);

  const loadSharedMahjong = async () => {
    setIsRefreshingShared(true);

    try {
      const record = await fetchSharedState<SharedMahjongData>(trip.id, "mahjong");
      const nextDraft = migrateMahjongDraftState(record.data, trip);
      setDraft(nextDraft);
      setSharedUpdatedAt(record.updatedAt);
      setSharedUpdatedBy(record.updatedBy);
      setSyncTone("success");
      setSyncMessage("GitHub 上の麻雀データを読み込みました。");
    } catch (error) {
      setSyncTone("error");
      setSyncMessage(error instanceof Error ? error.message : "共有データの取得に失敗しました。");
    } finally {
      setIsRefreshingShared(false);
    }
  };

  const publishMahjong = async (updatedBy: string, secret: string) => {
    setIsPublishingShared(true);

    try {
      const result = await publishSharedState<SharedMahjongData>({
        tripId: trip.id,
        kind: "mahjong",
        data: migratedDraft,
        updatedBy,
        secret,
      });
      setSharedUpdatedAt(result.updatedAt);
      setSharedUpdatedBy(updatedBy);
      setSyncTone("success");
      setSyncMessage("GitHub へ反映しました。ほかの人は `最新を取得` で読めます。");
    } catch (error) {
      setSyncTone("error");
      setSyncMessage(error instanceof Error ? error.message : "GitHub への反映に失敗しました。");
    } finally {
      setIsPublishingShared(false);
    }
  };

  useEffect(() => {
    void loadSharedMahjong();
  }, [trip.id]);

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
              [member]: game.points[member] ?? `${defaultMahjongRule.startPoint}`,
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

  const completedGames = buildCompletedMahjongGames(migratedDraft);

  const summary =
    completedGames.length > 0
      ? calculateMahjongSummary({
          title: `${trip.title} 麻雀`,
          rule: defaultMahjongRule,
          games: completedGames.map(({ label, results }) => ({ label, results })),
        })
      : null;

  const memberTotals = trip.members
    .map((member) => {
      const standing = summary?.standings.find((entry) => entry.name === member);
      return {
        name: member,
        score: standing?.score ?? 0,
        amount: standing?.amount ?? 0,
      };
    })
    .sort((left, right) => right.score - left.score);

  const perGameScores = migratedDraft.games.map((game, draftIndex) => {
    const summaryIndex = completedGames.findIndex((entry) => entry.gameIndex === draftIndex);
    const rows = summaryIndex >= 0 ? summary?.games[summaryIndex]?.rows ?? [] : [];
    return {
      label: game.label,
      scores: Object.fromEntries(rows.map((row) => [row.name, row.totalScore])),
      amounts: Object.fromEntries(rows.map((row) => [row.name, row.totalAmount])),
    };
  });

  const getScoreToneClass = (score?: number) => {
    if (score === undefined) {
      return "score-tone score-tone--empty";
    }

    if (score > 0) {
      return "score-tone score-tone--positive";
    }

    if (score < 0) {
      return "score-tone score-tone--negative";
    }

    return "score-tone";
  };

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
          icon="mahjong"
          meta={[
            { label: "ルール", value: "1,000点 = 500円" },
            { label: "半荘数", value: `${migratedDraft.games.length}` },
            { label: "有効半荘", value: `${completedGames.length}` },
          ]}
        />

        <section className="stack-md">
          <SharedSyncPanel
            storageKey={`trip-sync-owner:${trip.id}`}
            updatedAt={sharedUpdatedAt}
            updatedBy={sharedUpdatedBy}
            statusMessage={syncMessage}
            statusTone={syncTone}
            isRefreshing={isRefreshingShared}
            isPublishing={isPublishingShared}
            onRefresh={() => void loadSharedMahjong()}
            onPublish={(updatedBy, secret) => void publishMahjong(updatedBy, secret)}
          />
        </section>

        <section className="stack-md">
          <SectionHeader title="半荘入力" />
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
              const normalized = normalizeMahjongDraftGame(game);
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
              <SectionHeader title="個人別プラマイ" />
              <div className="detail-grid">
                {memberTotals.map((member, index) => (
                  <StandardCard key={member.name} className={index === 0 ? "surface-card--winner" : ""}>
                    <p className="eyebrow">#{index + 1}</p>
                    <h3>{member.name}</h3>
                    <p className={`numeric-highlight ${getScoreToneClass(member.score)}`}>
                      {member.score >= 0 ? "+" : ""}
                      {formatNumber(member.score)}
                    </p>
                    <p className={`muted-text ${getScoreToneClass(member.amount)}`}>
                      {member.amount >= 0 ? "+" : ""}
                      {formatCurrency(member.amount)}
                    </p>
                  </StandardCard>
                ))}
              </div>
            </section>

            <section className="stack-md">
              <SectionHeader title="点5の金額" />
              <StandardCard className="stack-sm">
                <div className="split-row">
                  <span>レート</span>
                  <strong>1,000点 = 500円</strong>
                </div>
                <div className="split-row">
                  <span>受け取り総額</span>
                  <strong>{formatCurrency(summary.totalSettlementAmount)}</strong>
                </div>
              </StandardCard>
            </section>

            <section className="stack-md">
              <SectionHeader title="半荘ごとの一覧表" />
              <StandardCard>
                <div className="table-scroll">
                  <table className="result-table">
                    <thead>
                      <tr>
                        <th>名前</th>
                        {perGameScores.map((game) => (
                          <th key={game.label}>{game.label}</th>
                        ))}
                        <th>合計</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberTotals.map((member) => (
                        <tr key={member.name}>
                          <th>{member.name}</th>
                          {perGameScores.map((game) => {
                            const score = game.scores[member.name];
                            const amount = game.amounts[member.name];
                            return (
                              <td className={getScoreToneClass(score)} key={`${member.name}-${game.label}`}>
                                {score === undefined ? (
                                  "-"
                                ) : (
                                  <div className="table-stack">
                                    <span>{`${score >= 0 ? "+" : ""}${formatNumber(score)}`}</span>
                                    <span className="muted-text">
                                      {`${amount >= 0 ? "+" : ""}${formatCurrency(amount)}`}
                                    </span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                          <td className={`result-table__total ${getScoreToneClass(member.score)}`}>
                            <div className="table-stack">
                              <span>
                                {member.score >= 0 ? "+" : ""}
                                {formatNumber(member.score)}
                              </span>
                              <span className="muted-text">
                                {member.amount >= 0 ? "+" : ""}
                                {formatCurrency(member.amount)}
                              </span>
                            </div>
                          </td>
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
