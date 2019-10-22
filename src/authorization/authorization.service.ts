import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationsEntity } from '../../entities';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthorizationService {
  @Inject(UserService) private readonly userService: UserService;

  constructor(
    @InjectRepository(AuthorizationsEntity) private readonly authorizationsRepository: Repository<AuthorizationsEntity>,
  ) { }

  public async login(email: string, password: string): Promise<boolean> {
    return this.userService.authenticateUser(email, password);
  }
}
