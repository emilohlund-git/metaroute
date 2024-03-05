import { ResponseEntity } from "../../api/entities/response.entity";
import { createInterceptor } from "../../common/functions/create-interceptor.function";
import { validator } from "../functions/validator";
import { Guard } from "../../api/types";

export const Validate: Guard = (schema: new () => any) => {
  return createInterceptor(async (target, propertyKey, req, res) => {
    let errors: Record<string, string[]> = {};

    if (req !== undefined) {
      errors = validator(req!.body, schema);
    }

    if (Object.keys(errors).length > 0) {
      return ResponseEntity.badRequest(errors);
    }
  });
};
