import { Module } from '@nestjs/common';
import { PokenService } from './poken.service';
import { PokenController } from './poken.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/poken.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [PokenController],
  providers: [PokenService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
  exports: [MongooseModule],
})
export class PokenModule {}
