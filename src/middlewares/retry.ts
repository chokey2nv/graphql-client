import type { Middleware } from "../middleware";

export const retryMiddleware = (opts?: { retries?: number; delayMs?: number }): Middleware => {
  const retries = opts?.retries ?? 2;
  const delayMs = opts?.delayMs ?? 150;
  return async (ctx, resCtx, next) => {
    let attempt = 0;
    while (attempt <= retries) {
      await next();
      if (!resCtx.error) return;
      attempt++;
      if (attempt > retries) return;
      await new Promise((r) => setTimeout(r, delayMs * attempt));
    }
  };
};
