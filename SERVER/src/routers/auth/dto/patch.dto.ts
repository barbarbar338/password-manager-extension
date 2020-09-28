import { IsOptional, Length, IsEmail } from "class-validator";

export abstract class PatchDTO {
    @IsOptional()
    @IsEmail()
    mail?: string;

    @IsOptional()
    @Length(8, 32)
    password: string;
}
