import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({
  name: 'applications',
})
export class ApplicationEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({
    type: 'varchar',
    length: 50,
  })
  public name: string;

  @Column({
    name: 'token_ttl',
    type: 'varchar',
    length: 10,
  })
  public tokenTTL: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  public createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  public updatedAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  public deletedAt?: Date | null;
}
