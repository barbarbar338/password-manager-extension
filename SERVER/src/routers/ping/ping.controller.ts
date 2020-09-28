import { Controller, Get } from "@nestjs/common";
import { PingService } from "./ping.service";
import { APIRes } from "api-types";

@Controller("ping")
export class PingController {
    constructor(private readonly pingService: PingService) {}

    @Get()
    returnPing(): APIRes {
        return this.pingService.replyPing();
    }
}
