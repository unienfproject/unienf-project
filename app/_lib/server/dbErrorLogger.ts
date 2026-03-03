import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

type DbErrorLogInput = {
  action: string;
  stage: string;
  actorId?: string | null;
  payload?: Record<string, unknown>;
  error: unknown;
};

type SerializableError = {
  name?: string;
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
  status?: number;
  stack?: string;
  raw?: unknown;
};

function normalizeError(error: unknown): SerializableError {
  if (error instanceof Error) {
    const e = error as Error & {
      code?: string;
      details?: string;
      hint?: string;
      status?: number;
    };
    return {
      name: e.name,
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
      status: e.status,
      stack: e.stack,
    };
  }

  if (typeof error === "object" && error !== null) {
    const e = error as {
      name?: string;
      message?: string;
      code?: string;
      details?: string;
      hint?: string;
      status?: number;
    };
    return {
      name: e.name,
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
      status: e.status,
      raw: error,
    };
  }

  return { message: String(error) };
}

export async function saveDbErrorLog(input: DbErrorLogInput) {
  const normalizedError = normalizeError(input.error);
  const line = JSON.stringify({
    timestamp: new Date().toISOString(),
    action: input.action,
    stage: input.stage,
    actorId: input.actorId ?? null,
    payload: input.payload ?? {},
    error: normalizedError,
  });

  const logsDir = path.join(process.cwd(), "logs");
  const filePath = path.join(logsDir, "db-errors.jsonl");

  try {
    await mkdir(logsDir, { recursive: true });
    await appendFile(filePath, `${line}\n`, "utf8");
  } catch (writeErr) {
    console.error("[db-error-log] Falha ao gravar arquivo de log", writeErr);
  }

  console.error("[db-error-log]", line);
}

