import {
    Injectable,
    CanActivate,
    ExecutionContext,
    BadRequestException,
    UnauthorizedException
} from "@nestjs/common";
import * as Jwt from "jsonwebtoken";
import config from "src/config";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const req = ctx.switchToHttp().getRequest();
        const token: string = req.headers["authorization"] || req.headers["x-access-token"];
        if (!token) throw new BadRequestException("invalid access token");
        await Jwt.verify(token, config.SECRET, async (err, decoded: { mail: string; id: string; }) => {
            if (err) throw new BadRequestException("invalid access token");
            const isExist = await this.authService.isExists(decoded.id);
            if (!isExist) throw new UnauthorizedException("user not found");
            req.user = decoded;
            return true;
        });
        return true;
    }
}
