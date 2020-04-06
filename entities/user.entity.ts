import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserSourceType, UserSources } from '../types/users';

@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int', { name: 'service_id' })
  public serviceId: number;

  @Column('varchar', { length: 20 })
  public name: string;

  @Column('enum', { enum: UserSources, default: 'direct' })
  public source: UserSourceType;

  @Column('varchar', { length: 256 })
  public email: string;

  @Column('varchar', { length: 256 })
  public password: string;

  @Column('timestamp', { name: 'last_authenticated_at', nullable: true })
  public lastAuthenticatedAt?: Date | null;

  @Column('timestamp', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  public deletedAt?: Date | null;

  @Column('varchar', { name: 'last_updated_by', length: 200, nullable: true })
  public lastUpdatedBy?: string | null;
}
