import * as dotenv from "dotenv";
dotenv.config();

export default {
    API_VERSION: "/v1",
    PORT: (process.env.PORT as unknown) as number,
    MONGODB_URI: process.env.MONGODB_URI as string,
    SECRET: process.env.SECRET as string,
};
