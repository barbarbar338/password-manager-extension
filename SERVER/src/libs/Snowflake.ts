const EPOCH = 1598918400000;
let INCREMENT = 0;

export class SnowflakeFactory {
    static binaryToID(num: string): string {
        let dec = "";
        while (num.length > 50) {
            const high = parseInt(num.slice(0, -32), 2);
            const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);
            dec = (low % 10).toString() + dec;
            num =
                Math.floor(high / 10).toString(2) +
                Math.floor(low / 10)
                    .toString(2)
                    .padStart(32, "0");
        }
        let parsed = parseInt(num, 2);
        while (parsed > 0) {
            dec = (parsed % 10).toString() + dec;
            parsed = Math.floor(parsed / 10);
        }
        return dec;
    }

    static idToBinary(num: string): string {
        let bin = "";
        let high = parseInt(num.slice(0, -10)) || 0;
        let low = parseInt(num.slice(-10));
        while (low > 0 || high > 0) {
            bin = String(low & 1) + bin;
            low = Math.floor(low / 2);
            if (high > 0) {
                low += 5000000000 * (high % 2);
                high = Math.floor(high / 2);
            }
        }
        return bin;
    }

    static generate(): string {
        const timestamp = Date.now();
        if (INCREMENT >= 4095) INCREMENT = 0;
        const BINARY = `${(timestamp - EPOCH)
            .toString(2)
            .padStart(42, "0")}0000100000${(INCREMENT++)
            .toString(2)
            .padStart(12, "0")}`;
        return this.binaryToID(BINARY);
    }

    static deconstruct(
        snowflake: string,
    ): {
        timestamp: number;
        workerID: number;
        processID: number;
        increment: number;
        binary: string;
    } {
        const BINARY = this.idToBinary(snowflake).padStart(64, "0");
        const timestamp = parseInt(BINARY.substring(0, 42), 2) + EPOCH;
        const res = {
            timestamp,
            workerID: parseInt(BINARY.substring(42, 47), 2),
            processID: parseInt(BINARY.substring(47, 52), 2),
            increment: parseInt(BINARY.substring(52, 64), 2),
            binary: BINARY,
        };
        return res;
    }

    static isSnowflake(snowflake: string): boolean {
        const deconstructed = this.deconstruct(snowflake);
        const timestamp = deconstructed.timestamp;
        if (timestamp > EPOCH && timestamp <= 3619093655551) return true;
        return false;
    }
}
