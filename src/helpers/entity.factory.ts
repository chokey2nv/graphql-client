import { EntityKey, Pluralize } from "./crud.contract";

export function createEntityIntegration<
  K extends EntityKey,
  Fields,
  Nested extends Record<string, any> = {}
>(config: {
  key: K;
  fields: Fields;
  nested?: Nested;
}) {
  return {
    responseFields: [config.key] as [K],
    nestedFields: {
      ...(config.nested ?? {}),
      [config.key]: config.fields,
    } as Record<K, Fields> & Nested,
  };
}


export function createListIntegration<
  K extends EntityKey,
  Fields,
  Nested extends Record<string, any> = {}
>(config: {
  key: K;
  fields: Fields;
  nested?: Nested;
}) {
  const pluralKey =
    (config.key.endsWith("y")
      ? `${config.key.slice(0, -1)}ies`
      : `${config.key}s`) as Pluralize<K>;

  return {
    responseFields: [pluralKey, "total"] as const,
    nestedFields: {
      ...(config.nested ?? {}),
      [pluralKey]: config.fields,
    } as Record<Pluralize<K>, Fields> & Nested,
  };
}

export function createDeleteIntegration<K extends EntityKey>(key: K) {
  const idKey = `${key}Id` as const;

  return {
    responseFields: [idKey] as [typeof idKey],
  };
}


export function createStandardEntityIntegration<
  K extends string,
  Fields,
  Nested extends Record<string, any> = {}
>(config: {
  key: K;
  fields: Fields;
  nested?: Nested;
}) {
  const base = createEntityIntegration(config);

  return {
    get: base,
    create: base,
    update: base,
  };
}
