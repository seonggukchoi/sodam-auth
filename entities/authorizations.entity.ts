import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';

@Entity('authorizations')
export class AuthorizationsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public service_id: number;

  @Column('int')
  public user_id: number;

  @Column('varchar', { length: 255 })
  public token: string;

  @Column('timestamptz')
  public expierd_at: Date;

  @Column('timestamptz', { default: 'NOW()' })
  public created_at: Date;
}
