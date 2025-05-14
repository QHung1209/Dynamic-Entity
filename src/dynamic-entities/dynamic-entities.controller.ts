import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DynamicEntitiesService } from './dynamic-entities.service';
import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import { UpdateDynamicEntityDto } from './dto/update-dynamic-entity.dto';
import { ObjectId } from 'mongoose';
import { InsertOneResult } from 'mongodb';

@Controller('dynamic-entities')
export class DynamicEntitiesController {
  constructor(
    private readonly dynamicEntitiesService: DynamicEntitiesService,
  ) {}

  @Post()
  async create(@Body() createDynamicEntityDto: CreateDynamicEntityDto) {
    return await this.dynamicEntitiesService.create(createDynamicEntityDto);
  }

  @Get()
  async getAll() {
    return await this.dynamicEntitiesService.getAll();
  }

  @Get(':entityName')
  async getOne(@Param('entityName') entityName: string) {
    return await this.dynamicEntitiesService.findByName(entityName);
  }

  @Patch(':id')
  async update(
    @Param('id') id: ObjectId,
    @Body() updateDynamicEntityDto: UpdateDynamicEntityDto,
  ) {
    return await this.dynamicEntitiesService.update(id, updateDynamicEntityDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: ObjectId) {
    return await this.dynamicEntitiesService.delete(id);
  }

  @Post(':entityName/data')
  async createDynamicData(
    @Param('entityName') entityName: string,
    @Body() data: any,
  ): Promise<InsertOneResult<Document>> {
    return await this.dynamicEntitiesService.createDynamicRecord(
      entityName,
      data,
    );
  }

  @Patch(':entityName/data/:id')
  async updateDynamicData(
    @Param('entityName') entityName: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return await this.dynamicEntitiesService.updateDynamicRecord(
      entityName,
      id,
      data,
    );
  }

  @Delete(':entityName/data/:id')
  async deleteDynamicData(
    @Param('entityName') entityName: string,
    @Param('id') id: string,
  ) {
    return await this.dynamicEntitiesService.deleteDynamicRecord(
      entityName,
      id,
    );
  }

  @Get(':entityName/data')
  async getAllDynamicRecord(@Param('entityName') entityName: string) {
    return await this.dynamicEntitiesService.getAllDynamicRecord(entityName);
  }
}
