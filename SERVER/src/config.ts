import * as dotenv from "dotenv";
dotenv.config();

export default {
    API_VERSION: "/v1",
    PORT: ((process.env.PORT as unknown) as number) || 3000,
    MONGODB_URI: process.env.MONGODB_URI as string,
    SECRET: "123123sdfsdf",
};
