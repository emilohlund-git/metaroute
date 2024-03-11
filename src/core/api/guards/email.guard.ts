import { ResponseEntity } from "../entities/response.entity";
import { createInterceptor } from "../../common/functions/create-interceptor.function";
import { Guard } from "../types";

export const VerifiedEmailGuard: Guard = () => {
  return createInterceptor(
    async (target, propertyKey, descriptor, req: any, res) => {
      if (!req.user?.verified) {
        return ResponseEntity.forbidden();
      }
    }
  );
};
