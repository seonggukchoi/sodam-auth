import { Controller, Get } from '@nestjs/common';

@Controller({ path: '/health' })
export class HealthController {
  @Get('/')
  public getHealth(): string {
    return 'OK';
  }
}
