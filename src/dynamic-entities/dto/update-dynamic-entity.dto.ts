import { PartialType } from '@nestjs/mapped-types';
import { CreateDynamicEntityDto } from './create-dynamic-entity.dto';

export class UpdateDynamicEntityDto extends PartialType(CreateDynamicEntityDto) {}
