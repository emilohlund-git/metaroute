import { ON_MESSAGE_METADATA_KEY } from "../../../common/constants/metadata-keys.constants";

export function OnMessage(event: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata(ON_MESSAGE_METADATA_KEY, event, descriptor.value);
  };
}
