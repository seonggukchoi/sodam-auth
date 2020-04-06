import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LocaleType, localeTypes } from '../types/global';
import { UserSourceType, userSourceTypes } from '../types/users';


@Entity('users')
export class UserEntity {

  @PrimaryGeneratedColumn()
  public id: number;

  @Column('int')
  public service_id: number;

  @Column('varchar', { length: 20 })
  public first_name: string;

  @Column('varchar', { length: 20 })
  public last_name: string;

  @Column('enum', { enum: localeTypes })
  public locale: LocaleType;

  @Column('enum', { enum: userSourceTypes, default: 'direct' })
  public source: UserSourceType;

  @Column('varchar', { length: 256 })
  public email: string;

  @Column('varchar', { length: 256 })
  public password: string;

  @Column('timestamp', { nullable: true })
  public last_authenticated_at?: Date | null;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updated_at: Date;

  @Column('timestamp', { nullable: true })
  public deleted_at?: Date | null;

  @Column('varchar', { length: 200, nullable: true })
  public last_updated_by?: string | null;
}
