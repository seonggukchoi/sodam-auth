import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../../entities';

@Injectable()
export class UserService {
  @InjectRepository(UsersEntity) private readonly usersRepository: Repository<UsersEntity>;

  public async fetchUsers(): Promise<UsersEntity[]> {
    const usersEntities = await this.usersRepository.find({
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

    if (!usersEntities) {
      throw new Error('Cannot find users');
    }

    return usersEntities;
  }

  public async fetchUser(userId: number): Promise<UsersEntity> {
    const usersEntity = await this.usersRepository.findOne({
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

    if (!usersEntity) {
      throw new Error('Cannot find user');
    }

    return usersEntity;
  }

  public async insertUser(userInput: UsersEntity): Promise<UsersEntity> {
    const usersEntity = this.usersRepository.create();

    usersEntity.service_id = userInput.service_id;
    usersEntity.locale = userInput.locale;
    usersEntity.email = userInput.email;
    usersEntity.password = userInput.password;
    usersEntity.first_name = userInput.first_name;
    usersEntity.last_name = userInput.last_name;

    return this.usersRepository.save(usersEntity);
  }

  public async updateUser(userId: number, userInput: UsersEntity): Promise<UsersEntity> {
    const usersEntity = await this.fetchUser(userId);

    usersEntity.locale = userInput.locale;
    usersEntity.email = userInput.email;
    usersEntity.password = userInput.password;
    usersEntity.first_name = userInput.first_name;
    usersEntity.last_name = userInput.last_name;

    usersEntity.updated_at = new Date();

    return this.usersRepository.save(usersEntity);
  }

  public async deleteUser(userId: number): Promise<UsersEntity> {
    const usersEntity = await this.fetchUser(userId);

    const currentTime = new Date();

    usersEntity.deleted_at = currentTime;
    usersEntity.updated_at = currentTime;

    return this.usersRepository.save(usersEntity);
  }

  public async authenticateUser(serviceId: number, email: string, password: string): Promise<UsersEntity> {
    const usersEntity = await this.fetchUserByServiceAndEmail(serviceId, email);

    if (password !== usersEntity.password) {
      throw new Error('Not matched password');
    }

    usersEntity.last_authenticated_at = new Date();

    return await this.usersRepository.save(usersEntity);
  }

  private async fetchUserByServiceAndEmail(serviceId: number, email: string): Promise<UsersEntity> {
    const usersEntity = await this.usersRepository.findOne({
      select: ['id', 'email', 'password', 'last_authenticated_at'],
      where: { service_id: serviceId, email },
    });

    if (!usersEntity) {
      throw new Error('Cannot find user by email');
    }

    return usersEntity;
  }
}
