import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Services {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 50 })
  public name: string;

  @Column('varchar', { length: 128 })
  public master_token: string;

  @Column('timestamptz')
  public created_at: Date;

  @Column('timestamptz')
  public updated_at: Date;

  @Column('timestamptz')
  public deleted_at: Date;
}
