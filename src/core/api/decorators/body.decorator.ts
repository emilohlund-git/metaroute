import { BODY_METADATA_KEY } from "../..";

  export function Body(): ParameterDecorator {
    return (
      target: Object,
      propertyKey: string | symbol | undefined,
      parameterIndex: number
    ) => {
      if (!propertyKey) {
        throw new Error("Body decorator must be used in a method");
      }
      const existingParameters: any[] =
        Reflect.getOwnMetadata(BODY_METADATA_KEY, target, propertyKey) || [];
      const parameterTypes: any[] = Reflect.getMetadata(
        "design:paramtypes",
        target,
        propertyKey
      );
      existingParameters[parameterIndex] = parameterTypes[parameterIndex];
      Reflect.defineMetadata(
        BODY_METADATA_KEY,
        {
          types: existingParameters,
          parameterIndex
        },
        target,
        propertyKey
      );
    };
  }
