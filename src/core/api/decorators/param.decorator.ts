import { PARAM_METADATA_KEY } from "../../common/constants";

export function Param(
  key?: string,
  pipe?: new () => { transform: (value: any) => any }
): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) {
      throw new Error("Param decorator must be used in a method");
    }
    const existingParamParameters: {
      [key: string]: {
        index: number | null;
        pipe?: new () => { transform: (value: any) => any };
      };
    } = Reflect.getMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};
    existingParamParameters[key || "all"] = { index: parameterIndex, pipe };
    Reflect.defineMetadata(
      PARAM_METADATA_KEY,
      existingParamParameters,
      target,
      propertyKey
    );
  };
}
