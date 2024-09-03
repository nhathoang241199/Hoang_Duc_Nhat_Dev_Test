import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class VoteDto {
  @ApiProperty({ example: 1, description: 'Video ID' })
  @IsNotEmpty()
  @IsNumber()
  videoId: number;

  @ApiProperty({
    example: true,
    description: 'True if like, False if unlike',
  })
  @IsNotEmpty()
  @IsBoolean()
  isLike: boolean;
}
