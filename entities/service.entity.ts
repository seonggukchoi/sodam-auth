import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 50 })
  public name: string;

  @Column('varchar', { name: 'master_token', length: 128 })
  public masterToken: string;

  @Column('timestamp', { name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt: Date;

  @Column('timestamp', { name: 'updated_at', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt: Date;

  @Column('timestamp', { name: 'deleted_at', nullable: true })
  public deletedAt?: Date | null;

  @Column('varchar', { name: 'last_updated_by', length: 200, nullable: true })
  public lastUpdatedBy?: string | null;
}
