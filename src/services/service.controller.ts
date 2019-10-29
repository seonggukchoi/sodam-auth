import { Controller, HttpException, HttpStatus, Inject, UseGuards, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MasterGuard } from '../shared/guards';
import { ServiceService } from './service.service';
import { ServicesEntity } from '../../entities';

@Controller({
  path: 'services',
})
@UseGuards(MasterGuard)
export class ServiceController {
  constructor(
    @Inject(ServiceService) private readonly serviceService: ServiceService,
  ) { }

  @Get('/')
  public async getServices(): Promise<ServicesEntity[]> {
    let servicesEntities: ServicesEntity[] | null = null;

    try {
      servicesEntities = await this.serviceService.fetchServices();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return servicesEntities;
  }

  @Get('/:serviceId')
  public async getService(
    @Param('serviceId') serviceId: number,
  ): Promise<ServicesEntity> {
    let servicesEntity: ServicesEntity | null = null;

    try {
      servicesEntity = await this.serviceService.fetchService(serviceId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return servicesEntity;
  }

  @Post('/')
  public async insertService(
    @Body() serviceInput: ServicesEntity,
  ): Promise<ServicesEntity> {
    let servicesEntity: ServicesEntity | null = null;

    try {
      servicesEntity = await this.serviceService.insertService(serviceInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return servicesEntity;
  }

  @Put('/:serviceId')
  public async updateService(
    @Param('serviceId') serviceId: number,
    @Body() serviceInput: ServicesEntity,
  ): Promise<ServicesEntity> {
    let servicesEntity: ServicesEntity | null = null;

    try {
      servicesEntity = await this.serviceService.updateService(serviceId, serviceInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return servicesEntity;
  }

  @Delete('/:serviceId')
  public async deleteService(
    @Param('serviceId') serviceId: number,
  ): Promise<ServicesEntity> {
    let servicesEntity: ServicesEntity | null = null;

    try {
      servicesEntity = await this.serviceService.deleteService(serviceId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return servicesEntity;
  }
}
