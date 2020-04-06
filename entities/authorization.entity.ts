import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';

@Entity('authorizations')
export class AuthorizationEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public service_id: number;

  @Column('int')
  public user_id: number;

  @Column('varchar', { length: 512 })
  public token: string;

  @Column('varchar', { length: 128, nullable: true })
  public client_hash?: string;

  @Column('timestamp')
  public expierd_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;
}
