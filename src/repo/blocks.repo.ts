import { Blocks } from 'src/entities/blocks.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Blocks)
export class BlocksRepository extends Repository<Blocks> {}
