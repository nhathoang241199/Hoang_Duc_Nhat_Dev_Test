import { ApiProperty } from '@nestjs/swagger';

export class CreateVideoDto {
  @ApiProperty({
    example: 'https://www.youtube.com/watch?v=abc123',
    description: 'Video URL',
  })
  url: string;

  @ApiProperty({ example: 'Video title', description: 'Video title' })
  title: string;

  @ApiProperty({
    example: 'Video description',
    description: 'Video description',
  })
  description: string;

  @ApiProperty({
    example: 'Video banner',
    description: 'Video banner',
  })
  banner: string;
}
