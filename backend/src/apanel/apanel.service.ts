import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/apanel.dto';
import { Prisma } from '@prisma/client';


@Injectable()
export class ApanelService {
  constructor(private readonly prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany()
  }

  async createUser(createUserDto: CreateUserDto) {
    const userData: Prisma.UserCreateInput = {
      email: createUserDto.email,
      password: createUserDto.password,
      name: createUserDto.name,
      role: createUserDto.role || 'USER',  // Роль по умолчанию
    };

    return this.prisma.user.create({
      data: userData,
    });
  }

  // Обновление пользователя
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    try {
      await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return { success: true, message: 'Пользователь успешно обновлен' };
    } catch {
      return { success: false, message: 'Ошибка при обновлении пользователя' };
    }
  }

  async deleteUser(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
      return { success: true, message: 'Пользователь успешно удален' };
    } catch {
      return { success: false, message: 'Ошибка при удалении пользователя' };
    }
  }
}
