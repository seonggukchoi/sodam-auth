import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { AuthorizationsEntity } from '../../entities';
import { UserService } from '../users/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AuthorizationsEntity) private readonly authorizationsRepository: Repository<AuthorizationsEntity>,
    @Inject(UserService) private readonly userService: UserService,
  ) { }

  public async login(serviceId: number, email: string, password: string): Promise<AuthorizationsEntity> {
    const usersEntity = await this.userService.authenticateUser(serviceId, email, password);

    if (!usersEntity) {
      throw new Error('Cannot authenticate user');
    }

    const userId = usersEntity.id;
    const token = this.signToken(serviceId, userId, email);

    return this.insertAuthorization(serviceId, userId, token);
  }

  public async checkPermissionByToken(token: string): Promise<boolean> {
    const tokenPayload = <ITokenPayload>jwt.decode(token);
    const authorizationsEntity = await this.fetchAuthorizationByToken(token);

    const authorizationsExpiredAt = moment(authorizationsEntity.expierd_at).startOf('second').utc();
    const tokenExpiredAt = moment(tokenPayload.exp * 1000).utc();
    const isSameExpiredAt = authorizationsExpiredAt.isSame(tokenExpiredAt);

    if (!isSameExpiredAt) {
      throw new Error('Not valid expired at');
    }

    const isValidService = tokenPayload.serviceId === authorizationsEntity.service_id;

    if (!isValidService) {
      throw new Error('Not valid service');
    }

    const isValidUser = tokenPayload.userId === authorizationsEntity.user_id;

    if (!isValidUser) {
      throw new Error('Cannot validate user');
    }

    const isExpired = moment(authorizationsEntity.expierd_at).utc().isBefore(moment().utc());

    if (isExpired) {
      throw new Error('Token is expired');
    }

    return !!authorizationsEntity;
  }

  public async fetchAuthorizationByToken(token: string): Promise<AuthorizationsEntity> {
    const authorizationsEntity = await this.authorizationsRepository.findOne({
      select: ['id', 'service_id', 'user_id', 'expierd_at'],
      where: { token },
      order: { id: 'DESC' },
    });

    if (!authorizationsEntity) {
      throw new Error('Cannot find authorization');
    }

    return authorizationsEntity;
  }

  public async insertAuthorization(serviceId: number, userId: number, token: string): Promise<AuthorizationsEntity> {
    const usersEntity = this.authorizationsRepository.create();

    const expiresInComponent = this.getExpiresInComponent();
    const expiresInAmount = <moment.DurationInputArg1>expiresInComponent.expiresInAmount;
    const expiresInUnit = <moment.DurationInputArg2>expiresInComponent.expiresInUnit;
    const expiredAt = moment().utc().add(expiresInAmount, expiresInUnit).toDate();

    usersEntity.service_id = serviceId;
    usersEntity.user_id = userId;
    usersEntity.token = token;
    usersEntity.expierd_at = expiredAt;

    return this.authorizationsRepository.save(usersEntity);
  }

  private signToken(serviceId: number, userId: number, email: string): string {
    const secretKey = config.get<string>('token.secret_key');
    const expiresIn = this.getExpiresIn();

    const tokenPayload = <ITokenPayload>{ serviceId, userId, email };
    const tokenOptions = <jwt.SignOptions>{ expiresIn };

    return jwt.sign(tokenPayload, secretKey, tokenOptions);
  }

  private getExpiresInComponent(): IExpiresInComponent {
    const expiresInAmount = config.get<number>('token.sign_options.expires_in_amount');
    const expiresInUnit = config.get<string>('token.sign_options.expires_in_unit');

    return { expiresInAmount, expiresInUnit };
  }

  private getExpiresIn(): string {
    const expiresInAmount = config.get<number>('token.sign_options.expires_in_amount');
    const expiresInUnit = config.get<string>('token.sign_options.expires_in_unit');

    return `${ expiresInAmount } ${ expiresInUnit }`;
  }
}

interface ITokenPayload {
  serviceId: number;
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

interface IExpiresInComponent {
  expiresInAmount: number;
  expiresInUnit: string;
}
