import { Controller, Get } from '@nestjs/common';
import { getConnection } from 'typeorm';

@Controller({
  path: '/health',
})
export class HealthController {
  constructor() { }

  @Get('/')
  public getHealth(): string {
    return 'OK';
  }

  @Get('/database')
  public async getDatabaseHealth(): Promise<string> {
    try {
      const connection = getConnection();

      await connection.query('SELECT 1 = 1 AS result;');
    } catch {
      throw new Error('Not Healthy');
    }

    return 'OK';
  }
}
