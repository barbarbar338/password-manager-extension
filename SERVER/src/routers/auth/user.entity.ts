import {
    Entity,
    ObjectIdColumn,
    ObjectID,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity({ name: "UserEntity" })
export class UserEntity {
    @ObjectIdColumn()
    _id: ObjectID;

    @Column({ nullable: false, unique: true })
    id: string;

    @Column({ nullable: false, unique: true })
    mail: string;

    @Column({ nullable: false })
    password: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: number;

    @UpdateDateColumn({ type: "timestamp" })
    updateAt: number;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
