import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities';

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
        'first_name',
        'last_name',
        'last_authenticated_at',
        'created_at',
        'updated_at',
        'last_updated_by',
      ],
      where: { deleted_at: null },
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
        'first_name',
        'last_name',
        'last_authenticated_at',
        'created_at',
        'updated_at',
        'last_updated_by',
      ],
      where: { id: userId, deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!userEntity) {
      throw new Error('Cannot find user');
    }

    return userEntity;
  }

  public async insertUser(userInput: UserEntity): Promise<UserEntity> {
    const userEntity = this.usersRepository.create();

    userEntity.service_id = userInput.service_id;
    userEntity.locale = userInput.locale;
    userEntity.email = userInput.email;
    userEntity.password = userInput.password;
    userEntity.first_name = userInput.first_name;
    userEntity.last_name = userInput.last_name;

    return this.usersRepository.save(userEntity);
  }

  public async updateUser(userId: number, userInput: UserEntity): Promise<UserEntity> {
    const userEntity = await this.fetchUser(userId);

    userEntity.locale = userInput.locale;
    userEntity.email = userInput.email;
    userEntity.password = userInput.password;
    userEntity.first_name = userInput.first_name;
    userEntity.last_name = userInput.last_name;

    userEntity.updated_at = new Date();

    return this.usersRepository.save(userEntity);
  }

  public async deleteUser(userId: number): Promise<UserEntity> {
    const userEntity = await this.fetchUser(userId);

    const currentTime = new Date();

    userEntity.deleted_at = currentTime;
    userEntity.updated_at = currentTime;

    return this.usersRepository.save(userEntity);
  }

  public async authenticateUser(serviceId: number, email: string, password: string): Promise<UserEntity> {
    const userEntity = await this.fetchUserByServiceAndEmail(serviceId, email);

    const isValidEmail = !!userEntity;
    const isValidPassword = password === userEntity.password;

    if (!isValidEmail || !isValidPassword) {
      throw new Error('Not valid login information');
    }

    userEntity.last_authenticated_at = new Date();

    return await this.usersRepository.save(userEntity);
  }

  private async fetchUserByServiceAndEmail(serviceId: number, email: string): Promise<UserEntity> {
    const userEntity = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'last_authenticated_at'],
      where: { service_id: serviceId, email },
    });

    if (!userEntity) {
      throw new Error('Cannot find user by email');
    }

    return userEntity;
  }
}
