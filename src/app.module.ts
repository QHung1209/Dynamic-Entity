import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicEntitiesModule } from './dynamic-entities/dynamic-entities.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { DynamicRecordModule } from './dynamic-record/dynamic-record.module';

@Module({
  imports: [MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGO_URL'),
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
      }
    }), inject: [ConfigService]
  }), ConfigModule.forRoot({ isGlobal: true }),DynamicEntitiesModule, DynamicRecordModule],
   controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
