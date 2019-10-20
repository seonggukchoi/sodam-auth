import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationsEntity } from '../../entities';

@Injectable()
export class AuthorizationService {
  constructor(
    @InjectRepository(AuthorizationsEntity) private readonly authorizations: Repository<AuthorizationsEntity>,
  ) { }

  public getConnection(): Repository<AuthorizationsEntity> {
    return this.authorizations;
  }

  public async getAuthorizationById(id: number, select?: Array<(keyof AuthorizationsEntity)>): Promise<AuthorizationsEntity> {
    if (!select) {
      select = [
        'id',
        'service_id',
        'user_id',
        'token',
        'expierd_at',
        'created_at',
      ];
    }

    const authorization = await this.authorizations.findOne({
      select,
      where: { id },
    });

    if (!authorization) {
      throw new Error('not found authorization');
    }

    return authorization;
  }

  public async getAuthorizationsByIds(ids: number | number[], select?: Array<(keyof AuthorizationsEntity)>): Promise<AuthorizationsEntity[]> {
    ids = Array.isArray(ids) ? ids : [ids];

    if (!select) {
      select = [
        'id',
        'service_id',
        'user_id',
        'token',
        'expierd_at',
        'created_at',
      ];
    }

    const authorizations = await this.authorizations.find({
      select,
      where: { id: ids },
    });

    if (!authorizations) {
      throw new Error('not found authorizations');
    }

    return authorizations;
  }
}
