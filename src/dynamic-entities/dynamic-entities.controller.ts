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
  async create(@Body() body: any) {
    const createDynamicEntityDto = plainToInstance(DynamicEntity, body);
    const errors = await validate(createDynamicEntityDto)
    if (errors.length > 0)
    {
      throw new Error(errors.toString())
    }
    
    return await this.dynamicEntitiesService.create(createDynamicEntityDto);
  }

  @Get()
  findAll() {
    return this.dynamicEntitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dynamicEntitiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDynamicEntityDto: UpdateDynamicEntityDto) {
    return this.dynamicEntitiesService.update(+id, updateDynamicEntityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dynamicEntitiesService.remove(+id);
  }
}
