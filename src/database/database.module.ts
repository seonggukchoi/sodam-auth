import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import entities from '../../entities';

// Unfreeze object for TypeORM
const databaseConfig = <TypeOrmModuleOptions>{
  ...config.get<TypeOrmModuleOptions>('database'),
  entities,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature(entities),
  ],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [],
})
export class DatabaseModule { }
