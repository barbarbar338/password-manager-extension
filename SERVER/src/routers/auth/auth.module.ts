import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { PasswordModule } from "src/routers/password/password.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => PasswordModule)
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [TypeOrmModule, AuthService],
})
export class AuthModule {}
