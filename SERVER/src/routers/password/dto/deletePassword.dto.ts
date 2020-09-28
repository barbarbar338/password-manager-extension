import { IsDefined } from "class-validator";

export abstract class DeletePasswordDTO {
    
    @IsDefined()
    id: string;

}
