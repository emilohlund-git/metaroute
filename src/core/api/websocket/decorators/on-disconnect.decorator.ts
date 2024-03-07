import { ON_DISCONNECT_METADATA_KEY } from "../../../common/constants/metadata-keys.constants";

export function OnDisconnect(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(
      ON_DISCONNECT_METADATA_KEY,
      descriptor.value,
      descriptor.value
    );
  };
}
