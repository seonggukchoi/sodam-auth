import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../../entities';

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
      throw new Error('Cannot find services');
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
      throw new Error('Cannot find service');
    }

    return serviceEntity;
  }

  public async insertService(serviceInput: ServiceEntity): Promise<ServiceEntity> {
    this.servicesRepository.create(serviceInput);

    return this.servicesRepository.save(serviceInput);
  }

  public async updateService(serviceId: number, serviceInput: ServiceEntity): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'name', 'masterToken', 'updatedAt'],
      where: { id: serviceId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Cannot find service');
    }

    if (serviceInput.name) { serviceEntity.name = serviceInput.name; }
    if (serviceInput.masterToken) { serviceEntity.masterToken = serviceInput.masterToken; }
    serviceEntity.updatedAt = new Date();

    return this.servicesRepository.save(serviceEntity);
  }

  public async deleteService(serviceId: number): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'updatedAt', 'deletedAt'],
      where: { id: serviceId, deletedAt: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Cannot find service');
    }

    const currentTime = new Date();

    serviceEntity.updatedAt = currentTime;
    serviceEntity.deletedAt = currentTime;

    return this.servicesRepository.save(serviceEntity);
  }

  public async truncateServices(): Promise<boolean> {
    return this.servicesRepository.query('TRUNCATE TABLE services;');
  }
}
