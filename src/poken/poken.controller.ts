import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PokenService } from './poken.service';
import { CreatePokenDto } from './dto/create-poken.dto';
import { UpdatePokenDto } from './dto/update-poken.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/paginantion.dto';

@Controller('poken')
export class PokenController {
  constructor(private readonly pokenService: PokenService) {}

  @Post()
  create(@Body() createPokenDto: CreatePokenDto) {
    return this.pokenService.create(createPokenDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokenService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.pokenService.findOne(term);
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokenDto: UpdatePokenDto) {
    
    return this.pokenService.update(term, updatePokenDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.pokenService.remove(id);
  }
}
