import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserService } from "./user.service";
import { MathDto, UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}


    @Post('plus')
    async plus(@Body() body: MathDto) {
        return this.userService.mathPlus(body.one, body.two)
    }

    @Post('minus')
    async minus(@Body() body: MathDto) {
        return this.userService.mathMinus(body.one, body.two)
    }

    @Get('getRole')
    @UseGuards(JwtAuthGuard)
    async getRole(@Req() req) {
        return this.userService.getRole(req.user.email)
    }

}
