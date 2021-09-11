import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserWithdrawals extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;

  @Column()
  amount_withdrawn: number;

  @Column()
  transaction_date: Date;

  @Column()
  currency: string;

  @Column()
  transfer_status: string;

  @ManyToOne(() => User, (user) => user.withdrawals)
  user: User;
}
