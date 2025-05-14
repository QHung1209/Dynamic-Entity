// json-validator.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import Ajv  from 'ajv';
import * as ajvBsontype from 'ajv-bsontype';


@Injectable()
export class JsonValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
    ajvBsontype(this.ajv)
  }

  validate(data: any, schema: any) {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);

    if (!valid) {
      const errors = validate.errors?.map(err => `${err.instancePath} ${err.message}`).join(', ');
      throw new BadRequestException(`Invalid JSON: ${errors}`);
    }

    return data 
  }
}
