import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '@/modules/database/entities';

import { UserSourceType } from './user.interface';

@Injectable()
export class UserProvider {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) { }

  public async fetchUsers(): Promise<UserEntity[]> {
    const userEntities = await this.usersRepository.find({
      select: [
        'id',
        'email',
        'name',
        'source',
        'lastAuthenticatedAt',
        'createdAt',
        'updatedAt',
        'lastUpdatedBy',
      ],
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!userEntities) {
      throw new Error('Not found users.');
    }

    return userEntities;
  }

  public async fetchUser(userId: number): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOne({
      select: [
        'id',
        'email',
        'name',
        'source',
        'lastAuthenticatedAt',
        'createdAt',
        'updatedAt',
        'lastUpdatedBy',
      ],
      where: { id: userId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!userEntity) {
      throw new Error('Not found user.');
    }

    return userEntity;
  }

  public async insertUser(userInput: Pick<UserEntity, 'serviceId' | 'source' | 'email' | 'password' | 'name'>): Promise<UserEntity> {
    const userEntity = this.usersRepository.create();

    userEntity.serviceId = userInput.serviceId;
    userEntity.source = userInput.source;
    userEntity.email = userInput.email;
    userEntity.password = userInput.password;
    userEntity.name = userInput.name;

    return this.usersRepository.save(userEntity);
  }

  public async updateUser(userId: number, userInput: Pick<UserEntity, 'email' | 'password' | 'source' | 'name'>): Promise<UserEntity> {
    const existUserEntity = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'name'],
      where: { email: userInput.email, source: userInput.source },
    });

    if (existUserEntity) {
      throw new Error('Email exists already.');
    }

    const userEntity = await this.fetchUser(userId);

    userEntity.email = userInput.email;
    userEntity.password = userInput.password;
    userEntity.name = userInput.name;

    return this.usersRepository.save(userEntity);
  }

  public async deleteUser(userId: number): Promise<UserEntity> {
    const userEntity = await this.fetchUser(userId);

    userEntity.deletedAt = new Date();

    return this.usersRepository.save(userEntity);
  }

  public async authenticateUser(serviceId: number, email: string, password: string, source: UserSourceType): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'lastAuthenticatedAt'],
      where: { serviceId, email, source },
    });

    if (!userEntity) {
      throw new Error('Not found user by email.');
    }

    const isValidEmail = !!userEntity;
    const isValidPassword = password === userEntity.password;

    if (!isValidEmail || !isValidPassword) {
      throw new Error('Invalid user information.');
    }

    userEntity.lastAuthenticatedAt = new Date();

    return await this.usersRepository.save(userEntity);
  }

  public async truncateUsers(): Promise<boolean> {
    await this.usersRepository.query('TRUNCATE TABLE users;');

    return true;
  }
}
