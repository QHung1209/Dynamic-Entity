import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { IsEnum, IsOptional, IsString, ValidateNested } from "class-validator";
import { HydratedDocument } from "mongoose";
import { FieldType, FieldValidation } from "src/common/types/field-types.enum";

export type DynamicEntityDocument = HydratedDocument<DynamicEntity>

export class FieldDefinition {
  @IsString()
  name: string;

  @IsEnum(FieldType)
  type: FieldType;

  @IsOptional()
  @ValidateNested()
  @Type(() => FieldValidation) 
  validation?: FieldValidation;
}

@Schema({ timestamps: true })
export class DynamicEntity {
  @Prop({required: true, unique: true})
  name: string

  @Prop({ required: true, type: [Object] })
  @ValidateNested({ each: true })
  @Type(() => FieldDefinition)
  fields: FieldDefinition[];
}

export const DynamicEntitySchema = SchemaFactory.createForClass(DynamicEntity);
