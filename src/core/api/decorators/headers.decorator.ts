import { HEADERS_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function Headers(key?: string): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) {
      throw new Error("Headers decorator must be used in a method");
    }
    const existingHeadersParameters: { [key: string]: number | null } =
      Reflect.getMetadata(HEADERS_METADATA_KEY, target, propertyKey) || {};
    existingHeadersParameters[key || "all"] = parameterIndex;
    Reflect.defineMetadata(
      HEADERS_METADATA_KEY,
      existingHeadersParameters,
      target,
      propertyKey
    );
  };
}
