import { Controller, Get } from '@nestjs/common';
import { AuthorizationService } from '../authorization/authorization.service';

@Controller({
  path: '/health',
})
export class HealthController {
  constructor(
    private readonly authorizationService: AuthorizationService,
  ) { }

  @Get('/')
  public getHealth(): string {
    return 'OK';
  }

  @Get('/database')
  public async getDatabaseHealth(): Promise<string> {
    try {
      await this.authorizationService.getConnection().query('SELECT 1 = 1');
    } catch {
      throw new Error('Not Healthy');
    }

    return 'OK';
  }
}
