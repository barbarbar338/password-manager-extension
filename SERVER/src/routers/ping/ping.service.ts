import { Injectable } from "@nestjs/common";
import { APIRes } from "api-types";

@Injectable()
export class PingService {
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }
}
