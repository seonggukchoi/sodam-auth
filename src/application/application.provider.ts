import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isString } from 'util';

import { ApplicationEntity } from '@/modules/database/entities';

@Injectable()
export class ApplicationProvider {
  constructor(
    @InjectRepository(ApplicationEntity)
    private readonly applicationRepository: Repository<ApplicationEntity>,
  ) {}

  public async fetchApplications(): Promise<ApplicationEntity[]> {
    const applicationEntities = await this.applicationRepository.find({
      select: ['id', 'name', 'tokenTTL', 'createdAt', 'updatedAt'],
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!applicationEntities) {
      throw new Error('Not found applications.');
    }

    return applicationEntities;
  }

  public async fetchApplication(applicationId: number): Promise<ApplicationEntity> {
    const applicationEntity = await this.applicationRepository.findOne({
      select: ['id', 'name', 'tokenTTL', 'createdAt', 'updatedAt'],
      where: { id: applicationId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!applicationEntity) {
      throw new Error('Not found application.');
    }

    return applicationEntity;
  }

  public async insertApplication(
    applicationInput: Pick<ApplicationEntity, 'name' | 'tokenTTL'>,
  ): Promise<ApplicationEntity> {
    const applicationEntity = this.applicationRepository.create();

    applicationEntity.name = applicationInput.name;
    applicationEntity.tokenTTL = applicationInput.tokenTTL;

    return this.applicationRepository.save(applicationEntity);
  }

  public async updateApplication(
    applicationId: number,
    applicationInput: Pick<ApplicationEntity, 'name' | 'tokenTTL'>,
  ): Promise<ApplicationEntity> {
    const applicationEntity = await this.applicationRepository.findOne({
      select: ['id', 'name', 'tokenTTL'],
      where: { id: applicationId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!applicationEntity) {
      throw new Error('Not found application.');
    }

    if (isString(applicationInput.name)) {
      applicationEntity.name = applicationInput.name;
    }
    if (isString(applicationInput.tokenTTL)) {
      applicationEntity.tokenTTL = applicationInput.tokenTTL;
    }

    return this.applicationRepository.save(applicationEntity);
  }

  public async deleteApplication(applicationId: number): Promise<ApplicationEntity> {
    const applicationEntity = await this.applicationRepository.findOne({
      select: ['id', 'updatedAt', 'deletedAt'],
      where: { id: applicationId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!applicationEntity) {
      throw new Error('Not found application.');
    }

    applicationEntity.deletedAt = new Date();

    return this.applicationRepository.save(applicationEntity);
  }

  public async truncateApplications(): Promise<boolean> {
    await this.applicationRepository.query('TRUNCATE TABLE applications;');

    return true;
  }
}
