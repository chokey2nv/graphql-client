import { GraphQLRequest, GraphQLResponse } from "./types/request";
import { CacheRequestOptions } from "./middlewares/cache";

export type RequestContext<U = any> = {
  request: GraphQLRequest<U>;
  url: string;
  headers: Record<string, string>;
  meta?: Record<string, any>;
  cacheOptions?: CacheRequestOptions;
};

export type ResponseContext<T = any> = {
  response?: GraphQLResponse<T> | null;
  error?: Error | null;
  status?: number | null;
};

export type Next = () => Promise<void>;

export type Middleware = <T = any, U = any>(
  ctx: RequestContext<U>,
  resCtx: ResponseContext<T>,
  next: Next
) => Promise<void>;

/**
 * compose middlewares into a single runner.
 * similar idea to koa-compose.
 */
export const compose =
  (middlewares: Middleware[]) =>
  async <T = any, U = any>(ctx: RequestContext<U>, resCtx: ResponseContext<T>) => {
    let idx = -1;
    const dispatch = async (i: number): Promise<void> => {
      if (i <= idx) throw new Error("next() called multiple times");
      idx = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(ctx, resCtx, () => dispatch(i + 1));
    };
    await dispatch(0);
  };
