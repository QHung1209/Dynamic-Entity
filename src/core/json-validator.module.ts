import { Module } from "@nestjs/common";
import { JsonValidator } from "./json-validator";

@Module({
  providers: [JsonValidator],
  exports: [JsonValidator],   
})
export class JsonValidatorModule {}
