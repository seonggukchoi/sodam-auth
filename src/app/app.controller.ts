import { Controller, Get } from '@nestjs/common';

@Controller({ path: '/' })
export class AppController {
  @Get('/')
  public getRoot(): void {
    return;
  }
}
