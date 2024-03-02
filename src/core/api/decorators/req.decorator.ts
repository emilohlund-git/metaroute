import { REQ_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function Req(): ParameterDecorator {
  return (
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
  ) => {
    if (!propertyKey) {
      throw new Error("Req decorator must be used in a method");
    }
    Reflect.defineMetadata(
      REQ_METADATA_KEY,
      parameterIndex,
      target,
      propertyKey
    );
  };
}
