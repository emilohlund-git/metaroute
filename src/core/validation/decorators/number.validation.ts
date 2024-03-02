import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function IsNumber(
  defaultValue: number | undefined = undefined
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    let properties: { key: string; type: string }[] = Reflect.getMetadata(
      VALIDATION_METADATA_KEY,
      target
    );
    if (properties) {
      properties.push({ key: propertyKey as string, type: "number" });
    } else {
      properties = [{ key: propertyKey as string, type: "number" }];
    }
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, properties, target);

    if (!target[propertyKey]) {
      target[propertyKey] = defaultValue;
    }
  };
}
