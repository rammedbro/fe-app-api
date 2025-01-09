export interface ValidationError {
  message: string;
  details: Record<string, unknown>;
}
