import { ON_CONNECT_METADATA_KEY } from "../../../common/constants/metadata-keys.constants";

export function OnConnect(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      ON_CONNECT_METADATA_KEY,
      descriptor.value,
      descriptor.value
    );
  };
}
