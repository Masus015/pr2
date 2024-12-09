import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateUserDto, UpdateUserDto } from './dto/apanel.dto';
import { ApanelService } from './apanel.service';
import { ApiParam } from '@nestjs/swagger';

@UseGuards(RolesGuard)
@Roles('ADMIN')
@Controller('apanel')
export class ApanelController {
  constructor(private apanelService: ApanelService) {}

  @Get('getAllUsers')
  async getAllUsers() {
    return this.apanelService.getUsers();
  }

  // Создать пользователя
  @Post('createUser')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.apanelService.createUser(createUserDto);
  }

  // Обновить пользователя
  @Put(':id')
  @ApiParam({ name: 'id', type: Number })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const numericId = parseInt(String(id), 10);
    return this.apanelService.updateUser(numericId, updateUserDto);
  }

  // Удалить пользователя
  @Delete(':id')
  @ApiParam({ name: 'id', type: Number })
  async deleteUser(@Param('id') id: number) {
    const numericId = parseInt(String(id), 10);
    return this.apanelService.deleteUser(numericId);
  }

}
