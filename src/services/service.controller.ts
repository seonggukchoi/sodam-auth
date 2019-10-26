import { Controller, Inject, UseGuards, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
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
    return this.serviceService.fetchServices();
  }

  @Get('/:serviceId')
  public async getService(
    @Param('serviceId') serviceId: number,
  ): Promise<ServicesEntity> {
    return this.serviceService.fetchService(serviceId);
  }

  @Post('/')
  public async insertService(
    @Body() body: ServicesEntity,
  ): Promise<ServicesEntity> {
    return this.serviceService.insertService(body);
  }

  @Put('/:serviceId')
  public async updateService(
    @Param('serviceId') serviceId: number,
    @Body() serviceInput: ServicesEntity,
  ): Promise<ServicesEntity> {
    return this.serviceService.updateService(serviceId, serviceInput);
  }

  @Delete('/:serviceId')
  public async deleteService(
    @Param('serviceId') serviceId: number,
  ): Promise<ServicesEntity> {
    return this.serviceService.deleteService(serviceId);
  }
}
