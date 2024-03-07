import { randomUUID } from "crypto";
import EventEmitter from "events";
import { MetaRouteEvent } from "./interfaces/metaroute-event.interface";
import { MetaRouteSocket } from "./interfaces/meta-route.socket";

export class MetaRouteNamespace extends EventEmitter {
  private _id: string;
  private _name: string;
  private clients: Set<MetaRouteSocket> = new Set();

  constructor(name: string) {
    super();

    this._name = name;
    this._id = randomUUID();
  }

  broadcast(message: MetaRouteEvent) {
    this.clients.forEach((client) => {
      client.send(message);
    });
  }

  add(client: MetaRouteSocket) {
    this.clients.add(client);
    this.emit("connection", client);
  }

  remove(client: MetaRouteSocket) {
    this.clients.delete(client);
    this.emit("disconnect", client);
  }

  all(): MetaRouteSocket[] {
    return Array.from(this.clients);
  }

  has(client: MetaRouteSocket) {
    return this.clients.has(client);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }
}
