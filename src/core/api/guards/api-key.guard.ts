import { createInterceptor } from "../../common/functions/create-interceptor.function";
import { ResponseEntity } from "../entities/response.entity";
import { Guard } from "../types";

export const ApiKey: Guard = () => {
  return createInterceptor(async (req, res) => {
    const apiKey = req?.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_KEY) {
      return ResponseEntity.unauthorized();
    }
  });
};
