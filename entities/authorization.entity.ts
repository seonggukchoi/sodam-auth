import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('authorizations')
export class AuthorizationEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int', { name: 'service_id' })
  public serviceId: number;

  @Column('int', { name: 'user_id' })
  public userId: number;

  @Column('varchar', { length: 512 })
  public token: string;

  @Column('varchar', { name: 'client_hash', length: 128, nullable: true })
  public clientHash?: string;

  @Column('timestamp', { name: 'expired_at' })
  public expiredAt: Date;

  @Column('timestamp', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;
}
