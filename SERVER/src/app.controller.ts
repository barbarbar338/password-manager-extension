import { Controller, Get } from "@nestjs/common";
import { APIRes } from "api-types";

@Controller()
export class AppController {
    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }
}
