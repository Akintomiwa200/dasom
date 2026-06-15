export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

function sanitizeEnvValue(value: string | undefined): string {
  if (!value) return "";
  return value.trim().replace(/^["']|["']$/g, "").replace(/\.{3,}$/, "");
}

/** pg SCRAM auth requires password to be a string — never undefined/null */
export function getDatabaseUrl(): string {
  const raw = sanitizeEnvValue(process.env.DATABASE_URL);
  if (!raw) {
    throw new DatabaseConfigError(
      "DATABASE_URL is not set. Copy .env.example to .env and set your PostgreSQL connection string."
    );
  }
  return normalizePostgresUrl(raw);
}

/**
 * Build a URL that always includes an explicit password segment so pg never
 * resolves password to null (SCRAM requires typeof password === "string").
 */
function normalizePostgresUrl(connectionString: string): string {
  try {
    const url = new URL(connectionString);
    if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
      return connectionString;
    }

    const user = decodeURIComponent(url.username || process.env.PGUSER || "postgres");
    const password = decodeURIComponent(
      url.password || process.env.PGPASSWORD || ""
    );

    if (!password) {
      throw new DatabaseConfigError(
        "PostgreSQL password is missing. Use postgresql://USER:PASSWORD@localhost:5432/dasom in DATABASE_URL, or set PGPASSWORD in .env."
      );
    }
    const host = url.hostname || "localhost";
    const port = url.port || "5432";
    const database = url.pathname.replace(/^\//, "") || "dasom";

    // Rebuild query without duplicating schema if already present
    const params = new URLSearchParams(url.search);
    if (!params.has("schema")) {
      params.set("schema", "public");
    }

    const search = params.toString();
    return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}${search ? `?${search}` : ""}`;
  } catch {
    throw new DatabaseConfigError(
      "DATABASE_URL is invalid. Use: postgresql://USER:PASSWORD@localhost:5432/dasom?schema=public"
    );
  }
}

export function isDatabaseConfigError(err: unknown): err is DatabaseConfigError {
  return err instanceof DatabaseConfigError;
}
