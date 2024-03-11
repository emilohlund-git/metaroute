import { RES_METADATA_KEY } from "../../common/constants";

export function Res(): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) {
      throw new Error("Res decorator must be used in a method");
    }
    Reflect.defineMetadata(
      RES_METADATA_KEY,
      parameterIndex,
      target,
      propertyKey
    );
  };
}
