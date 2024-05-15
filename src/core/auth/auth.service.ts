import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { LoginInput } from './dto/auth.input';
import { CreateUserDto } from './dto/create-auth.dto';
import { UserEntity } from './entities/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateUserDto) {
    const { email, name, lastName, phone, password } = createAuthDto;

    const existsUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existsUser) {
      throw new ConflictException(
        'User already exists',
        HttpStatus[HttpStatus.CONFLICT],
      );
    }

    const passwordHash = await this.hashPassword(password);

    const user = this.userRepository.create({
      email,
      name,
      lastName,
      phone,
      password: passwordHash,
    });

    await this.userRepository.save(user);

    return { user };
  }

  private async hashPassword(password: string) {
    const salt = await genSalt(10);
    return await hash(password, salt);
  }

  async login(loginInpit: LoginInput) {
    const { email, password } = loginInpit;

    const existsUser = await this.userRepository.findOne({
      where: { email },
    });

    const passwordMatch = await compare(password, existsUser.password);

    if (!existsUser || !passwordMatch) {
      throw new ConflictException(
        'Credenciales incorrectas',
        HttpStatus[HttpStatus.UNAUTHORIZED],
      );
    }

    const { id } = existsUser;

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ email, id }),
      this.jwtService.signAsync({ email, id }, { expiresIn: '7d' }),
    ]);

    await this.userRepository.update(id, { token, refreshToken });

    return {
      success: true,
      message: 'Login exitoso',
      user: {
        id,
        name: existsUser.name,
        lastName: existsUser.lastName,
        email: existsUser.email,
      },
      token,
      refreshToken,
    };
  }

  refresh_token(refresh_token: string) {
    return `This action returns all auth ${refresh_token}`;
  }

  async logout(user_id: string) {
    const user = await this.userRepository.findOneBy({ id: user_id });

    if (!user) {
      throw new ConflictException('User not found', HttpStatus[HttpStatus.OK]);
    }

    await this.userRepository.update(user.id, {
      // eslint-disable-next-line unicorn/no-null
      refreshToken: null,
      // eslint-disable-next-line unicorn/no-null
      token: null,
    });

    return { success: true, message: 'Logout exitoso' };
  }
}
