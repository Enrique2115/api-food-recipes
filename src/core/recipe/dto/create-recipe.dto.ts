import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  ingredients: string;

  @IsString()
  @IsNotEmpty()
  instructions: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  urlVideo: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  urlImage: string;
}
