import { Length, IsEmail } from "class-validator";

export abstract class LoginSignupDTO {
    @IsEmail()
    mail: string;

    @Length(8, 32)
    password: string;
}
