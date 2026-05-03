import { useParams } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { BottomNavigation } from "../components/BottomNavigation";
import { EmptyState } from "../components/EmptyState";
import { HeroCard } from "../components/HeroCard";
import { SectionHeader } from "../components/SectionHeader";
import { StandardCard } from "../components/StandardCard";
import { getTripById } from "../data/trips";
import { NotFoundPage } from "./NotFoundPage";

export const GolfPage = () => {
  const { tripId = "" } = useParams();
  const trip = getTripById(tripId);

  if (!trip) {
    return <NotFoundPage />;
  }

  return (
    <AppShell
      title="ゴルフ"
      subtitle={trip.title}
      backTo={`/trips/${trip.id}`}
      backLabel="概要"
      bottomNav={<BottomNavigation tripId={trip.id} />}
    >
      <div className="stack-lg">
        <HeroCard
          eyebrow="南筑波ゴルフ場"
          title="ミニコース案内"
          icon="golf"
          meta={[
            { label: "予定", value: "2日目 午後" },
            { label: "形式", value: "ミニコース" },
            { label: "予約", value: "不要" },
          ]}
        />

        <section className="stack-md">
          <SectionHeader title="まず見る情報" />
          <div className="detail-grid">
            <StandardCard>
              <h3>公式サイト</h3>
              <p>コース、料金、アクセスはここから確認。</p>
              <a
                className="button button--secondary"
                href="https://www.minamitsukubagolf.com/"
                target="_blank"
                rel="noreferrer"
              >
                公式サイトを開く
              </a>
            </StandardCard>
            <StandardCard>
              <h3>ミニコースの前提</h3>
              <p>PAR27 / 875ヤード。予約不要で、到着順で回る形式です。</p>
              <a
                className="button button--ghost"
                href="https://www.minamitsukubagolf.com/course.html"
                target="_blank"
                rel="noreferrer"
              >
                コース情報
              </a>
            </StandardCard>
          </div>
        </section>

        <section className="stack-md">
          <SectionHeader title="初めての人向け" />
          <div className="stack-sm">
            <div className="note-card">
              プレーに相応しい服装が必要です。ミニコースでもラフすぎる服装は避けた方が安全です。
            </div>
            <div className="note-card">
              ミニコースはアイアン以外のクラブ使用禁止です。ドライバーやウッドは持っていかない前提で考えるのが無難です。
            </div>
            <div className="note-card">
              レンタルはあります。ミニコース用ハーフセットは 1,000円、シューズは 500円です。
            </div>
            <div className="note-card">
              キャディバッグは当場備え付けバッグ、または自分のミニバッグを使います。大きいバッグ前提ではありません。
            </div>
            <div className="note-card">
              ミニコースは1周約50分が目安です。7人だと2組に分かれる想定なので、1周で1時間前後を見ておくのが自然です。
            </div>
          </div>
        </section>

        <section className="stack-md">
          <SectionHeader title="当日の流れメモ" />
          <div className="detail-grid">
            <div className="metric-card">
              <span>移動</span>
              <strong>昼食後に車で移動想定</strong>
            </div>
            <div className="metric-card">
              <span>受付</span>
              <strong>到着順でそのまま準備</strong>
            </div>
            <div className="metric-card">
              <span>想定プレー</span>
              <strong>1周 + 余裕があれば追加</strong>
            </div>
            <div className="metric-card">
              <span>注意</span>
              <strong>16時まで回り放題</strong>
            </div>
          </div>
        </section>

        <section className="stack-md">
          <SectionHeader title="リンク" />
          <div className="inline-cluster">
            <a
              className="button button--secondary"
              href="https://www.minamitsukubagolf.com/"
              target="_blank"
              rel="noreferrer"
            >
              南筑波ゴルフ場
            </a>
            <a
              className="button button--ghost"
              href="https://www.minamitsukubagolf.com/faq.html"
              target="_blank"
              rel="noreferrer"
            >
              FAQ
            </a>
            <a
              className="button button--ghost"
              href="https://www.minamitsukubagolf.com/access.html"
              target="_blank"
              rel="noreferrer"
            >
              アクセス
            </a>
          </div>
        </section>
      </div>
    </AppShell>
  );
};
