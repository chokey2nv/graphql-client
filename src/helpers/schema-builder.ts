type OperationType = "query" | "mutation";

export interface SchemaConfig {
  operation: OperationType;
  name: string;
  variables: string;
  field: string;
}
export type DefaultSchemaFields = "get" | "create" | "update" | "delete" | "list";

export function buildSchema({
  operation,
  name,
  variables,
  field,
}: SchemaConfig) {
  return (selection: string) => `
    ${operation} ${name}${variables} {
      ${name}${field} {
        ${selection}
      }
    }
  `.trim();
}
