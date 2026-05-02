import { useEffect, useState } from "react";
import { hasSharedWriteEndpoint } from "../lib/sharedSync";
import { formatDate } from "../lib/format";
import type { SharedSyncStatusTone } from "../types/shared";
import { InfoIcon } from "./InfoIcon";
import { StandardCard } from "./StandardCard";

type SharedSyncPanelProps = {
  storageKey: string;
  updatedAt?: string;
  updatedBy?: string;
  statusMessage?: string;
  statusTone?: SharedSyncStatusTone;
  isRefreshing?: boolean;
  isPublishing?: boolean;
  onRefresh: () => void;
  onPublish: (updatedBy: string, secret: string) => void;
};

export const SharedSyncPanel = ({
  storageKey,
  updatedAt,
  updatedBy,
  statusMessage,
  statusTone = "neutral",
  isRefreshing = false,
  isPublishing = false,
  onRefresh,
  onPublish,
}: SharedSyncPanelProps) => {
  const [updatedByInput, setUpdatedByInput] = useState("");
  const [secret, setSecret] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedName = window.localStorage.getItem(storageKey);
    if (storedName) {
      setUpdatedByInput(storedName);
    }
  }, [storageKey]);

  const handlePublish = () => {
    const trimmedName = updatedByInput.trim();
    const trimmedSecret = secret.trim();

    if (!trimmedName || !trimmedSecret) {
      return;
    }

    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, trimmedName);
    }

    onPublish(trimmedName, trimmedSecret);
  };

  return (
    <StandardCard className="stack-md">
      <div className="sync-panel__header">
        <div>
          <h3>共有データ</h3>
          <p>
            最新を読み込むと GitHub 上の内容で上書きします。反映すると公開サイトにも同じ内容が出ます。
          </p>
        </div>
        <span className="icon-chip" aria-hidden="true">
          <InfoIcon name="trip" className="icon-chip__icon" />
        </span>
      </div>

      <div className="detail-grid">
        <div className="metric-card">
          <span>最終反映</span>
          <strong>{updatedAt ? `${formatDate(updatedAt.slice(0, 10))} ${updatedAt.slice(11, 16)}` : "未反映"}</strong>
        </div>
        <div className="metric-card">
          <span>更新者</span>
          <strong>{updatedBy ?? "-"}</strong>
        </div>
      </div>

      {statusMessage ? (
        <p className={`sync-panel__status sync-panel__status--${statusTone}`}>{statusMessage}</p>
      ) : null}

      <div className="inline-cluster">
        <button className="button button--secondary" type="button" onClick={onRefresh} disabled={isRefreshing}>
          {isRefreshing ? "読み込み中..." : "最新を取得"}
        </button>
      </div>

      {hasSharedWriteEndpoint ? (
        <>
          <div className="form-grid">
            <label className="field">
              <span>更新者名</span>
              <input
                value={updatedByInput}
                onChange={(event) => setUpdatedByInput(event.target.value)}
                placeholder="例: shun"
              />
            </label>
            <label className="field">
              <span>管理者パスコード</span>
              <input
                type="password"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
                placeholder="Worker の秘密"
              />
            </label>
          </div>
          <div className="inline-cluster">
            <button
              className="button button--primary"
              type="button"
              onClick={handlePublish}
              disabled={isPublishing || !updatedByInput.trim() || !secret.trim()}
            >
              {isPublishing ? "反映中..." : "GitHubへ反映"}
            </button>
          </div>
          <p className="sync-panel__hint">反映すると GitHub に commit され、GitHub Pages の再デプロイ後に全員へ反映されます。</p>
        </>
      ) : (
        <p className="sync-panel__hint">書き込み API 未設定です。読み込みだけ利用できます。</p>
      )}
    </StandardCard>
  );
};
