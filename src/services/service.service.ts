import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { isString } from 'util';
import { ServiceEntity } from '../modules/database/entities';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity) private readonly servicesRepository: Repository<ServiceEntity>,
  ) { }

  public async fetchServices(): Promise<ServiceEntity[]> {
    const serviceEntities = await this.servicesRepository.find({
      select: ['id', 'name', 'masterToken', 'createdAt', 'updatedAt'],
      where: { deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntities) {
      throw new Error('Not found services.');
    }

    return serviceEntities;
  }

  public async fetchService(serviceId: number): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'name', 'masterToken', 'createdAt', 'updatedAt'],
      where: { id: serviceId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Not found service.');
    }

    return serviceEntity;
  }

  public async insertService(serviceInput: Pick<ServiceEntity, 'name' | 'masterToken'>): Promise<ServiceEntity> {
    const serviceEntity = this.servicesRepository.create();

    serviceEntity.name = serviceInput.name;
    serviceEntity.masterToken = serviceInput.masterToken;

    return this.servicesRepository.save(serviceEntity);
  }

  public async updateService(serviceId: number, serviceInput: Pick<ServiceEntity, 'name' | 'masterToken'>): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'name', 'masterToken'],
      where: { id: serviceId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Not found service.');
    }

    if (isString(serviceInput.name)) { serviceEntity.name = serviceInput.name; }
    if (isString(serviceInput.masterToken)) { serviceEntity.masterToken = serviceInput.masterToken; }

    return this.servicesRepository.save(serviceEntity);
  }

  public async deleteService(serviceId: number): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'updatedAt', 'deletedAt'],
      where: { id: serviceId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Not found service.');
    }

    serviceEntity.deletedAt = new Date();

    return this.servicesRepository.save(serviceEntity);
  }

  public async truncateServices(): Promise<boolean> {
    await this.servicesRepository.query('TRUNCATE TABLE services;');

    return true;
  }
}
