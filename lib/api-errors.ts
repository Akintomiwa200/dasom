import { NextResponse } from "next/server";
import { DatabaseConfigError, isDatabaseConfigError } from "@/lib/database-url";

export function databaseErrorResponse(err: unknown) {
  if (isDatabaseConfigError(err)) {
    return NextResponse.json({ error: err.message }, { status: 503 });
  }

  const message = err instanceof Error ? err.message : "";
  if (message.includes("SCRAM") || message.includes("password must be a string")) {
    return NextResponse.json(
      {
        error:
          "Database connection failed. Set DATABASE_URL in .env (postgresql://USER:PASSWORD@localhost:5432/dasom?schema=public), then restart the dev server with pnpm dev.",
      },
      { status: 503 }
    );
  }

  if (message.includes("ECONNREFUSED") || message.includes("connect")) {
    return NextResponse.json(
      {
        error:
          "Cannot reach PostgreSQL. Ensure the database server is running and DATABASE_URL points to it.",
      },
      { status: 503 }
    );
  }

  return null;
}

export { DatabaseConfigError };
