import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Vote } from './vote.entity';

@Injectable()
export class VoteRepository extends Repository<Vote> {
  constructor(private dataSource: DataSource) {
    super(Vote, dataSource.createEntityManager());
  }
}
