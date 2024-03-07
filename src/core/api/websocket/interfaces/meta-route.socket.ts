import internal from "stream";
import { MetaRouteNamespace } from "../metaroute-namespace.socket";
import { MetaRouteEvent } from "./metaroute-event.interface";
import { MetaRouteSocketState } from "../enums";

export interface MetaRouteSocket extends internal.Duplex {
  id: string;
  event: MetaRouteEvent | null;
  namespaces: Map<string, MetaRouteNamespace>;
  state: MetaRouteSocketState;
  writeResponseHeaders: (key?: string) => void;
  join: (namespace: MetaRouteNamespace) => void;
  leave: (namespace: MetaRouteNamespace) => void;
  send(data: MetaRouteEvent): void;
}
