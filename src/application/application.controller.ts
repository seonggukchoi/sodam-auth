import { Controller, HttpException, HttpStatus, UseGuards, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';

import { MasterGuard } from '@/modules/guards';
import { ApplicationEntity } from '@/modules/database/entities';

import { ApplicationProvider } from './application.provider';

@Controller({ path: '/applications' })
@UseGuards(MasterGuard)
export class ApplicationController {
  constructor(private readonly applicationProvider: ApplicationProvider) {}

  @Get('/')
  public async getApplications(): Promise<ApplicationEntity[]> {
    let applicationEntities: ApplicationEntity[] | null = null;

    try {
      applicationEntities = await this.applicationProvider.fetchApplications();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return applicationEntities;
  }

  @Get('/:applicationId')
  public async getApplication(@Param('applicationId') applicationId: number): Promise<ApplicationEntity> {
    let applicationEntity: ApplicationEntity | null = null;

    try {
      applicationEntity = await this.applicationProvider.fetchApplication(applicationId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return applicationEntity;
  }

  @Post('/')
  public async insertApplication(
    @Body() applicationInput: Pick<ApplicationEntity, 'name' | 'masterToken'>,
  ): Promise<ApplicationEntity> {
    let applicationEntity: ApplicationEntity | null = null;

    try {
      // TODO Add validator
      applicationEntity = await this.applicationProvider.insertApplication(applicationInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return applicationEntity;
  }

  @Put('/:applicationId')
  public async updateApplication(
    @Param('applicationId') applicationId: number,
    @Body() applicationInput: Pick<ApplicationEntity, 'name' | 'masterToken'>,
  ): Promise<ApplicationEntity> {
    let applicationEntity: ApplicationEntity | null = null;

    try {
      // TODO Add validator
      applicationEntity = await this.applicationProvider.updateApplication(applicationId, applicationInput);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return applicationEntity;
  }

  @Delete('/:applicationId')
  public async deleteApplication(@Param('applicationId') applicationId: number): Promise<ApplicationEntity> {
    let applicationEntity: ApplicationEntity | null = null;

    try {
      applicationEntity = await this.applicationProvider.deleteApplication(applicationId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return applicationEntity;
  }

  @Delete('/truncate')
  @UseGuards(MasterGuard)
  public async truncateApplications(): Promise<boolean> {
    try {
      await this.applicationProvider.truncateApplications();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return true;
  }
}
