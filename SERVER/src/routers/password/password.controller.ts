import {
    Controller,
    Get,
    UseGuards,
    Post,
    Body,
    Delete,
    Patch,
} from "@nestjs/common";
import { PasswordService } from "./password.service";
import { AuthGuard } from "src/routers/auth/auth.guard";
import { APIRes } from "api-types";
import { CreatePasswordDTO } from "./dto/createPassword.dto";
import { DeletePasswordDTO } from "./dto/deletePassword.dto";
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { User } from "src/routers/auth/user.decorator";

@Controller("password")
export class PasswordController {
    constructor(private readonly passwordService: PasswordService) {}

    @Get("ping")
    returnPing(): APIRes {
        return this.passwordService.replyPing();
    }

    @Get()
    @UseGuards(AuthGuard)
    async getAllPasswords(
        @User() user: { mail: string; id: string },
    ): Promise<APIRes> {
        return this.passwordService.getAllPasswords(user);
    }

    @Post()
    @UseGuards(AuthGuard)
    async postPassword(
        @Body() createPasswordDTO: CreatePasswordDTO,
        @User() user: { mail: string; id: string },
    ): Promise<APIRes> {
        return this.passwordService.createPassword(createPasswordDTO, user);
    }

    @Delete()
    @UseGuards(AuthGuard)
    async deletePassword(
        @Body() deletePasswordDTO: DeletePasswordDTO,
        @User() user: { mail: string; id: string },
    ): Promise<APIRes> {
        return this.passwordService.deletePassword(deletePasswordDTO, user);
    }

    @Patch()
    @UseGuards(AuthGuard)
    async patchPassword(
        @Body() updatePasswordDTO: UpdatePasswordDTO,
        @User() user: { mail: string; id: string },
    ): Promise<APIRes> {
        return this.passwordService.patchPassword(updatePasswordDTO, user);
    }
}
