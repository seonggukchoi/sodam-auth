import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 50 })
  public name: string;

  @Column('varchar', { length: 128 })
  public master_token: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  public created_at: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updated_at: Date;

  @Column('timestamp', { nullable: true })
  public deleted_at?: Date | null;

  @Column('varchar', { length: 200, nullable: true })
  public last_updated_by?: string | null;
}
