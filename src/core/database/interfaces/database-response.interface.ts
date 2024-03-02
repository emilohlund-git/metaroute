export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: unknown;
}
