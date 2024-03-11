import { ResponseEntity } from "../entities/response.entity";
import { createInterceptor } from "../../common/functions/create-interceptor.function";
import { Guard } from "../types";

export const VerifiedEmailGuard: Guard = () => {
  return createInterceptor(async (req, res) => {
    if (!req.user?.verified) {
      return ResponseEntity.forbidden();
    }
  });
};
