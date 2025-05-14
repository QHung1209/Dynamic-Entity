import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicEntityDto } from './create-dynamic-entity.dto';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FieldDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  required: boolean;
}

export class UpdateDynamicEntityDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  fields: FieldDto[];
}
