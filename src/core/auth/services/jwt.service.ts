import crypto from "crypto";
import { JwtPayloadUser } from "../types";
import { InvalidTokenFormatException } from "../exceptions/invalid-token-format.exception";
import { TokenExpiredException } from "../exceptions/token-expired.exception";
import { InvalidSignatureException } from "../exceptions/invalid-signature.exception";

export class JwtService {
  public static signTokenAsync = (
    payload: any,
    secret: string,
    expiresIn: string
  ): Promise<string | undefined> =>
    new Promise((resolve, reject) => {
      const now = Math.floor(Date.now() / 1000);
      const exp = now + this.parseExpiresIn(expiresIn);

      payload.exp = exp;

      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" }))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const payload64 = Buffer.from(JSON.stringify(payload))
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const signature = crypto
        .createHmac("sha256", secret)
        .update(`${header}.${payload64}`)
        .digest()
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      resolve(`${header}.${payload64}.${signature}`);
    });

  public static verifyTokenAsync = (
    token: string,
    secret: string
  ): Promise<JwtPayloadUser> =>
    new Promise((resolve, reject) => {
      const parts = token.split(".");
      if (parts.length !== 3) {
        reject(new InvalidTokenFormatException("Invalid token format"));
        return;
      }

      const [header64, payload64, signature] = parts;
      let payload;
      try {
        payload = JSON.parse(Buffer.from(payload64, "base64").toString("utf8"));
      } catch (err) {
        reject(new InvalidTokenFormatException("Invalid token format"));
        return;
      }

      const now = Math.floor(Date.now() / 1000);
      if (now > payload.exp) {
        reject(new TokenExpiredException("Token has expired"));
        return;
      }

      const verifiedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${header64}.${payload64}`)
        .digest()
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      if (verifiedSignature === signature) {
        resolve(payload);
      } else {
        reject(new InvalidSignatureException("Invalid signature"));
      }
    });

  public static extractToken = (header: string | undefined) => {
    if (!header) {
      return null;
    }

    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    const token = parts[1];
    return token;
  };

  private static parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.charAt(expiresIn.length - 1);
    const amount = parseInt(expiresIn.slice(0, -1));

    switch (unit) {
      case "s":
        return amount;
      case "m":
        return amount * 60;
      case "h":
        return amount * 60 * 60;
      case "d":
        return amount * 60 * 60 * 24;
      default:
        throw new InvalidTokenFormatException("Invalid expiresIn format");
    }
  }
}
