import { IsString, IsOptional, IsArray, IsBoolean, IsNumber, Matches, IsEnum, IsInt, Min, Max, MinLength, MaxLength, IsUrl, IsEmail } from 'class-validator';
export enum FieldType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  OBJECT = 'object',
  ARRAY = 'array',
  ENUM = 'enum',
  EMAIL = 'email',
  URL = 'url',
}

export class FieldValidation {
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @IsOptional()
  @IsInt()
  min?: number;

  @IsOptional()
  @IsInt()
  max?: number;

  @IsOptional()
  @IsInt()
  minLength?: number;

  @IsOptional()
  @IsInt()
  maxLength?: number;

  @IsOptional()
  @Matches(/^[a-zA-Z0-9_]*$/)
  pattern?: string;

  @IsOptional()
  @IsEnum(FieldType)
  enum?: string[];

  @IsOptional()
  @IsBoolean()
  unique?: boolean;

  @IsOptional()
  @IsString()
  default?: any;

  @IsOptional()
  @IsString()
  ref?: string; 
}
