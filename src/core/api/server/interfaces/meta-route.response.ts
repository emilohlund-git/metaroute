import { Engine } from "@core/engine/engine.abstract";
import { ServerResponse } from "http";

export interface MetaRouteResponse extends ServerResponse {
  status(code: number): this;
  send(data?: any): this;
  sendFile(data?: any): this;
  render(template: string, data: object): this;
  json(data: any): this;
  set(field: string, value: string): this;
  redirect(url: string): void;
  options(allowedMethods: string[]): this;
  cookie(name: string, value: string, options?: any): void;
  engine(engine: Engine): this;
  templateEngine: Engine | null;
}
