import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty({
    message: 'El email no puede estar vacío',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'El nombre no puede estar vacío',
  })
  name: string;

  @IsString()
  @IsNotEmpty({
    message: 'El apellido no puede estar vacío',
  })
  lastName: string;

  @IsPhoneNumber('PE')
  @IsNotEmpty({
    message: 'El teléfono no puede estar vacío',
  })
  phone: string;

  @IsString()
  @IsNotEmpty({
    message: 'El password no puede estar vacío',
  })
  @Length(6, 10, {
    message: 'El password debe tener entre 6 y 10 caracteres',
  })
  password: string;
}
