import { Email } from "../entities/email.entity";
import * as tls from "tls";

export type SmtpHandler = {
  [key: string]: (
    client: tls.TLSSocket,
    email: Email,
    secondaryCode: string
  ) => void;
};
