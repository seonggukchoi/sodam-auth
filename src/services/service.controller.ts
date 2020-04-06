import { Controller, HttpException, HttpStatus, Inject, UseGuards, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MasterGuard } from '../shared/guards/master.guard';
import { ServiceService } from './service.service';
import { ServiceEntity } from '../../entities';

@Controller({ path: 'services' })
@UseGuards(MasterGuard)
export class ServiceController {
  constructor(
    @Inject(ServiceService) private readonly serviceService: ServiceService,
  ) { }

  @Get('/')
  public async getServices(): Promise<ServiceEntity[]> {
    let serviceEntities: ServiceEntity[] | null = null;

    try {
      serviceEntities = await this.serviceService.fetchServices();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return serviceEntities;
  }

  @Get('/:serviceId')
  public async getService(
    @Param('serviceId') serviceId: number,
  ): Promise<ServiceEntity> {
    let serviceEntity: ServiceEntity | null = null;

    try {
      serviceEntity = await this.serviceService.fetchService(serviceId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return serviceEntity;
  }

  @Post('/')
  public async insertService(
    @Body() serviceInput: Pick<ServiceEntity, 'name' | 'masterToken'>,
  ): Promise<ServiceEntity> {
    let serviceEntity: ServiceEntity | null = null;

    try {
      // TODO Add validator
      serviceEntity = await this.serviceService.insertService(serviceInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return serviceEntity;
  }

  @Put('/:serviceId')
  public async updateService(
    @Param('serviceId') serviceId: number,
    @Body() serviceInput: Pick<ServiceEntity, 'name' | 'masterToken'>,
  ): Promise<ServiceEntity> {
    let serviceEntity: ServiceEntity | null = null;

    try {
      // TODO Add validator
      serviceEntity = await this.serviceService.updateService(serviceId, serviceInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return serviceEntity;
  }

  @Delete('/truncate')
  @UseGuards(MasterGuard)
  public async truncateUsers() {
    try {
      await this.serviceService.truncateServices();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }

  @Delete('/:serviceId')
  public async deleteService(
    @Param('serviceId') serviceId: number,
  ): Promise<ServiceEntity> {
    let serviceEntity: ServiceEntity | null = null;

    try {
      serviceEntity = await this.serviceService.deleteService(serviceId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return serviceEntity;
  }
}
