export type JsonValue = null | string | number | boolean | Array<JsonValue> | { [key: string]: JsonValue };

export type NotAssignableToJson =
  | bigint
  | symbol
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function;

export type JSONCompatible<T> = unknown extends T
  ? never
  : {
      [P in keyof T]: T[P] extends JsonValue ? T[P] : T[P] extends NotAssignableToJson ? never : JSONCompatible<T[P]>;
    };
