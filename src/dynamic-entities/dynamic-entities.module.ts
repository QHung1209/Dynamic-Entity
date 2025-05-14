import { Module } from '@nestjs/common';
import { DynamicEntitiesService } from './dynamic-entities.service';
import { DynamicEntitiesController } from './dynamic-entities.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicEntity, DynamicEntitySchema } from './entities/dynamic-entity.entity';
import { JsonValidator } from 'src/core/json-validator';
import { JsonValidatorModule } from 'src/core/json-validator.module';

@Module({
  imports: [MongooseModule.forFeature([{name: DynamicEntity.name, schema: DynamicEntitySchema}]), JsonValidatorModule],
  controllers: [DynamicEntitiesController],
  providers: [DynamicEntitiesService],
  exports: [DynamicEntitiesService]
})
export class DynamicEntitiesModule {}
