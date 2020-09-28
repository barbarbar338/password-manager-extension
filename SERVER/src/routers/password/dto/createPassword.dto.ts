import { IsDefined } from "class-validator";

export abstract class CreatePasswordDTO {
    
    @IsDefined()
    service: string;

    @IsDefined()
    login: string;

    @IsDefined()
    password: string;

}
