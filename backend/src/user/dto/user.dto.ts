import { IsEmail, IsInt, IsOptional } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";


export class MathDto {

    @ApiProperty({ example: '10', description: 'Первое число' })
    @IsInt()
    one: number;

    @ApiProperty({ example: '20', description: 'Второе число' })
    @IsInt()
    two: number;
}

export class UserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'Max', nullable: true })
    @IsOptional()
    name?: string;
}
