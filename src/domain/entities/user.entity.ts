import { Column } from "@core/database/decorators/column.decorator";
import { DatabaseEntity } from "@core/database/decorators/database-entity.decorator";
import { NullableColumn } from "@core/database/decorators/nullable-column.decorator";
import { PrimaryColumn } from "@core/database/decorators/primary-column.decorator";
import { IsBoolean } from "@core/validation/decorators/boolean.validation";
import { IsEmail } from "@core/validation/decorators/email.validation";
import { IsNumber } from "@core/validation/decorators/number.validation";
import { IsPassword } from "@core/validation/decorators/password.validation";
import { IsString } from "@core/validation/decorators/string.validation";
import { IsUsername } from "@core/validation/decorators/username.validation";

@DatabaseEntity()
export class User {
  @IsNumber()
  @PrimaryColumn()
  public id: number;
  @IsUsername()
  @Column({
    unique: true,
  })
  public username: string;
  @IsEmail()
  @Column({
    unique: true,
  })
  public email: string;
  @IsPassword()
  @Column()
  public password: string;
  @IsString()
  @Column()
  public firstName: string;
  @IsString()
  @Column()
  public lastName: string;
  @IsString()
  @Column()
  public phone: string;
  @IsBoolean()
  @Column()
  public verified: boolean;
  @IsString()
  @NullableColumn({
    type: "text",
  })
  public refreshToken: string | null;
}
