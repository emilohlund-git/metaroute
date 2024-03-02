import { VALIDATION_METADATA_KEY } from "../../common/constants/metadata-keys.constants";

export function IsEnum(
  enumType: object,
  defaultValue: string | undefined = undefined
): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const enumValues = Object.values(enumType);
    let properties: { key: string; type: string; enumValues: any[] }[] =
      Reflect.getMetadata(VALIDATION_METADATA_KEY, target);
    if (properties) {
      properties.push({ key: propertyKey as string, type: "enum", enumValues });
    } else {
      properties = [{ key: propertyKey as string, type: "enum", enumValues }];
    }
    Reflect.defineMetadata(VALIDATION_METADATA_KEY, properties, target);

    if (!target[propertyKey]) {
      target[propertyKey] = defaultValue;
    }
  };
}
