import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('findUserByUserName')
  findUserByUserName(@Body() body: { username: string }) {
    return this.userService.findOne(body.username);
  }

  @Post('registerUser')
  async register(@Body() body: any) {
    return await this.userService.register(body);
  }
}
