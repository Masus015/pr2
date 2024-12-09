import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// DTO для регистрации
export class RegisterDto {
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
}

// DTO для входа
export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123123' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}