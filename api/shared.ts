const jsonResponse = (payload: unknown, init: ResponseInit = {}) =>
  new Response(JSON.stringify(payload, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(init.headers ?? {}),
    },
  });

const buildGithubHeaders = (token?: string) => ({
  Accept: "application/vnd.github+json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "aote-camp-vercel-api",
});

const encodeBase64Utf8 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const getGithubConfig = () => ({
  owner: process.env.GITHUB_OWNER?.trim() ?? "",
  repo: process.env.GITHUB_REPO?.trim() ?? "",
  branch: process.env.GITHUB_BRANCH?.trim() || "main",
  token: process.env.GITHUB_TOKEN?.trim() ?? "",
  writeSecret: process.env.WRITE_SECRET?.trim() ?? "",
});

const isSharedKind = (value: string) => value === "expenses" || value === "mahjong";

const readExistingSha = async (owner: string, repo: string, branch: string, path: string, token: string) => {
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    {
      headers: buildGithubHeaders(token),
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const payload = (await response.json()) as { sha?: string };
  return payload.sha ?? null;
};

const handleGet = async (request: Request) => {
  const { owner, repo, branch } = getGithubConfig();

  if (!owner || !repo) {
    return jsonResponse({ error: "GitHub config is missing." }, { status: 500 });
  }

  const url = new URL(request.url);
  const tripId = url.searchParams.get("tripId")?.trim() ?? "";
  const kind = url.searchParams.get("kind")?.trim() ?? "";

  if (!tripId || !isSharedKind(kind)) {
    return jsonResponse({ error: "tripId and kind are required." }, { status: 400 });
  }

  const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/public/shared/${tripId}/${kind}.json?ts=${Date.now()}`;
  const response = await fetch(rawUrl, {
    headers: {
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return jsonResponse({ error: "共有データの取得に失敗しました。" }, { status: response.status });
  }

  return new Response(await response.text(), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
};

const handlePost = async (request: Request) => {
  const { owner, repo, branch, token, writeSecret } = getGithubConfig();

  if (!owner || !repo || !token || !writeSecret) {
    return jsonResponse({ error: "Vercel environment variables are not configured." }, { status: 500 });
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, { status: 400 });
  }

  const record = payload as {
    tripId?: unknown;
    kind?: unknown;
    updatedBy?: unknown;
    secret?: unknown;
    data?: unknown;
  };

  const tripId = typeof record.tripId === "string" ? record.tripId.trim() : "";
  const kind = typeof record.kind === "string" ? record.kind.trim() : "";
  const updatedBy = typeof record.updatedBy === "string" ? record.updatedBy.trim() : "";
  const secret = typeof record.secret === "string" ? record.secret : "";

  if (!tripId || !isSharedKind(kind) || !updatedBy || record.data === undefined) {
    return jsonResponse({ error: "Required fields are missing." }, { status: 400 });
  }

  if (secret !== writeSecret) {
    return jsonResponse({ error: "管理者パスコードが違います。" }, { status: 401 });
  }

  const path = `public/shared/${tripId}/${kind}.json`;
  const updatedAt = new Date().toISOString();
  const content = `${JSON.stringify(
    {
      version: 1,
      updatedAt,
      updatedBy,
      data: record.data,
    },
    null,
    2,
  )}\n`;

  try {
    const sha = await readExistingSha(owner, repo, branch, path, token);
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: "PUT",
      headers: buildGithubHeaders(token),
      body: JSON.stringify({
        message: `Update ${kind} for ${tripId}`,
        content: encodeBase64Utf8(content),
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = (await response.json()) as {
      commit?: {
        html_url?: string;
      };
    };

    return jsonResponse({
      ok: true,
      updatedAt,
      commitUrl: result.commit?.html_url,
    });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : "GitHub update failed.",
      },
      { status: 500 },
    );
  }
};

export default async function handler(request: Request) {
  if (request.method === "GET") {
    return handleGet(request);
  }

  if (request.method === "POST") {
    return handlePost(request);
  }

  return jsonResponse({ error: "Method not allowed." }, { status: 405 });
}
