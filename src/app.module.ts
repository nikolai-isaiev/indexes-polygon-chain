import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IndexesService } from './indexes/indexes.service';
import { TransactionsRepository } from './repo/transactions.repo';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DBHOST,
        port: +process.env.DBPORT,
        username: process.env.DBUSERNAME,
        password: process.env.DBPASSWORD,
        database: process.env.DBNAME,
        entities: ['dist/**/*.entity{.ts,.js}'],
        logging: true,
        retryAttempts: 50,
        extra: {
          connectionLimit: 50,
        },
      }),
    }),
    TypeOrmModule.forFeature([TransactionsRepository]),
  ],
  controllers: [AppController],
  providers: [AppService, IndexesService],
})
export class AppModule {}
