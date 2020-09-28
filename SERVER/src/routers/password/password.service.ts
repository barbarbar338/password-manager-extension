import { Injectable, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { APIRes } from "api-types";
import { CreatePasswordDTO } from "./dto/createPassword.dto";
import { PasswordEntity } from "./password.entity";
import { MongoRepository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { DeletePasswordDTO } from "./dto/deletePassword.dto";
import { UpdatePasswordDTO } from "./dto/updatePassword.dto";
import { Crypto } from "src/libs/Crypto";
import { SnowflakeFactory } from "src/libs/Snowflake";

@Injectable()
export class PasswordService {
    constructor(
        @InjectRepository(PasswordEntity)
        private readonly passwordRepository: MongoRepository<PasswordEntity>
    ) {}

    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    async createPassword({ service, password, login }: CreatePasswordDTO, user: { id: string; mail: string; }): Promise<APIRes> {
        const id = SnowflakeFactory.generate();
        const passwordData = this.passwordRepository.create({
            service,
            password: Crypto.encrypt(password),
            login,
            id,
            owner: user.id
        });
        await this.passwordRepository.save(passwordData);
        return {
            message: "Password created",
            service,
            login,
            password,
            id
        }
    }

    async isExists(id: string, owner: string): Promise<boolean> {
        const exists = await this.passwordRepository.findOne({ id, owner });
        return !!exists;
    }

    async deletePassword({ id }: DeletePasswordDTO, user: { id: string; mail: string; }): Promise<APIRes> {
        const isExists = await this.isExists(id, user.id);
        if (!isExists) throw new NotFoundException("Password not found");
        await this.passwordRepository.deleteMany({ id });
        return { 
            message: "Password deleted"
        }
    }

    async patchPassword({ id, login, password }: UpdatePasswordDTO, user: { id: string; mail: string; }): Promise<APIRes> {
        const isExists = await this.isExists(id, user.id);
        if (!isExists) throw new NotFoundException("Password not found");
        if (!login && !password) throw new NotAcceptableException("login or password must be specified");
        const payload = {};
        if (login) payload["login"] = login;
        if (password) payload["password"] = Crypto.encrypt(password);
        await this.passwordRepository.updateOne({ id, owner: user.id }, payload);
        return {
            message: "password data updated",
            id,
            ...payload
        }

    }

    async getAllPasswords(user: { mail: string; id: string; }): Promise<APIRes> {
        const data = await this.passwordRepository.find({ owner: user.id});
        const payload = data.map(entity => {
            return {
                id: entity.id,
                owner: entity.owner,
                service: entity.service,
                login: entity.login,
                password: Crypto.decrypt(entity.password),
                createdAt: entity.createdAt,
                updatedAt: entity.updateAt
            }
        })

        return {
            message: "get all passwords",
            passwords: payload
        }
    }
    
}
