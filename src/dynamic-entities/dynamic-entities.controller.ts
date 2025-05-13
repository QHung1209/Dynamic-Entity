import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DynamicEntitiesService } from './dynamic-entities.service';
import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import { UpdateDynamicEntityDto } from './dto/update-dynamic-entity.dto';
import { DynamicEntity } from './entities/dynamic-entity.entity';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('dynamic-entities')
export class DynamicEntitiesController {
  constructor(private readonly dynamicEntitiesService: DynamicEntitiesService) {}

  @Post()
  async create(@Body() createDynamicEntityDto: CreateDynamicEntityDto) {

    return await this.dynamicEntitiesService.create(createDynamicEntityDto);
  }



   @Post(':entityName/data')
  async createDynamicData(@Param('entityName') entityName: string, @Body() data: any) {
    return await this.dynamicEntitiesService.createDynamicRecord(entityName, data)
  }


}
