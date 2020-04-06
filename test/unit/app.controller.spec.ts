import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/app';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async done => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);

    done();
  });

  test('getRoot() - Return value Should be undefined', async done => {
    const result = appController.getRoot();

    expect(result).toEqual(undefined);

    done();
  });
});
