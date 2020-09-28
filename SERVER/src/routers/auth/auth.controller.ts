import { Controller, Get, Post, Body, UseGuards, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { APIRes } from "api-types";
import { LoginSignupDTO } from "./dto/login-signup.dto";
import { AuthGuard } from "./auth.guard";
import { User } from "./user.decorator";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get("ping")
    returnPing(): APIRes {
        return this.authService.replyPing();
    }

    @Post("signup")
    async signup(@Body() body: LoginSignupDTO): Promise<APIRes> {
        return await this.authService.signup(body);
    }

    @Post("login")
    async login(@Body() body: LoginSignupDTO): Promise<APIRes> {
        return await this.authService.login(body);
    }

    @Delete()
    @UseGuards(AuthGuard)
    async deleteAccount(
        @User() user: { mail: string; id: string },
    ): Promise<APIRes> {
        return await this.authService.delete(user.id);
    }
}
