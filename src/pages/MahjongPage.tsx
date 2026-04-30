import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { usePersistentState } from "../hooks/usePersistentState";
import { formatCurrency, formatNumber } from "../lib/format";
import { calculateMahjongSummary } from "../lib/mahjong";
import type { MahjongGame, MahjongPlayerResult } from "../types/trip";
import { getTripById } from "../data/trips";
import { NotFoundPage } from "./NotFoundPage";

type MahjongDraftState = {
  players: string[];
  games: MahjongGame[];
};

const defaultRule = {
  rate: 0.5,
  uma: [20, 10, -10, -20] as [number, number, number, number],
  oka: 20,
  startPoint: 25000,
  returnPoint: 30000,
};

const createEmptyGame = (players: string[], gameNumber: number): MahjongGame => ({
  label: `${gameNumber}半荘目`,
  results: players.map((name) => ({
    name,
    point: defaultRule.startPoint,
  })),
});

const normalizeResults = (players: string[], results: MahjongPlayerResult[]) =>
  players.map((player) => ({
    name: player,
    point: results.find((result) => result.name === player)?.point ?? defaultRule.startPoint,
  }));

export const MahjongPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  const [draft, setDraft, resetDraft] = usePersistentState<MahjongDraftState>(
    `trip-mahjong:${trip.id}`,
    {
      players: trip.mahjong?.games[0]?.results.map((result) => result.name) ?? trip.members.slice(0, 4),
      games: trip.mahjong?.games ?? [],
    },
  );

  useEffect(() => {
    if (draft.players.length !== 4) {
      return;
    }

    setDraft((current) => ({
      ...current,
      games:
        current.games.length === 0
          ? [createEmptyGame(current.players, 1)]
          : current.games.map((game) => ({
              ...game,
              results: normalizeResults(current.players, game.results),
            })),
    }));
  }, [draft.players.length, setDraft]);

  const syncPlayersToGames = (players: string[]) => {
    setDraft((current) => ({
      players,
      games:
        players.length === 4
          ? current.games.length === 0
            ? [createEmptyGame(players, 1)]
            : current.games.map((game) => ({
                ...game,
                results: normalizeResults(players, game.results),
              }))
          : current.games,
    }));
  };

  const addGame = () => {
    if (draft.players.length !== 4) {
      return;
    }

    setDraft((current) => ({
      ...current,
      games: [...current.games, createEmptyGame(current.players, current.games.length + 1)],
    }));
  };

  const removeGame = (index: number) => {
    setDraft((current) => ({
      ...current,
      games: current.games.filter((_, gameIndex) => gameIndex !== index),
    }));
  };

  const updateGameLabel = (index: number, label: string) => {
    setDraft((current) => ({
      ...current,
      games: current.games.map((game, gameIndex) => (gameIndex === index ? { ...game, label } : game)),
    }));
  };

  const updatePoint = (gameIndex: number, playerName: string, rawValue: string) => {
    const point = Number(rawValue);

    setDraft((current) => ({
      ...current,
      games: current.games.map((game, currentGameIndex) => {
        if (currentGameIndex !== gameIndex) {
          return game;
        }

        return {
          ...game,
          results: game.results.map((result) =>
            result.name === playerName
              ? {
                  ...result,
                  point: Number.isFinite(point) ? Math.max(0, Math.round(point)) : 0,
                }
              : result,
          ),
        };
      }),
    }));
  };

  const summary =
    draft.players.length === 4 && draft.games.length > 0
      ? calculateMahjongSummary({
          title: `${trip.title} 麻雀`,
          rule: defaultRule,
          games: draft.games.map((game) => ({
            ...game,
            results: normalizeResults(draft.players, game.results),
          })),
        })
      : null;

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
          description="卓メンバーを選び、半荘ごとの点数を入れると、その場で収支と支払い一覧まで出ます。入力内容はこの端末に保存されます。"
          meta={[
            { label: "ルール", value: "1・2の点5" },
            { label: "半荘数", value: `${draft.games.length}` },
            { label: "選択人数", value: `${draft.players.length}/4人` },
          ]}
        />

        <section className="stack-md">
          <SectionHeader
            title="卓メンバー"
            description="4人卓前提です。まず今回打つ4人を選んでください。"
          />
          <StandardCard className="stack-md">
            <div className="chip-selector">
              {trip.members.map((member) => {
                const isSelected = draft.players.includes(member);
                const isDisabled = !isSelected && draft.players.length >= 4;

                return (
                  <button
                    className={`select-chip ${isSelected ? "select-chip--selected" : ""}`}
                    disabled={isDisabled}
                    key={member}
                    type="button"
                    onClick={() => syncPlayersToGames(
                      isSelected
                        ? draft.players.filter((player) => player !== member)
                        : [...draft.players, member],
                    )}
                  >
                    {member}
                  </button>
                );
              })}
            </div>
            <p className="muted-text">4人そろうと自動で1半荘目の入力欄を作ります。</p>
          </StandardCard>
        </section>

        <section className="stack-md">
          <SectionHeader
            title="半荘入力"
            description="各プレイヤーの持ち点を入力してください。合計10万点から大きくズレていないかも確認できます。"
          />
          {draft.players.length !== 4 ? (
            <EmptyState
              title="先に4人選んでください"
              description="卓メンバーが4人になると、ここに点数入力欄が出ます。"
            />
          ) : (
            <div className="stack-md">
              <div className="inline-cluster">
                <button className="button button--primary" type="button" onClick={addGame}>
                  半荘を追加
                </button>
                <button className="button button--ghost" type="button" onClick={resetDraft}>
                  入力をリセット
                </button>
              </div>

              {draft.games.map((game, gameIndex) => {
                const totalPoint = game.results.reduce((sum, result) => sum + result.point, 0);
                const pointDiff = totalPoint - 100000;

                return (
                  <StandardCard key={`${game.label}-${gameIndex}`}>
                    <div className="card-header">
                      <label className="field field--inline">
                        <span>半荘名</span>
                        <input
                          value={game.label}
                          onChange={(event) => updateGameLabel(gameIndex, event.target.value)}
                        />
                      </label>
                      <div className="stack-xs">
                        <strong className={`point-total ${pointDiff === 0 ? "point-total--ok" : "point-total--warn"}`}>
                          合計 {totalPoint.toLocaleString("ja-JP")}点
                        </strong>
                        <button className="button button--ghost" type="button" onClick={() => removeGame(gameIndex)}>
                          この半荘を削除
                        </button>
                      </div>
                    </div>

                    <div className="point-grid">
                      {game.results.map((result) => (
                        <label className="field" key={`${game.label}-${result.name}`}>
                          <span>{result.name}</span>
                          <input
                            inputMode="numeric"
                            value={`${result.point}`}
                            onChange={(event) => updatePoint(gameIndex, result.name, event.target.value)}
                          />
                        </label>
                      ))}
                    </div>
                  </StandardCard>
                );
              })}
            </div>
          )}
        </section>

        {!summary ? (
          <EmptyState
            title="まだ集計はありません"
            description="4人を選んで点数を入力すると、ここから自動で結果が出ます。"
          />
        ) : (
          <>
            <section className="stack-md">
              <SectionHeader
                title="最終結果"
                description="半荘ごとのスコアを合算した最終順位です。"
              />
              <div className="detail-grid">
                {summary.standings.map((standing, index) => (
                  <StandardCard key={standing.name} className={index === 0 ? "surface-card--winner" : ""}>
                    <p className="eyebrow">#{index + 1}</p>
                    <h3>{standing.name}</h3>
                    <p className="numeric-highlight">
                      {standing.amount >= 0 ? "+" : ""}
                      {formatCurrency(standing.amount)}
                    </p>
                    <p className="muted-text">
                      合計スコア {standing.score >= 0 ? "+" : ""}
                      {formatNumber(standing.score)}
                    </p>
                  </StandardCard>
                ))}
              </div>
            </section>

            <section className="stack-md">
              <SectionHeader
                title="支払い一覧"
                description="最終収支を相殺した支払い指示です。"
              />
              <StandardCard className="stack-sm">
                {summary.payments.length === 0 ? (
                  <EmptyState
                    title="支払いはありません"
                    description="同点か、入力途中の可能性があります。"
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
              <SectionHeader
                title="半荘ごとの結果"
                description="各半荘の順位、スコア、円換算結果を確認できます。"
              />
              <div className="stack-md">
                {summary.games.map((game) => (
                  <StandardCard key={game.label}>
                    <div className="card-header">
                      <div>
                        <p className="eyebrow">半荘</p>
                        <h3>{game.label}</h3>
                      </div>
                    </div>
                    <div className="score-grid">
                      {game.rows.map((row) => (
                        <div className="score-row" key={`${game.label}-${row.name}`}>
                          <div>
                            <span className="score-row__rank">#{row.rank}</span>
                            <strong>{row.name}</strong>
                          </div>
                          <div className="score-row__details">
                            <span>{row.point.toLocaleString("ja-JP")}点</span>
                            <span>
                              {row.totalScore >= 0 ? "+" : ""}
                              {formatNumber(row.totalScore)}
                            </span>
                            <strong>
                              {row.amount >= 0 ? "+" : ""}
                              {formatCurrency(row.amount)}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </StandardCard>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
};
