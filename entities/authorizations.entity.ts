import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Authorizations {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public service_id: number;

  @Column()
  public user_id: number;

  @Column()
  public token: string;

  @Column('timestamptz')
  public expierd_at: Date;

  @Column('timestamptz')
  public created_at: Date;
}
