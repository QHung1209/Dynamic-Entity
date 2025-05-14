import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class FieldDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  required: boolean;
}

export class CreateDynamicEntityDto {
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FieldDto)
  fields: FieldDto[];
}
