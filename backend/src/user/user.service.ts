import { Injectable, NotFoundException } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}


    async mathPlus(one: number, two: number) {
        return { message: one + two }
    }

    async mathMinus(one: number, two: number) {
        return { message: one - two }
    }

    async getRole(email: string): Promise<{ role: string }> {
        // Поиск пользователя в базе данных по email
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Возвращаем роль пользователя
        return { role: user.role };
    }
}
