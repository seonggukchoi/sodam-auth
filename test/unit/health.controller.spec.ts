import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../../src/health';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async done => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    healthController = app.get<HealthController>(HealthController);

    done();
  });

  test('getHealth() - API Status should be healthy.', async done => {
    const result = healthController.getHealth();

    expect(result).toEqual('API OK');

    done();
  });

  test.skip('getDatabaseHealth() - Database Status should be healthy.', async done => {
    const result = await healthController.getDatabaseHealth();

    expect(result).toEqual('Database OK');

    done();
  });
});
