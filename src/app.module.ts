import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://hunglyquoc2003:Timetolove0.@cluster0.zvfrd.mongodb.net/dynamic')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
