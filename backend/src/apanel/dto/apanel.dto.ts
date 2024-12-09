import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Max', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string; // Поле для имени при регистрации

  @ApiProperty({ example: 'USER' })
  @IsEnum(['USER', 'ADMIN', 'MODER'])
  role: 'USER' | 'ADMIN' | 'MODER';
}

export class UpdateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'Max', nullable: true })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ example: 'USER' })
  @IsEnum(['USER', 'ADMIN', 'MODER'])
  @IsOptional()
  role: 'USER' | 'ADMIN' | 'MODER';
}
