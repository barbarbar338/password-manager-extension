import * as crypto from "crypto";
import config from "src/config";

export class Crypto {
    static encrypt(password: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(
            "aes-256-ctr",
            Buffer.concat([Buffer.from(config.SECRET), Buffer.alloc(32)], 32),
            iv,
        );
        let encrypted = cipher.update(password);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString("hex") + ":" + encrypted.toString("hex");
    }

    static decrypt(hash: string): string {
        const textParts = hash.split(":");
        const iv = Buffer.from(textParts.shift() as string, "hex");
        const encryptedText = Buffer.from(textParts.join(":"), "hex");
        const decipher = crypto.createDecipheriv(
            "aes-256-ctr",
            Buffer.concat([Buffer.from(config.SECRET), Buffer.alloc(32)], 32),
            iv,
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
