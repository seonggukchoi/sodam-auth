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
      where: { id: serviceId, deleted_at: null },
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
      where: { service_id: serviceId, deleted_at: null },
    });

    if (!servicesEntity) {
      throw new Error(`Cannot find service`);
    }

    if (serviceInput.name) { servicesEntity.name = serviceInput.name; }
    if (serviceInput.master_token) { servicesEntity.master_token = serviceInput.master_token; }

    return this.servicesRepository.save(servicesEntity);
  }

  public async deleteService(serviceId: number): Promise<ServicesEntity> {
    const servicesEntity = await this.servicesRepository.findOne({
      where: { id: serviceId, deleted_at: null },
    });

    if (!servicesEntity) {
      throw new Error(`Cannot find service`);
    }

    servicesEntity.deleted_at = new Date();

    return this.servicesRepository.save(servicesEntity);
  }
}
