import { DATABASE_COLUMN_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { ColumnDecoratorInterface } from "../../common/interfaces/column-decorator-properties.interface";

export function Column(options?: {
  defaultValue?: any;
  unique?: boolean;
}): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const type = Reflect.getMetadata("design:type", target, propertyKey);

    let properties: ColumnDecoratorInterface[] = Reflect.getMetadata(
      DATABASE_COLUMN_METADATA_KEY,
      target
    );
    if (properties) {
      properties.push({
        key: propertyKey as string,
        type: type.name.toLowerCase(),
        isPrimary: false,
        isUnique: options?.unique || false,
      });
    } else {
      properties = [
        {
          key: propertyKey as string,
          type: type.name.toLowerCase(),
          isPrimary: false,
          isUnique: options?.unique || false,
        },
      ];
    }

    Reflect.defineMetadata(DATABASE_COLUMN_METADATA_KEY, properties, target);

    if (!target[propertyKey]) {
      target[propertyKey] = options?.defaultValue;
    }
  };
}
