interface AbstractError {
  code: string;
  message: string;
  details: unknown;
}

interface RouteValidationErrorDetails {
  [key: string]: {
    message: string;
    value?: unknown;
  };
}
export class RouteValidationError implements AbstractError {
  code = 'ROUTE_VALIDATION_ERROR' as const;
  message = 'Route validation failed';

  constructor(public details: RouteValidationErrorDetails) {}
}

interface SchemaValidationErrorDetails {
  [key: string]: string[] | undefined;
}
export class SchemaValidationError implements AbstractError {
  code = 'SCHEMA_VALIDATION_ERROR' as const;
  message = 'Schema validation failed';

  constructor(public details: SchemaValidationErrorDetails) {}
}

export class UniquenessConstraintError implements AbstractError {
  code = 'UNIQUENESS_CONSTRAINT_ERROR' as const;
  message = 'Uniqueness constraint violation';

  constructor(public details: string[]) {}
}
