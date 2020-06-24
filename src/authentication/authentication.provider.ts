import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ObjectLiteral } from 'typeorm';
import * as config from 'config';
import * as jwt from 'jsonwebtoken';
import * as moment from 'moment';

import { AuthorizationEntity } from '@/modules/database/entities';

import { UserSourceType } from '@/user/user.interface';
import { UserProvider } from '@/user/user.provider';

@Injectable()
export class AuthenticationProvider {
  constructor(
    @InjectRepository(AuthorizationEntity)
    private readonly authorizationsRepository: Repository<AuthorizationEntity>,
    @Inject(UserProvider) private readonly userService: UserProvider,
  ) {}

  public async login(
    applicationId: number,
    email: string,
    password: string,
    source: UserSourceType,
    clientHash: string,
  ): Promise<AuthorizationEntity> {
    const userEntity = await this.userService.authenticateUser(
      applicationId,
      email,
      password,
      source,
    );

    if (!userEntity) {
      throw new Error('Invalid user information.');
    }

    const userId = userEntity.id;
    const token = this.signToken(applicationId, userId, email, clientHash);

    await this.expireAuthorizations(applicationId, userId, clientHash);

    return this.insertAuthorization(applicationId, userId, token, clientHash);
  }

  public async checkPermission(
    token: string,
    clientHash?: string,
  ): Promise<boolean> {
    const tokenPayload = <ITokenPayload>jwt.decode(token);
    const authorizationEntity = await this.fetchAuthorization(
      token,
      clientHash,
    );

    const authorizationsExpiredAt = moment(authorizationEntity.expiredAt)
      .startOf('second')
      .utc();
    const tokenExpiredAt = moment(tokenPayload.exp * 1000).utc();

    const isSameExpiredAt =
      authorizationsExpiredAt.diff(tokenExpiredAt, 'second') < 3;
    const isValidApplication =
      tokenPayload.applicationId === authorizationEntity.applicationId;
    const isValidUser = tokenPayload.userId === authorizationEntity.userId;
    const isValidToken = isSameExpiredAt && isValidApplication && isValidUser;

    if (!isValidToken) {
      throw new Error('Invalid token.');
    }

    const isExpired = moment(authorizationEntity.expiredAt)
      .utc()
      .isBefore(moment().utc());

    if (isExpired) {
      throw new Error('Token is expired.');
    }

    return !!authorizationEntity;
  }

  public async fetchAuthorization(
    token: string,
    clientHash?: string,
  ): Promise<AuthorizationEntity> {
    let where: ObjectLiteral = { token };

    if (clientHash) {
      where = { ...where, clientHash };
    }

    const authorizationEntity = await this.authorizationsRepository.findOne({
      select: ['id', 'applicationId', 'userId', 'clientHash', 'expiredAt'],
      where,
      order: { id: 'DESC' },
    });

    if (!authorizationEntity) {
      throw new Error('Not found authorization.');
    }

    return authorizationEntity;
  }

  public async expireAuthorizations(
    applicationId: number,
    userId: number,
    clientHash: string,
  ): Promise<boolean> {
    const authorizationEntities = await this.authorizationsRepository.find({
      select: ['id'],
      where: { applicationId, userId, clientHash },
      order: { id: 'DESC' },
    });

    if (!authorizationEntities) {
      throw new Error('Not found authorizations.');
    }

    const authorizationIds = authorizationEntities.map(
      authorizationEntity => authorizationEntity.id,
    );

    if (authorizationIds && authorizationIds.length > 0) {
      await this.authorizationsRepository.update(authorizationIds, {
        expiredAt: new Date(),
      });
    }

    return true;
  }

  public async insertAuthorization(
    applicationId: number,
    userId: number,
    token: string,
    clientHash: string,
  ): Promise<AuthorizationEntity> {
    const expiresInComponent = this.getExpiresInComponent();
    const expiresInAmount = <moment.DurationInputArg1>(
      expiresInComponent.expiresInAmount
    );
    const expiresInUnit = <moment.DurationInputArg2>(
      expiresInComponent.expiresInUnit
    );
    const expiredAt = moment()
      .utc()
      .add(expiresInAmount, expiresInUnit)
      .toDate();

    const userEntity = this.authorizationsRepository.create();

    userEntity.applicationId = applicationId;
    userEntity.userId = userId;
    userEntity.token = token;
    userEntity.clientHash = clientHash;
    userEntity.expiredAt = expiredAt;

    return this.authorizationsRepository.save(userEntity);
  }

  public async truncateAuthorizations(): Promise<boolean> {
    await this.authorizationsRepository.query('TRUNCATE TABLE authorizations;');

    return true;
  }

  private signToken(
    applicationId: number,
    userId: number,
    email: string,
    clientHash: string,
  ): string {
    const secretKey = config.get<string>('authentication.secret_key');
    const expiresIn = this.getExpiresIn();

    const tokenPayload = <ITokenPayload>{
      applicationId,
      userId,
      email,
      clientHash,
    };
    const tokenOptions = <jwt.SignOptions>{ expiresIn };

    return jwt.sign(tokenPayload, secretKey, tokenOptions);
  }

  private getExpiresInComponent(): IExpiresInComponent {
    const expiresInAmount = config.get<number>(
      'authentication.sign_options.expires_in_amount',
    );
    const expiresInUnit = config.get<string>(
      'authentication.sign_options.expires_in_unit',
    );

    return { expiresInAmount, expiresInUnit };
  }

  private getExpiresIn(): string {
    const expiresInAmount = config.get<number>(
      'authentication.sign_options.expires_in_amount',
    );
    const expiresInUnit = config.get<string>(
      'authentication.sign_options.expires_in_unit',
    );

    return `${expiresInAmount} ${expiresInUnit}`;
  }
}

interface ITokenPayload {
  applicationId: number;
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

interface IExpiresInComponent {
  expiresInAmount: number;
  expiresInUnit: string;
}
