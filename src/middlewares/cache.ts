import type { Middleware } from "../middleware";
import type { GraphQLResponse } from "../types/request";

type CacheKeyFn<U = any> = (query: string, variables?: U) => string;

export type CacheOptions<U = any> = {
  ttlMs?: number; // time-to-live per entry
  keyFn?: CacheKeyFn<U>; // custom key generator
  maxEntries?: number; // optional cap (naive LRU)
};

type Entry = {
  value: GraphQLResponse;
  expiry: number;
};

export interface CacheRequestOptions {
  skipCache?: boolean; // per-request override
}

export type CacheMiddleware = Middleware & {
  clearCache: () => void;
};

export const createCacheMiddleware = (opts?: CacheOptions): CacheMiddleware => {
  const ttl = opts?.ttlMs ?? 30_000; // default 30s
  const keyFn: CacheKeyFn = opts?.keyFn ?? ((q, v) => JSON.stringify({ q, v }));
  const maxEntries = opts?.maxEntries ?? 100;

  const store = new Map<string, Entry>();

  const middleware: Middleware = async (ctx, resCtx, next) => {
    const { skipCache } = ctx.cacheOptions || {};

    // Only cache queries, not mutations
    if (
      !skipCache &&
      ctx.request.query.trim().toLowerCase().startsWith("query")
    ) {
      const key = keyFn(ctx.request.query, ctx.request.variables);
      const now = Date.now();

      // 1. Serve from cache if valid
      const hit = store.get(key);
      if (hit && hit.expiry > now) {
        resCtx.response = hit.value;
        resCtx.status = 200;
        return;
      }

      // 2. Proceed with request
      await next();

      // 3. Cache successful result
      if (resCtx.response && !resCtx.error) {
        store.set(key, { value: resCtx.response, expiry: now + ttl });

        // basic LRU eviction
        if (store.size > maxEntries) {
          const oldestKey = store.keys().next().value;
          if (oldestKey) store.delete(oldestKey);
        }
      }
    } else {
      // skip caching for this request
      await next();
    }
  };

  const cacheMw = middleware as CacheMiddleware;
  cacheMw.clearCache = () => {
    store.clear();
  };

  return cacheMw;
};
