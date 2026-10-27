import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ApiEnvelopeResponse,
  ApiErrorEnvelopeResponse,
} from '../../common/decorators/api-envelope-response.decorator';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiEnvelopeResponse(UserResponseDto, { isArray: true })
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiEnvelopeResponse(UserResponseDto, { status: HttpStatus.CREATED })
  @ApiErrorEnvelopeResponse(HttpStatus.BAD_REQUEST, {
    description: 'Request body failed validation',
    code: 'VALIDATION_ERROR',
    message: 'Validation failed',
    details: [
      {
        field: 'name',
        errors: ['name must be longer than or equal to 2 characters'],
      },
    ],
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }
}
