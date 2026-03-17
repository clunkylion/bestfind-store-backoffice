import { logger } from "./logger";

export class AppError extends Error {
  constructor(
    message: string,
    public code: string = "INTERNAL_ERROR",
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleServerError(
  error: unknown,
  context?: { userId?: string; action?: string; entity?: string }
): { success: false; error: string } {
  if (error instanceof AppError) {
    logger.warn({ ...context, code: error.code, message: error.message }, "App error");
    return { success: false, error: error.message };
  }

  logger.error({ ...context, error }, "Unexpected server error");
  return { success: false, error: "Ocurrió un error inesperado. Intenta de nuevo." };
}
