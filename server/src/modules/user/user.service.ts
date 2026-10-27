import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll({
    page = 1,
    limit = 20,
  }: PaginationQueryDto): Promise<UserResponseDto[]> {
    const users = await this.userModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return users.map((user) => UserResponseDto.from(user));
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await new this.userModel(createUserDto).save();

    return UserResponseDto.from(user);
  }
}
