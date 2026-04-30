import type { RequestContext, ResponseContext, Middleware } from "./middleware";
import type { GraphQLResponse } from "./types/request";

export type TransportOptions = {
  fetchImpl?: typeof fetch; // allow injection (node polyfill or axios wrapper)
  timeoutMs?: number;
};

export const createTransport = (opts?: TransportOptions): Middleware => {
  const fetchImpl = opts?.fetchImpl ?? (typeof fetch !== "undefined" ? fetch.bind(globalThis) : undefined);

  if (!fetchImpl) {
    throw new Error(
      "No fetch implementation available. Provide fetchImpl in TransportOptions or polyfill fetch."
    );
  }

  return async (ctx: RequestContext, resCtx: ResponseContext, next) => {
    // last middleware should perform network request and fill resCtx.response or resCtx.error
    const body = JSON.stringify({ query: ctx.request.query, variables: ctx.request.variables });
    try {
      const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
      const signal = controller?.signal;
      let timer: any;
      if (controller && opts?.timeoutMs) timer = setTimeout(() => controller.abort(), opts!.timeoutMs);

      const r = await fetchImpl(ctx.url, {
        method: "POST",
        headers: ctx.headers,
        body,
        signal,
      });

      if (timer) clearTimeout(timer);

      const text = await r.text();
      let parsed: GraphQLResponse;
      try {
        parsed = JSON.parse(text);
      } catch {
        resCtx.error = new Error("Invalid JSON response");
        resCtx.status = r.status;
        return;
      }
      resCtx.response = parsed;
      resCtx.status = r.status;
    } catch (err: any) {
      if (err.name === "AbortError") resCtx.error = new Error("Request timed out");
      else resCtx.error = err;
    }
    await next();
  };
};
