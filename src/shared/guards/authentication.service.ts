import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';
import { AuthorizationEntity } from '../../../entities';
import { UserSourceType } from '../../../types/users';
import { UserService } from './user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AuthorizationEntity) private readonly authorizationsRepository: Repository<AuthorizationEntity>,
    @Inject(UserService) private readonly userService: UserService,
  ) { }

  public async login(serviceId: number, email: string, password: string, source: UserSourceType, clientHash: string): Promise<AuthorizationEntity> {
    const userEntity = await this.userService.authenticateUser(serviceId, email, password, source);

    if (!userEntity) {
      throw new Error('Cannot authenticate user');
    }

    const userId = userEntity.id;
    const token = this.signToken(serviceId, userId, email, clientHash);

    await this.expireAuthorizations(serviceId, userId, clientHash);

    return this.insertAuthorization(serviceId, userId, token, clientHash);
  }

  public async checkPermission(token: string, clientHash?: string): Promise<boolean> {
    const tokenPayload = <ITokenPayload>jwt.decode(token);
    const authorizationEntity = await this.fetchAuthorization(token, clientHash);

    const authorizationsExpiredAt = moment(authorizationEntity.expierd_at).startOf('second').utc();
    const tokenExpiredAt = moment(tokenPayload.exp * 1000).utc();
    const isSameExpiredAt = authorizationsExpiredAt.isSame(tokenExpiredAt);

    if (!isSameExpiredAt) {
      throw new Error('Not valid expired at');
    }

    const isValidService = tokenPayload.serviceId === authorizationEntity.service_id;

    if (!isValidService) {
      throw new Error('Not valid service');
    }

    const isValidUser = tokenPayload.userId === authorizationEntity.user_id;

    if (!isValidUser) {
      throw new Error('Not valid user');
    }

    const isExpired = moment(authorizationEntity.expierd_at).utc().isBefore(moment().utc());

    if (isExpired) {
      throw new Error('Token is expired');
    }

    return !!authorizationEntity;
  }

  public async fetchAuthorization(token: string, clientHash?: string): Promise<AuthorizationEntity> {
    const authorizationEntity = await this.authorizationsRepository.findOne({
      select: ['id', 'service_id', 'user_id', 'client_hash', 'expierd_at'],
      where: { token, client_hash: clientHash },
      order: { id: 'DESC' },
    });

    if (!authorizationEntity) {
      throw new Error('Cannot find authorization');
    }

    return authorizationEntity;
  }

  public async expireAuthorizations(serviceId: number, userId: number, clientHash: string): Promise<boolean> {
    const authorizationEntities = await this.authorizationsRepository.find({
      select: ['id'],
      where: { service_id: serviceId, user_id: userId, client_hash: clientHash },
      order: { id: 'DESC' },
    });

    if (!authorizationEntities) {
      throw new Error('Cannot find authorizations');
    }

    const authorizationIds = authorizationEntities.map(authorizationEntity => authorizationEntity.id);

    if (authorizationIds && authorizationIds.length > 0) {
      await this.authorizationsRepository.update(authorizationIds, { expierd_at: new Date() });
    }

    return true;
  }

  public async insertAuthorization(serviceId: number, userId: number, token: string, clientHash: string): Promise<AuthorizationEntity> {
    const userEntity = this.authorizationsRepository.create();

    const expiresInComponent = this.getExpiresInComponent();
    const expiresInAmount = <moment.DurationInputArg1>expiresInComponent.expiresInAmount;
    const expiresInUnit = <moment.DurationInputArg2>expiresInComponent.expiresInUnit;
    const expiredAt = moment().utc().add(expiresInAmount, expiresInUnit).toDate();

    userEntity.service_id = serviceId;
    userEntity.user_id = userId;
    userEntity.token = token;
    userEntity.client_hash = clientHash;
    userEntity.expierd_at = expiredAt;

    return this.authorizationsRepository.save(userEntity);
  }

  private signToken(serviceId: number, userId: number, email: string, clientHash: string): string {
    const secretKey = config.get<string>('secret_key');
    const expiresIn = this.getExpiresIn();

    const tokenPayload = <ITokenPayload>{ serviceId, userId, email, clientHash };
    const tokenOptions = <jwt.SignOptions>{ expiresIn };

    return jwt.sign(tokenPayload, secretKey, tokenOptions);
  }

  private getExpiresInComponent(): IExpiresInComponent {
    const expiresInAmount = config.get<number>('authentication.sign_options.expires_in_amount');
    const expiresInUnit = config.get<string>('authentication.sign_options.expires_in_unit');

    return { expiresInAmount, expiresInUnit };
  }

  private getExpiresIn(): string {
    const expiresInAmount = config.get<number>('authentication.sign_options.expires_in_amount');
    const expiresInUnit = config.get<string>('authentication.sign_options.expires_in_unit');

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
