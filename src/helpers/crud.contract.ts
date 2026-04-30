export type EntityKey = string;

/** ---------- Requests ---------- */

export type GetEntityRequest<T, K extends EntityKey> = {
  [P in K]: Partial<T>;
};

export type CreateEntityRequest<T, K extends EntityKey> =
  GetEntityRequest<T, K>;

export type UpdateEntityRequest<T, K extends EntityKey> = {
  [P in K]: Partial<T>;
} & {
  [P in K as `${P}Id`]: string;
};

/** ---------- Responses ---------- */

export type EntityResponse<T, K extends EntityKey> = {
  [P in K]: T;
};

/** ---------- Field helpers ---------- */

export type EntityResponseFields<K extends EntityKey> = K[];

export type EntityNestedFields<
  K extends EntityKey,
  F extends Record<string, any>
> = {
  [P in K]: F;
} & Record<string, any>;

/** ---------- List ---------- */

export type ListEntityRequest<T, K extends EntityKey> = {
  [P in K]?: Partial<T>;
} & {
  [P in K as `${P}Ids`]?: string[];
} & {
  limit: number;
  skip: number;
  search?: string;
};

export type ListEntityResponse<T, K extends EntityKey> = {
  [P in `${K}s`]: T[];
} & {
  total: number;
};

export type ListEntityResponseFields<K extends EntityKey> =
  [`${K}s`, "total"];

  export type ListEntityNestedFields<
  K extends EntityKey,
  F extends Record<string, any>
> = {
  [P in `${K}s`]: F;
} & Record<string, any>;

/** ---------- Delete ---------- */

export type DeleteEntityRequest<K extends EntityKey> = {
  [P in `${K}Id`]: string;
};
export type DeleteEntityResponse<K extends EntityKey> =
  DeleteEntityRequest<K>;
export type DeleteEntityResponseFields<K extends EntityKey> =
  [`${K}Id`];


  /** ------------------- Boilerplate ------------------- */
export type EntityCRUD<
  T,
  K extends string
> = {
    GetRequest: GetEntityRequest<T, K>;
    CreateRequest: CreateEntityRequest<T, K>;
    UpdateRequest: UpdateEntityRequest<T, K>;
    DeleteRequest: DeleteEntityRequest<K>;
    ListRequest: ListEntityRequest<T, K>;

    GetResponse: EntityResponse<T, K>;
    CreateResponse: EntityResponse<T, K>;
    UpdateResponse: EntityResponse<T, K>;
    DeleteResponse: DeleteEntityResponse<K>;
    ListResponse: ListEntityResponse<T, K>;
};
