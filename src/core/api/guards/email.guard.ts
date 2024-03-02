import { ResponseEntity } from "../entities/response.entity";
import { createInterceptor } from "../../common/functions/create-interceptor.function";
import { Guard } from "../types";

export const VerifiedEmailGuard: Guard = () => {
  return createInterceptor(async (target, propertyKey, req: any, res) => {
    if (!req.user || !req.user.verified) {
      return ResponseEntity.forbidden();
    }
  });
};
