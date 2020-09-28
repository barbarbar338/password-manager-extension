import {
    Entity,
    ObjectIdColumn,
    ObjectID,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "PasswordEntity" })
export class PasswordEntity {
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({ nullable: false, unique: true })
    id: string;

    @Column({ nullable: false })
    owner: string;

    @Column({ nullable: false })
    service: string;

    @Column({ nullable: false })
    login: string;

    @Column({ nullable: false })
    password: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: number;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: number;

    constructor(partial: Partial<PasswordEntity>) {
        Object.assign(this, partial);
    }
}
