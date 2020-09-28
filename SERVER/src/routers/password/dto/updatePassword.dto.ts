import { IsDefined, IsOptional, ValidateIf } from "class-validator";
import { SnowflakeFactory } from "src/libs/Snowflake";

export abstract class UpdatePasswordDTO {
    @IsDefined()
    @ValidateIf(body => SnowflakeFactory.isSnowflake(body.id))
    id: string;

    @IsOptional()
    login?: string;

    @IsOptional()
    password?: string;
}
