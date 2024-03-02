import { Column } from "@core/database/decorators/column.decorator";
import { DatabaseEntity } from "@core/database/decorators/database-entity.decorator";
import { NullableColumn } from "@core/database/decorators/nullable-column.decorator";
import { PrimaryColumn } from "@core/database/decorators/primary-column.decorator";
import { IsDate } from "@core/validation/decorators/date.validation";
import { IsEmail } from "@core/validation/decorators/email.validation";
import { IsEnum } from "@core/validation/decorators/enum.validation";
import { IsNumber } from "@core/validation/decorators/number.validation";
import { IsString } from "@core/validation/decorators/string.validation";

export enum InvoiceStatus {
  PAID,
  PENDING,
  DUE,
}

@DatabaseEntity()
export class Invoice {
  @IsNumber()
  @PrimaryColumn()
  public id: number;

  @IsNumber()
  @Column()
  public userId: number;

  @IsString()
  @Column()
  public clientName: string;

  @IsEmail()
  @Column()
  public clientEmail: string;

  @IsDate()
  @Column()
  public dueDate: Date;

  @IsEnum(InvoiceStatus)
  @Column()
  public status: InvoiceStatus;

  @IsString()
  @NullableColumn()
  public notes: string | null;
}
