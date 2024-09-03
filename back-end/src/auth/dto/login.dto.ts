import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'john_doe',
    description: "User's email",
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: "User's password",
  })
  @IsNotEmpty()
  password: string;
}
