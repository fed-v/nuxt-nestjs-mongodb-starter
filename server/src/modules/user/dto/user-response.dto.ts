import { UserDocument } from '../schemas/user.schema';

export class UserResponseDto {
  _id: string;
  name: string;
  email?: string;

  static from(user: UserDocument): UserResponseDto {
    return {
      _id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
