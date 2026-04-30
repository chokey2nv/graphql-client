export type AuthTokenProvider = () => Promise<string | null> | string | null;
export type HeadersFactory = () => Promise<Record<string, string>> | Record<string, string>;

export const toAsyncTokenProvider = (p?: AuthTokenProvider): (() => Promise<string | null>) => {
  if (!p) return async () => null;
  return async () => {
    try {
      const res = p();
      return res instanceof Promise ? await res : res;
    } catch {
      return null;
    }
  };
};

export const toAsyncHeadersFactory = (
  f?: HeadersFactory
): (() => Promise<Record<string, string>>) => {
  if (!f) return async () => ({});
  return async () => {
    try {
      const res = f();
      return (res instanceof Promise ? await res : res) ?? {};
    } catch {
      return {};
    }
  };
};
