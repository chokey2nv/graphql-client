import type { GraphQLClient } from "../client";
import type { GraphQLRequest, GraphQLResponse } from "../types/request";

/**
 * Very small mock client that conforms to GraphQLClient.request interface.
 * Use in tests to return canned responses.
 */
export const createMockClient = (handler: (req: GraphQLRequest) => Promise<GraphQLResponse>) => {
  return {
    request: async <T = any>(query: string, variables?: Record<string, any>) => {
      return (await handler({ query, variables })) as GraphQLResponse<T>;
    },
  } as unknown as GraphQLClient;
};

