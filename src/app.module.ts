import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PushNotificationGateway } from './push-notification/push-notification.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PushNotificationGateway],
})
export class AppModule {}
