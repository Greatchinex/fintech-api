import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity()
export class UserTransfers extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount_sent: number;

  @ManyToOne(() => User, (user) => user.id)
  sender: User;

  @ManyToOne(() => User, (user) => user.received_transfers)
  receiver: User;
}
