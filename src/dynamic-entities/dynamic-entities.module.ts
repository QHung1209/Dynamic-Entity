import { Module } from '@nestjs/common';
import { DynamicEntitiesService } from './dynamic-entities.service';
import { DynamicEntitiesController } from './dynamic-entities.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { DynamicEntity, DynamicEntitySchema } from './entities/dynamic-entity.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: DynamicEntity.name, schema: DynamicEntitySchema}])],
  controllers: [DynamicEntitiesController],
  providers: [DynamicEntitiesService],
  exports: [DynamicEntitiesService]
})
export class DynamicEntitiesModule {}
