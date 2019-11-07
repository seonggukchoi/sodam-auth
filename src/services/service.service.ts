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
      select: ['id', 'name', 'master_token', 'created_at', 'updated_at'],
      where: { deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntities) {
      throw new Error('Cannot find services');
    }

    return serviceEntities;
  }

  public async fetchService(serviceId: number): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'name', 'master_token', 'created_at', 'updated_at'],
      where: { id: serviceId, deleted_at: null },
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
      select: ['id', 'name', 'master_token', 'updated_at'],
      where: { id: serviceId, deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Cannot find service');
    }

    if (serviceInput.name) { serviceEntity.name = serviceInput.name; }
    if (serviceInput.master_token) { serviceEntity.master_token = serviceInput.master_token; }
    serviceEntity.updated_at = new Date();

    return this.servicesRepository.save(serviceEntity);
  }

  public async deleteService(serviceId: number): Promise<ServiceEntity> {
    const serviceEntity = await this.servicesRepository.findOne({
      select: ['id', 'updated_at', 'deleted_at'],
      where: { id: serviceId, deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!serviceEntity) {
      throw new Error('Cannot find service');
    }

    const currentTime = new Date();

    serviceEntity.updated_at = currentTime;
    serviceEntity.deleted_at = currentTime;

    return this.servicesRepository.save(serviceEntity);
  }

  public async truncateServices(): Promise<boolean> {
    return this.servicesRepository.query('TRUNCATE TABLE services RESTART IDENTITY CASCADE;');
  }
}
