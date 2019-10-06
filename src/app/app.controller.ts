import { Controller, Get, Redirect } from '@nestjs/common';

@Controller({
  path: '/',
})
export class AppController {
  @Get('/')
  @Redirect('/health')
  public getRoot() {
    return;
  }
}
