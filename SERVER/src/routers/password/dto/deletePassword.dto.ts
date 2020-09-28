import { IsDefined, ValidateIf } from "class-validator";
import { SnowflakeFactory } from "src/libs/Snowflake";

export abstract class DeletePasswordDTO {
    @IsDefined()
    @ValidateIf(body => SnowflakeFactory.isSnowflake(body.id))
    id: string;
}
