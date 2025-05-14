import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { HydratedDocument } from "mongoose";
import { FieldType, FieldValidation } from "src/common/types/field-types.enum";

export type DynamicEntityDocument = HydratedDocument<DynamicEntity>

@Schema({ timestamps: true })
export class DynamicEntity {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ type: Array, required: true })
  fields: { name: string; type: string; required: boolean }[];
}

export const DynamicEntitySchema = SchemaFactory.createForClass(DynamicEntity);
