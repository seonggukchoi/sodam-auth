import { Module, Global } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import * as Entities from './entities';

const entities = Object.values(Entities);
const databaseConfig = <TypeOrmModuleOptions>{
  ...config.get<TypeOrmModuleOptions>('database'),
  entities,
};

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(databaseConfig), TypeOrmModule.forFeature(entities)],
  exports: [TypeOrmModule],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
