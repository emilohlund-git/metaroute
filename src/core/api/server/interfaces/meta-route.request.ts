import { IncomingMessage } from "http";

export interface MetaRouteRequest extends IncomingMessage {
  body: any;
  params: { [key: string]: string };
  query: { [key: string]: string | string[] | undefined };
  url: string;
  cookies: { [key: string]: string };
  ip: string | undefined;
  protocol: string;
  session: any;
  parseCookies: (cookieHeader: string | undefined) => { [key: string]: string };
  setHeader: (key: string, value: string) => void;
  user?: any;
}
