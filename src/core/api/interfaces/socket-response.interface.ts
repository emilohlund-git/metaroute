export interface SocketResponse<T> {
  event: string;
  data: T;
}
