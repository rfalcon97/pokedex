import { PartialType } from '@nestjs/mapped-types';
import { CreatePokenDto } from './create-poken.dto';

export class UpdatePokenDto extends PartialType(CreatePokenDto) {}
