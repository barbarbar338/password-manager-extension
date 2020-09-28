import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { RateLimiterModule, RateLimiterGuard } from "nestjs-rate-limit";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/routers/auth/auth.module";
import { PasswordModule } from "src/routers/password/password.module";
import config from "./config";

@Module({
    imports: [
        RateLimiterModule.forRoot({
            points: 100,
            duration: 5,
            keyPrefix: "global",
        }),
        TypeOrmModule.forRoot({
            type: "mongodb",
            url: config.MONGODB_URI,
            database: "PWDMAN",
            synchronize: true,
            logger: "debug",
            useUnifiedTopology: true,
            useNewUrlParser: true,
            autoLoadEntities: true,
        }),
        AuthModule,
        PasswordModule,
    ],
    controllers: [AppController],
    providers: [{ provide: APP_GUARD, useClass: RateLimiterGuard }],
})
export class AppModule {}
