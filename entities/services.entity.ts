import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('services')
export class ServicesEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 50 })
  public name: string;

  @Column('varchar', { length: 128 })
  public master_token: string;

  @Column('timestamptz', { default: 'NOW()' })
  public created_at: Date;

  @Column('timestamptz', { default: 'NOW()', onUpdate: 'NOW()' })
  public updated_at: Date;

  @Column('timestamptz', { nullable: true })
  public deleted_at?: Date | null;

  @Column('varchar', { length: 200, nullable: true })
  public last_updated_by?: string | null;
}
