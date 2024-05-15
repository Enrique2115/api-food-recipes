import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { isUploadingFileAllowed } from '@src/utils/validate-file-extension';

import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './entities/recipe.entity';

export interface IRecipePhoto {
  public_id: string;
  url: string;
}

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(createRecipeDto: CreateRecipeDto) {
    const {
      title,
      description,
      ingredients,
      instructions,
      category,
      urlVideo,
      urlImage,
    } = createRecipeDto;

    const existsRecipe = await this.recipeRepository.findOne({
      where: { title },
    });

    if (existsRecipe) {
      throw new ConflictException(
        'La receta ya existe',
        HttpStatus[HttpStatus.CONFLICT],
      );
    }

    const recipe = this.recipeRepository.create({
      title,
      description,
      ingredients,
      category,
      instructions,
      video: urlVideo,
      image: urlImage,
    });

    await this.recipeRepository.save(recipe);

    return {
      status: true,
      message: 'Receta creada exitosamente',
      recipe,
    };
  }

  async uploadImage(file: Storage.MultipartFile): Promise<IRecipePhoto> {
    const { filename } = file;

    const isValidImage = isUploadingFileAllowed(filename);

    if (!isValidImage) {
      throw new ConflictException(
        'El archivo debe ser una imagen',
        HttpStatus[HttpStatus.CONFLICT],
      );
    }
    const response = await this.cloudinaryService.uploadImage(file);

    const result: IRecipePhoto = {
      public_id: response.public_id as string,
      url: response.secure_url as string,
    };
    return result;
  }

  async findAll() {
    const recipes = await this.recipeRepository.find({
      select: ['id', 'title', 'description', 'category', 'image'],
    });

    return {
      status: true,
      message: 'Lista de recetas',
      recipes,
    };
  }

  async findOne(id: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(
        'La receta no existe',
        HttpStatus[HttpStatus.NOT_FOUND],
      );
    }

    return {
      status: true,
      message: 'Receta encontrada',
      recipe,
    };
  }

  async update(id: string, updateRecipeDto: UpdateRecipeDto) {
    const { urlImage, title, ingredients, instructions, category, urlVideo } =
      updateRecipeDto;

    const recipe = await this.recipeRepository.findOneBy({ id });

    if (!recipe) {
      throw new NotFoundException(
        'La receta no existe',
        HttpStatus[HttpStatus.NOT_FOUND],
      );
    }

    if (title !== recipe.title) {
      const existsRecipe = await this.recipeRepository.findOne({
        where: { title },
      });

      if (existsRecipe) {
        throw new ConflictException(
          `Ya existe una receta cone el nombre: ${title}`,
          HttpStatus[HttpStatus.CONFLICT],
        );
      }
    }

    await this.recipeRepository.update(
      { id },
      {
        title,
        description: updateRecipeDto.description,
        ingredients,
        category,
        instructions,
        video: urlVideo,
        image: urlImage,
      },
    );

    return {
      status: true,
      message: 'Receta actualizada',
    };
  }

  async remove(id: string) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(
        'La receta no existe',
        HttpStatus[HttpStatus.NOT_FOUND],
      );
    }

    await this.recipeRepository.remove(recipe);

    return {
      status: true,
      message: 'Receta eliminada',
    };
  }
}
