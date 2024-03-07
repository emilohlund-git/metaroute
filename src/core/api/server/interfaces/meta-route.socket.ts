import internal from "stream";

export interface MetaRouteSocket extends internal.Duplex {
  id: string;
  writeResponseHeaders: (key?: string) => void;
}
