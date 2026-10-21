const STATEMENT_QUERY = `query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
  }
}`;

const COULD_NOT_LOAD = "The statement could not be loaded.";

export function problemSlug(url: string): string | null {
  try {
    const parts = new URL(url).pathname.split("/").filter(Boolean);
    const index = parts.indexOf("problems");
    const slug = index >= 0 ? parts[index + 1] : undefined;
    if (!slug) {
      return null;
    }
    return decodeURIComponent(slug);
  } catch {
    return null;
  }
}

export function stripHtml(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "\n- ")
    .replace(/<\/(p|div|h[1-6]|li|pre|ul|ol|tr)>/gi, "\n");
  const text = withBreaks.replace(/<[^>]+>/g, "");
  return decodeEntities(text)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeEntities(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code))
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    );
}

export function statementFromGraphql(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("data" in body)) {
    return null;
  }

  const data = body.data;
  if (typeof data !== "object" || data === null || !("question" in data)) {
    return null;
  }

  const question = data.question;
  if (
    typeof question !== "object" ||
    question === null ||
    !("content" in question) ||
    typeof question.content !== "string"
  ) {
    return null;
  }

  const text = stripHtml(question.content);
  return text.length > 0 ? text : null;
}

export function statementFromCache(
  value: string | null | undefined
): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function resolveStatement(
  cached: string | null | undefined,
  fetched: string | null
): { statement: string; source: "cache" | "fetch" } | { statement: null } {
  const stored = statementFromCache(cached);
  if (stored) {
    return { statement: stored, source: "cache" };
  }

  const next = statementFromCache(fetched);
  if (next) {
    return { statement: next, source: "fetch" };
  }

  return { statement: null };
}

export async function fetchProblemStatement(
  slug: string
): Promise<string | null> {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        referer: "https://leetcode.com",
      },
      body: JSON.stringify({
        query: STATEMENT_QUERY,
        variables: { titleSlug: slug },
      }),
    });

    if (!response.ok) {
      return null;
    }

    return statementFromGraphql(await response.json());
  } catch {
    return null;
  }
}

export function scrapedProblemResult(statement: string | null): string {
  if (!statement) {
    return JSON.stringify({ error: COULD_NOT_LOAD });
  }

  return JSON.stringify({ statement });
}
