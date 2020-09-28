import { Module, forwardRef } from "@nestjs/common";
import { PasswordController } from "./password.controller";
import { PasswordService } from "./password.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PasswordEntity } from "./password.entity";
import { AuthModule } from "src/routers/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([PasswordEntity]), 
        forwardRef(() => AuthModule)
    ],
    controllers: [PasswordController],
    providers: [PasswordService],
    exports: [TypeOrmModule, PasswordService]
})
export class PasswordModule {}
