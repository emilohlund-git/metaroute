import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function IsUsername(
  defaultValue: string | undefined = undefined
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    let properties: { key: string; type: string }[] = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      target
    );
    if (properties) {
      properties.push({ key: propertyKey as string, type: "username" });
    } else {
      properties = [{ key: propertyKey as string, type: "username" }];
    }
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, properties, target);

    if (!target[propertyKey]) {
      target[propertyKey] = defaultValue;
    }
  };
}
