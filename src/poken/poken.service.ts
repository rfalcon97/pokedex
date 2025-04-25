import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokenDto } from './dto/create-poken.dto';
import { UpdatePokenDto } from './dto/update-poken.dto';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from './entities/poken.entity';

@Injectable()
export class PokenService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}
  async create(createPokenDto: CreatePokenDto) {
    createPokenDto.name = createPokenDto.name.toLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokenDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all poken`;
  }

  // Método para buscar un Pokémon por número, MongoID o nombre
  async findOne(term: string) {
    // Declaramos la variable 'pokemon' como tipo Pokemon o null
    let pokemon: Pokemon | null = null;

    // 👉 Si el término es un número (por ejemplo, '25'), busca por el número del Pokémon
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // 👉 Si el término es un ObjectId válido de Mongo (ej: '66336aee5e1a7fc285ba828f'), busca por ID
    if (!pokemon && isValidObjectId(term)) {
      // ⚠️ Esto puede sobrescribir el resultado anterior si también fue un número válido
      pokemon = await this.pokemonModel.findById(term);
    }

    // 👉 Si no se encontró aún, intenta buscar por el nombre del Pokémon (ej: 'pikachu')
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(), // lo convierte a minúsculas y sin espacios alrededor
      });
    }

    // ❌ Si después de todas las búsquedas no se encontró nada, lanza un error
    if (!pokemon) {
      throw new BadRequestException(
        `Pokemon with id, name or no "${term}" not found`,
      );
    }

    // ✅ Si se encontró, lo retorna
    return pokemon;
  }

  async update(term: string, updatePokenDto: UpdatePokenDto) {
    const pokemon = await this.findOne(term);
    if (updatePokenDto.name) {
      updatePokenDto.name = updatePokenDto.name.toLowerCase();
    }
    try {
      await pokemon.updateOne(updatePokenDto);
      return { ...pokemon.toJSON(), ...updatePokenDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    /* const pokemon = await this.findOne(id);
    await pokemon.deleteOne(); 
    const result =  await this.pokemonModel.findByIdAndDelete(id);*/
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exist in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      `Can't create Pokemon - Check server logs`,
    );
  }
}
