import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import {
  DynamicEntity,
  DynamicEntityDocument,
} from './entities/dynamic-entity.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose, { Connection, Model, Mongoose, ObjectId } from 'mongoose';
import Ajv, { ErrorObject } from 'ajv';
import { JsonValidator } from 'src/core/json-validator';
@Injectable()
export class DynamicEntitiesService {
  constructor(
    @InjectModel(DynamicEntity.name)
    private dynamicEntityModel: SoftDeleteModel<DynamicEntityDocument>,
    @InjectConnection() private connection: Connection,
    private jsonValidator: JsonValidator,
  ) {}

  convertToMongoJsonSchema(fields: CreateDynamicEntityDto['fields']) {
    const schema: any = {
      bsonType: 'object',
      required: [],
      properties: {},
    };

    fields.forEach((field) => {
      const typeMap: Record<string, string> = {
        string: 'string',
        number: 'number',
        booloearn: 'boolean',
        date: 'date',
        object: 'object',
        array: 'array',
        enum: 'enum',
        email: 'string',
        url: 'string',
      };

      schema.properties[field.name] = {
        bsonType: typeMap[field.type] || 'string',
      };

      if (field.type === 'email') {
        schema.properties[field.name].pattern = '^\\S+@\\S+\\.\\S+$';
      }

      if (field.type === 'url') {
        schema.properties[field.name].pattern =
          '^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$';
      }

      if (field.required) schema.required.push(field.name);
    });

    return schema;
  }

  async findByName(name: string) {
    return await this.dynamicEntityModel.findOne({ name });
  }

  async create(createDynamicEntityDto: CreateDynamicEntityDto) {
    const created = await this.dynamicEntityModel.create(
      createDynamicEntityDto,
    );
    const jsonSchema = this.convertToMongoJsonSchema(
      createDynamicEntityDto.fields,
    );

    await this.connection.db.createCollection(createDynamicEntityDto.name, {
      validator: { $jsonSchema: jsonSchema },
    });
    return created;
  }

  async createDynamicRecord(entityName: string, data: any) {
    const coll = await this.dynamicEntityModel.findOne({ name: entityName });

    let model = this.connection.collection(entityName);

    if (!coll || !model) {
      throw new NotFoundException(`Not found collection ${entityName}`);
    }

    const jsonSchema = this.convertToMongoJsonSchema(coll?.fields);
    this.jsonValidator.validate(data, jsonSchema);

    return model.insertOne(data);
  }
}
