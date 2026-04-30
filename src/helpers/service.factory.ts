import { GraphQLClient, RequestOption } from "../client";
import { gqlQueryStringBuilder } from "./query";

export type OperationDefinition<
  TRequest,
  TResponse,
  TNestedFields
> = {
  schema: (query: string) => string;
  defaultRootFields: (keyof TResponse)[];
  defaultNestedFields: TNestedFields;
};

export function createOperationExecutor2<
  TKey extends string,
  TRequest,
  TResponse extends object,
  TNestedFields
>(
  client: GraphQLClient,
  key: TKey,
  config: OperationDefinition<TRequest, TResponse, TNestedFields>
) {
  return async (
    input: TRequest,
    fetchFields?: {
      root?: (keyof TResponse)[];
      nestedFields?: TNestedFields;
    },
    option?: RequestOption
  ): Promise<TResponse | undefined> => {

    const query = config.schema(
      gqlQueryStringBuilder<TResponse, TNestedFields>(
        fetchFields?.root ?? config.defaultRootFields,
        fetchFields?.nestedFields ?? config.defaultNestedFields
      )
    );

    const res = await client.request<{ [K in TKey]: TResponse }>(
      query,
      input,
      option
    );

    return res.data?.[key];
  };
}

export function createOperationExecutor<
  TKey extends string,
  TRequest,
  TResponse extends object,
  TNestedFields
>(
  client: GraphQLClient,
  key: TKey,
  config: OperationDefinition<TRequest, TResponse, TNestedFields>
) {
  return async (
    input: TRequest,
    fetchFields?: {
      root?: (keyof TResponse)[];
      nestedFields?: TNestedFields;
    },
    option?: RequestOption
  ): Promise<TResponse | undefined> => {

    const query = config.schema(
      gqlQueryStringBuilder<TResponse, TNestedFields>(
        fetchFields?.root ?? config.defaultRootFields,
        fetchFields?.nestedFields ?? config.defaultNestedFields
      )
    );

    const res = await client.request<{ [K in TKey]: TResponse }>(
      query,
      input,
      option
    );

    return res.data?.[key];
  };
}
export function buildService<
  TOperations extends Record<
    string,
    OperationDefinition<any, any, any>
  >
>(
  client: GraphQLClient,
  operations: TOperations
) {
  type Service = {
    [K in keyof TOperations]:
      TOperations[K] extends OperationDefinition<
        infer TVariables,
        infer TResponse,
        infer TNestedFields
      >
        ? (
            input: TVariables,
            fetchFields?: {
              root?: (keyof TResponse)[];
              nestedFields?: TNestedFields;
            },
            option?: RequestOption
          ) => Promise<TResponse | undefined>
        : never;
  };

  const service = {} as Service;

  for (const key in operations) {
    service[key as keyof TOperations] =
      createOperationExecutor(
        client,
        key,
        operations[key]
      ) as Service[typeof key];
  }

  return service;
}