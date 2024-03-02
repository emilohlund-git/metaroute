import { DATABASE_COLUMN_METADATA_KEY } from "../../common/constants/metadata-keys.constants";
import { ColumnDecoratorInterface } from "../../common/interfaces/column-decorator-properties.interface";

export function PrimaryColumn(
  defaultValue: any = undefined
): PropertyDecorator {
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
        isPrimary: true,
        isUnique: true,
      });
    } else {
      properties = [
        {
          key: propertyKey as string,
          type: type.name.toLowerCase(),
          isPrimary: true,
          isUnique: true,
        },
      ];
    }

    Reflect.defineMetadata(DATABASE_COLUMN_METADATA_KEY, properties, target);

    if (!target[propertyKey]) {
      target[propertyKey] = defaultValue;
    }
  };
}
