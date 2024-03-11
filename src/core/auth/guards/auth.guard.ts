import { createInterceptor } from "../../common/functions/create-interceptor.function";
import { JwtService } from "../services/jwt.service";
import { Guard } from "../../api/types";
import { ResponseEntity } from "../../api/entities/response.entity";

export const Auth: Guard = () => {
  return createInterceptor(
    async (target, propertyKey, descriptor, req, res) => {
      if (!req) return ResponseEntity.unauthorized();
      const token = JwtService.extractToken(req.headers.authorization);
      if (!token) {
        return ResponseEntity.unauthorized();
      }

      try {
        const user = await JwtService.verifyTokenAsync(
          token,
          process.env.JWT_SECRET!
        );
        req.user = user;
      } catch (err: any) {
        if (err.name === "TokenExpiredError") {
          return ResponseEntity.unauthorized();
        } else {
          return ResponseEntity.forbidden();
        }
      }
    }
  );
};
