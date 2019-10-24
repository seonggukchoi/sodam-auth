import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationsEntity } from '../../entities';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthorizationService {
  @InjectRepository(AuthorizationsEntity) private readonly authorizationsRepository: Repository<AuthorizationsEntity>;

  constructor(
    private readonly userService: UserService,
  ) { }

  public async login(email: string, password: string): Promise<boolean> {
    return this.userService.authenticateUser(email, password);
  }
}
