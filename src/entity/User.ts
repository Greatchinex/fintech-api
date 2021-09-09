import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { Exclude, classToPlain } from "class-transformer";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", unique: true, default: uuidv4() })
  uuid: string;

  @Column({ type: "varchar" })
  full_name: string;

  @Column({ type: "text", unique: true })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: "text" })
  password: string;

  @Column({ type: "text", nullable: true })
  account_number: string;

  @Column({ type: "boolean", default: false })
  acct_num_verified: boolean;

  @Column({ type: "text", nullable: true })
  bank_code: string;

  @Column({ type: "int", default: 0 })
  wallet_balance: number;

  toJSON() {
    return classToPlain(this);
  }
}
