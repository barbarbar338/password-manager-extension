import {
    Injectable,
    ConflictException,
    BadRequestException,
} from "@nestjs/common";
import { MongoRepository } from "typeorm";
import { APIRes } from "api-types";
import * as Jwt from "jsonwebtoken";
import config from "src/config";
import { LoginSignupDTO } from "./dto/login-signup.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { PasswordEntity } from "src/routers/password/password.entity"
import { Crypto } from "src/libs/Crypto";
import { SnowflakeFactory } from "src/libs/Snowflake";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: MongoRepository<UserEntity>,
        @InjectRepository(PasswordEntity)
        private readonly passwordRepository: MongoRepository<PasswordEntity>,
    ) {}

    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    async signup({ mail, password }: LoginSignupDTO): Promise<APIRes> {
        const isUnique = await this.isUnique(mail);
        if (!isUnique)
            throw new ConflictException("This mail is already registered");
        const id = SnowflakeFactory.generate();
        const user = await this.userRepository.create({
            mail,
            password: Crypto.encrypt(password),
            id
        });
        await this.userRepository.save(user);
        const { access_token, expiresIn } = this.generateToken({
            id,
            mail,
        });
        return {
            access_token,
            expiresIn,
            message: "Successfully created",
        };
    }

    async login({ mail, password }: LoginSignupDTO): Promise<APIRes> {
        const { access_token, expiresIn } = await this.getToken({
            password,
            mail,
        });
        return {
            access_token,
            expiresIn,
            message: "Successfully logged in",
        };
    }

    async isUnique(mail: string): Promise<boolean> {
        const matchUsers = await this.userRepository.find({ mail });
        return matchUsers.length == 0;
    }

    async isExists(id: string): Promise<boolean> {
        const user = await this.userRepository.findOne({ id });
        return !!user;
    }

    generateToken(
        payload: { id: string; mail: string },
        expiresIn: number = 30 * 24 * 60 * 60 * 1000,
    ): { access_token: string; expiresIn: number } {
        const access_token = Jwt.sign(payload, config.SECRET, {
            algorithm: "HS512",
            expiresIn,
        });
        return {
            access_token,
            expiresIn,
        };
    }

    async getUser({ mail, password }: LoginSignupDTO): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ mail });
        if (!user || Crypto.decrypt(user.password) != password)
            throw new BadRequestException("Invalid mail or password");
        return user;
    }

    async getToken({
        mail,
        password,
    }: LoginSignupDTO): Promise<{ access_token: string; expiresIn: number }> {
        const user = await this.getUser({ mail, password });
        const { access_token, expiresIn } = this.generateToken({
            id: user.id,
            mail,
        });
        return { access_token, expiresIn };
    }

    async delete(id: string): Promise<APIRes> {
        await this.userRepository.findOneAndDelete({ id });
        await this.passwordRepository.deleteMany({ owner: id });
        return { message: "Account deleted" };
    }
}
