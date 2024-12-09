import { Module } from '@nestjs/common';
import { ApanelController } from './apanel.controller';
import { ApanelService } from './apanel.service';

@Module({
  controllers: [ApanelController],
  providers: [ApanelService]
})
export class ApanelModule {}
