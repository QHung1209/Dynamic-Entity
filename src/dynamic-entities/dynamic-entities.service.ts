import { Injectable } from '@nestjs/common';
import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import { UpdateDynamicEntityDto } from './dto/update-dynamic-entity.dto';
import { DynamicEntity, DynamicEntityDocument } from './entities/dynamic-entity.entity';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose, { Mongoose, ObjectId } from 'mongoose';

@Injectable()
export class DynamicEntitiesService {
  constructor(@InjectModel(DynamicEntity.name) private dynamicEntityModel : SoftDeleteModel<DynamicEntityDocument>) {}
  async create(createDynamicEntityDto: Partial<DynamicEntity>) {
    return await this.dynamicEntityModel.create(createDynamicEntityDto)
  }


  findAll() {
    return `This action returns all dynamicEntities`;
  }

  async findOne(id: mongoose.Types.ObjectId) {
    return await this.dynamicEntityModel.findById(id);
  }

  update(id: number, updateDynamicEntityDto: UpdateDynamicEntityDto) {
    return `This action updates a #${id} dynamicEntity`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicEntity`;
  }
}
