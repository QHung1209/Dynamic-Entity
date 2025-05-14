import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDynamicEntityDto } from './dto/create-dynamic-entity.dto';
import {
  DynamicEntity,
  DynamicEntityDocument,
} from './entities/dynamic-entity.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose, { Collection, Connection } from 'mongoose';
import { JsonValidator } from 'src/core/json-validator';
import { UpdateDynamicEntityDto } from './dto/update-dynamic-entity.dto';
import { ObjectId } from 'mongoose';
import { Db, InsertOneResult, UpdateResult, WithId } from 'mongodb';
import { getDb } from 'src/db/mongo.driver';
@Injectable()
export class DynamicEntitiesService {
  private db: Db;

  constructor(
    @InjectModel(DynamicEntity.name)
    private dynamicEntityModel: SoftDeleteModel<DynamicEntityDocument>,
    @InjectConnection() private connection: Connection,
    private jsonValidator: JsonValidator,
  ) {}
  async onModuleInit() {
    this.db = await getDb();
  }

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

  async validateAndGetCollection(
    entityName: string,
    data: any,
  ): Promise<{
    model: Collection;
    jsonSchema: any;
  }> {
    const coll = await this.dynamicEntityModel.findOne({ name: entityName });
    const model = this.connection.collection(entityName);

    if (!coll || !model) {
      throw new NotFoundException(`Not found collection ${entityName}`);
    }

    const jsonSchema = this.convertToMongoJsonSchema(coll.fields);
    this.jsonValidator.validate(data, jsonSchema);

    return { model, jsonSchema };
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

  async update(id: ObjectId, updateDynamicEntityDto: UpdateDynamicEntityDto) {
    const dynamicEntity = await this.dynamicEntityModel.findById(id).lean();
    if (!dynamicEntity) throw new BadRequestException(`Not found ${id}`);

    if (updateDynamicEntityDto.fields) {
      const jsonSchema = this.convertToMongoJsonSchema(
        updateDynamicEntityDto.fields,
      );

      await this.db.command({
        collMod: dynamicEntity.name,
        validator: {
          $jsonSchema: jsonSchema,
        },
        validationLevel: 'strict',
      });
    }

    if (
      updateDynamicEntityDto.name &&
      updateDynamicEntityDto.name !== dynamicEntity.name
    )
      await this.connection.db.renameCollection(
        dynamicEntity.name,
        updateDynamicEntityDto.name,
      );
    await this.dynamicEntityModel.updateOne(
      { _id: id },
      { ...updateDynamicEntityDto },
    );

    const updatedEntity = this.dynamicEntityModel.findById(id);
    return updatedEntity;
  }

  async delete(id: ObjectId) {
    const deletedEntity = await this.dynamicEntityModel.findById(id);
    if (!deletedEntity) throw new NotFoundException(`Not found ${id}`);
    await this.dynamicEntityModel.deleteOne({ _id: id });
    await this.db.dropCollection(deletedEntity.name);
  }

  async getAll() {
    return await this.dynamicEntityModel.find();
  }

  async findByName(name: string) {
    return await this.dynamicEntityModel.findOne({ name });
  }

  async createDynamicRecord(
    entityName: string,
    data: any,
  ): Promise<InsertOneResult> {
    const { model } = await this.validateAndGetCollection(entityName, data);
    return model.insertOne(data);
  }

  async updateDynamicRecord(
    entityName: string,
    id: string,
    data: any,
  ): Promise<UpdateResult> {
    const { model } = await this.validateAndGetCollection(entityName, data);

    const objectId = new mongoose.Types.ObjectId(id);

    const existingDoc = await model.findOne(
      { _id: objectId },
      { projection: { _id: 1 } },
    );

    if (!existingDoc) {
      throw new NotFoundException(
        `Document with id ${id} not found in collection ${entityName}`,
      );
    }

    return model.updateOne({ _id: objectId }, { $set: data });
  }

  async deleteDynamicRecord(entityName: string, id: string) {
    const coll = await this.dynamicEntityModel.findOne({ name: entityName });
    const model = this.connection.collection(entityName);
    const objectId = new mongoose.Types.ObjectId(id);
    if (!coll || !model) {
      throw new NotFoundException(`Not found collection ${entityName}`);
    }

    if (!(await model.findOne({ _id: objectId }))) {
      throw new NotFoundException(`Not found ${id}`);
    }

    await model.deleteOne({ _id: objectId });
  }

  async getAllDynamicRecord(entityName: string): Promise<any> {
    const coll = await this.dynamicEntityModel.findOne({ name: entityName });
    const model = this.connection.collection(entityName);
    if (!coll || !model) {
      throw new NotFoundException(`Not found collection ${entityName}`);
    }
    return await model.find().toArray();
  }
}
