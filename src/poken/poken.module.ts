import { Module } from '@nestjs/common';
import { PokenService } from './poken.service';
import { PokenController } from './poken.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/poken.entity';

@Module({
  controllers: [PokenController],
  providers: [PokenService],
  imports: [
    MongooseModule.forFeature([{ name: Pokemon.name, schema: PokemonSchema }]),
  ],
})
export class PokenModule {}
