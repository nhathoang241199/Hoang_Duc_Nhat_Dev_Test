import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { VoteService } from './vote.service';
import { VoteRepository } from './vote.repository';
import { VoteController } from './vote.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vote])],
  providers: [VoteService, VoteRepository],
  controllers: [VoteController],
  exports: [VoteService, VoteRepository],
})
export class VoteModule {}
