import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity({ name: 'transactions' })
export class Transactions {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column({ name: 'token_address' })
  tokenAddress: string;

  @Column()
  block: number;

  @Column({ name: 'block_time' })
  blockTime: string;

  @Column({ name: 'token_id' })
  tokenId: string;

  @Column()
  amount: string;

  @Column({ name: 'token_type' })
  tokenType: string;

  @Column({ name: 'transaction_hash' })
  transactionHash: string;
}
