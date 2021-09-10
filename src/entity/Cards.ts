import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne
} from "typeorm";
import { Exclude, classToPlain } from "class-transformer";
import { User } from "./User";

@Entity()
export class Card extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude({ toPlainOnly: true })
  @Column()
  authorization_code: string;

  @Column()
  card_type: string;

  @Column()
  last4: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  exp_month: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  exp_year: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  bin: string;

  @Column()
  bank: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  channel: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  signature: string;

  @Column()
  reusable: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  country_code: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  account_name: string;

  @ManyToOne(() => User, (user) => user.cards, { onDelete: "CASCADE" })
  user: User;

  toJSON() {
    return classToPlain(this);
  }
}
