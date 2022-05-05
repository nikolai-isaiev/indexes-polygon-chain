import { Indexes } from 'src/entities/indexes.entity';
import { EntityRepository, IsNull, Repository } from 'typeorm';

@EntityRepository(Indexes)
export class IndexesRepository extends Repository<Indexes> {
  async findWithoutTokenNameAndId() {
    return this.find({
      where: {
        idToken: IsNull(),
        nameToken: IsNull(),
      },
    });
  }
}
