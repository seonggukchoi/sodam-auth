import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServicesEntity } from '../../entities';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServicesEntity) private readonly servicesRepository: Repository<ServicesEntity>,
  ) { }

  public async getServices(): Promise<ServicesEntity[]> {
    const servicesEntities = await this.servicesRepository.find({
      select: ['id', 'name', 'master_token', 'created_at', 'updated_at'],
      where: { deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!servicesEntities) {
      throw new Error('Cannot find services');
    }

    return servicesEntities;
  }

  public async getService(serviceId: number): Promise<ServicesEntity> {
    const servicesEntity = await this.servicesRepository.findOne({
      select: ['id', 'name', 'master_token', 'created_at', 'updated_at'],
      where: { id: serviceId, deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!servicesEntity) {
      throw new Error('Cannot find service');
    }

    return servicesEntity;
  }

  public async insertService(serviceInput: ServicesEntity): Promise<ServicesEntity> {
    this.servicesRepository.create(serviceInput);

    return this.servicesRepository.save(serviceInput);
  }

  public async updateService(serviceId: number, serviceInput: ServicesEntity): Promise<ServicesEntity> {
    const servicesEntity = await this.servicesRepository.findOne({
      select: ['id', 'name', 'master_token', 'updated_at'],
      where: { id: serviceId, deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!servicesEntity) {
      throw new Error('Cannot find service');
    }

    if (serviceInput.name) { servicesEntity.name = serviceInput.name; }
    if (serviceInput.master_token) { servicesEntity.master_token = serviceInput.master_token; }
    servicesEntity.updated_at = new Date();

    return this.servicesRepository.save(servicesEntity);
  }

  public async deleteService(serviceId: number): Promise<ServicesEntity> {
    const servicesEntity = await this.servicesRepository.findOne({
      select: ['id', 'updated_at', 'deleted_at'],
      where: { id: serviceId, deleted_at: null },
      order: { id: 'ASC' },
    });

    if (!servicesEntity) {
      throw new Error('Cannot find service');
    }

    const currentTime = new Date();

    servicesEntity.updated_at = currentTime;
    servicesEntity.deleted_at = currentTime;

    return this.servicesRepository.save(servicesEntity);
  }
}
