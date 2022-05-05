import { Transactions } from 'src/entities/transactions.entity';
import { EntityRepository, IsNull, Repository } from 'typeorm';

@EntityRepository(Transactions)
export class TransactionsRepository extends Repository<Transactions> {
  // async findWithoutTokenNameAndId() {
  //   return this.find({
  //     where: {
  //       idToken: IsNull(),
  //       nameToken: IsNull(),
  //     },
  //   });
  // }
}
