import type { SharedSyncKind, SharedSyncRecord } from "../types/shared";

type PublishSharedStateParams<T> = {
  tripId: string;
  kind: SharedSyncKind;
  data: T;
  updatedBy: string;
  secret: string;
};

type PublishSharedStateResult = {
  ok: true;
  commitUrl?: string;
  updatedAt: string;
};

type PublishSharedStateError = {
  error?: string;
};

const sharedWriteUrl = import.meta.env.VITE_SYNC_WRITE_URL?.trim() ?? "";

const buildSharedAssetUrl = (tripId: string, kind: SharedSyncKind) =>
  `${import.meta.env.BASE_URL}shared/${tripId}/${kind}.json`;

export const hasSharedWriteEndpoint = sharedWriteUrl.length > 0;

export const fetchSharedState = async <T,>(
  tripId: string,
  kind: SharedSyncKind,
): Promise<SharedSyncRecord<T>> => {
  const response = await fetch(buildSharedAssetUrl(tripId, kind), {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("共有データの取得に失敗しました。");
  }

  return (await response.json()) as SharedSyncRecord<T>;
};

export const publishSharedState = async <T,>({
  tripId,
  kind,
  data,
  updatedBy,
  secret,
}: PublishSharedStateParams<T>): Promise<PublishSharedStateResult> => {
  if (!sharedWriteUrl) {
    throw new Error("書き込み先が未設定です。");
  }

  const response = await fetch(sharedWriteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tripId,
      kind,
      data,
      updatedBy,
      secret,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | PublishSharedStateResult
    | PublishSharedStateError
    | null;

  if (!response.ok) {
    const errorPayload = payload as PublishSharedStateError | null;
    throw new Error(errorPayload?.error ?? "GitHub への反映に失敗しました。");
  }

  const successPayload = payload as PublishSharedStateResult | null;
  return {
    ok: true,
    commitUrl: successPayload?.commitUrl,
    updatedAt: successPayload?.updatedAt ?? new Date().toISOString(),
  };
};
