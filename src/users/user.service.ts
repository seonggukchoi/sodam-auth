import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities';
import { UserSourceType } from '../../types/users';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
  ) { }

  public async fetchUsers(): Promise<UserEntity[]> {
    const userEntities = await this.usersRepository.find({
      select: [
        'id',
        'email',
        'name',
        'lastAuthenticatedAt',
        'createdAt',
        'updatedAt',
        'lastUpdatedBy',
      ],
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!userEntities) {
      throw new Error('Cannot find users');
    }

    return userEntities;
  }

  public async fetchUser(userId: number): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOne({
      select: [
        'id',
        'email',
        'name',
        'lastAuthenticatedAt',
        'createdAt',
        'updatedAt',
        'lastUpdatedBy',
      ],
      where: { id: userId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!userEntity) {
      throw new Error('Cannot find user');
    }

    return userEntity;
  }

  public async insertUser(userInput: UserEntity): Promise<UserEntity> {
    const userEntity = this.usersRepository.create();

    userEntity.serviceId = userInput.serviceId;
    userEntity.source = userInput.source;
    userEntity.email = userInput.email;
    userEntity.password = userInput.password;
    userEntity.name = userInput.name;

    return this.usersRepository.save(userEntity);
  }

  public async updateUser(userId: number, userInput: UserEntity): Promise<UserEntity> {
    const existUserEntity = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'lastAuthenticatedAt'],
      where: { email: userInput.email, source: userInput.source },
    });

    if (existUserEntity) {
      throw new Error('Email exists already');
    }

    const userEntity = await this.fetchUser(userId);

    userEntity.email = userInput.email;
    userEntity.password = userInput.password;
    userEntity.name = userInput.name;

    userEntity.updatedAt = new Date();

    return this.usersRepository.save(userEntity);
  }

  public async deleteUser(userId: number): Promise<UserEntity> {
    const userEntity = await this.fetchUser(userId);

    const currentTime = new Date();

    userEntity.deletedAt = currentTime;
    userEntity.updatedAt = currentTime;

    return this.usersRepository.save(userEntity);
  }

  public async authenticateUser(serviceId: number, email: string, password: string, source: UserSourceType): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'lastAuthenticatedAt'],
      where: { serviceId, email, source },
    });

    if (!userEntity) {
      throw new Error('Cannot find user by email');
    }

    const isValidEmail = !!userEntity;
    const isValidPassword = password === userEntity.password;

    if (!isValidEmail || !isValidPassword) {
      throw new Error('Not valid login information');
    }

    userEntity.lastAuthenticatedAt = new Date();

    return await this.usersRepository.save(userEntity);
  }

  public async truncateUsers(): Promise<boolean> {
    return this.usersRepository.query('TRUNCATE TABLE users;');
  }
}
