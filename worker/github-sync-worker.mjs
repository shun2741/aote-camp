const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  Vary: "Origin",
});

const jsonResponse = (payload, init = {}, origin = "*") =>
  new Response(JSON.stringify(payload, null, 2), {
    ...init,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(origin),
      ...(init.headers ?? {}),
    },
  });

const encodeBase64Utf8 = (value) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
};

const parseAllowedOrigins = (value) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const getAllowedOrigin = (requestOrigin, allowedOrigins) => {
  if (!requestOrigin) {
    return allowedOrigins[0] ?? "*";
  }

  if (allowedOrigins.length === 0 || allowedOrigins.includes(requestOrigin)) {
    return requestOrigin;
  }

  return null;
};

const buildGithubHeaders = (token) => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "aote-camp-sync-worker",
});

const readExistingSha = async ({ owner, repo, branch, path, token }) => {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, {
    headers: buildGithubHeaders(token),
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub file lookup failed: ${text}`);
  }

  const payload = await response.json();
  return payload.sha ?? null;
};

export default {
  async fetch(request, env) {
    const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const requestOrigin = request.headers.get("Origin");
    const allowedOrigin = getAllowedOrigin(requestOrigin, allowedOrigins);

    if (!allowedOrigin) {
      return jsonResponse({ error: "Origin not allowed." }, { status: 403 }, allowedOrigins[0] ?? "*");
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin),
      });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, { status: 405 }, allowedOrigin);
    }

    const {
      GITHUB_TOKEN,
      GITHUB_OWNER,
      GITHUB_REPO,
      GITHUB_BRANCH = "main",
      WRITE_SECRET,
    } = env;

    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !WRITE_SECRET) {
      return jsonResponse({ error: "Worker secrets are not configured." }, { status: 500 }, allowedOrigin);
    }

    let payload;

    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body." }, { status: 400 }, allowedOrigin);
    }

    const tripId = typeof payload.tripId === "string" ? payload.tripId.trim() : "";
    const kind = payload.kind === "expenses" || payload.kind === "mahjong" ? payload.kind : "";
    const updatedBy = typeof payload.updatedBy === "string" ? payload.updatedBy.trim() : "";
    const secret = typeof payload.secret === "string" ? payload.secret : "";

    if (!tripId || !kind || !updatedBy || !payload.data) {
      return jsonResponse({ error: "Required fields are missing." }, { status: 400 }, allowedOrigin);
    }

    if (secret !== WRITE_SECRET) {
      return jsonResponse({ error: "管理者パスコードが違います。" }, { status: 401 }, allowedOrigin);
    }

    const filePath = `public/shared/${tripId}/${kind}.json`;
    const updatedAt = new Date().toISOString();
    const nextContent = `${JSON.stringify(
      {
        version: 1,
        updatedAt,
        updatedBy,
        data: payload.data,
      },
      null,
      2,
    )}\n`;

    try {
      const sha = await readExistingSha({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        branch: GITHUB_BRANCH,
        path: filePath,
        token: GITHUB_TOKEN,
      });

      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`,
        {
          method: "PUT",
          headers: buildGithubHeaders(GITHUB_TOKEN),
          body: JSON.stringify({
            message: `Update ${kind} for ${tripId}`,
            content: encodeBase64Utf8(nextContent),
            branch: GITHUB_BRANCH,
            ...(sha ? { sha } : {}),
          }),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const result = await response.json();
      return jsonResponse(
        {
          ok: true,
          updatedAt,
          commitUrl: result.commit?.html_url,
        },
        { status: 200 },
        allowedOrigin,
      );
    } catch (error) {
      return jsonResponse(
        {
          error: error instanceof Error ? error.message : "GitHub update failed.",
        },
        { status: 500 },
        allowedOrigin,
      );
    }
  },
};
