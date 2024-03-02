import { QUERY_METADATA_KEY } from "@core/common/constants/metadata-keys.constants";

export function Query(
  key?: string,
  pipe?: new () => { transform: (value: any) => any }
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) {
      throw new Error("Query decorator must be used in a method");
    }
    const existingQueryParameters: {
      [key: string]: {
        index: number | null;
        pipe?: new () => { transform: (value: any) => any };
      };
    } = Reflect.getMetadata(QUERY_METADATA_KEY, target, propertyKey) || {};
    existingQueryParameters[key || "all"] = { index: parameterIndex, pipe };
    Reflect.defineMetadata(
      QUERY_METADATA_KEY,
      existingQueryParameters,
      target,
      propertyKey
    );
  };
}
