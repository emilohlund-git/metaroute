import { createDecorator } from "../../common/functions/create-decorator.function";
import { CheckFunction, GuardFunction } from "../../api/types";

export function createInterceptor(check: CheckFunction): GuardFunction {
  return createDecorator(async function (
    this: any,
    req,
    res,
    originalMethod,
    args
  ) {
    const result = await check(req, res);
    if (result) {
      return result;
    }
    return originalMethod?.apply(this, args);
  });
}
