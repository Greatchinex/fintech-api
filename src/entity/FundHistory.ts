import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm";
import { User } from "./User";

@Entity()
export class FundHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reference: string;

  @Column()
  amount_funded: number;

  @Column()
  transaction_date: Date;

  @Column()
  currency: string;

  @Column()
  channel: string;

  @Column({ nullable: true })
  card_type: string;

  @ManyToOne(() => User, (user) => user.funds_history, { onDelete: "SET NULL" })
  user: User;
}
