import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Documents the shape of a User as returned by the API.
 * Used only for Swagger; the runtime value is the Mongoose document.
 */
export class UserResponseDto {
  @ApiProperty({ example: '665f1c2e8a1b2c3d4e5f6a7b' })
  _id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiPropertyOptional({ example: 'jane@example.com' })
  email?: string;

  @ApiProperty({ example: 0, description: 'Mongoose document version key' })
  __v: number;
}
