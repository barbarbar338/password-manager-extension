import { IsDefined, IsOptional } from "class-validator";

export abstract class UpdatePasswordDTO {
    @IsDefined()
    id: string;

    @IsOptional()
    login?: string;

    @IsOptional()
    password?: string;
}
