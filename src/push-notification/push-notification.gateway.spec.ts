import { Test, TestingModule } from '@nestjs/testing';
import { PushNotificationGateway } from './push-notification.gateway';

describe('PushNotificationGateway', () => {
  let gateway: PushNotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PushNotificationGateway],
    }).compile();

    gateway = module.get<PushNotificationGateway>(PushNotificationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
