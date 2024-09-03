import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Optional,
  Query,
} from '@nestjs/common';
import { VideoService } from './video.service';
import { Video } from './video.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVideoDto } from './dto/create-video.dto';
import { AuthGuard } from '@nestjs/passport';
import { VoteDto } from './dto/vote-video.dto';
import { OptionalAuthGuard } from '../auth/optional-auth.guard';

@ApiTags('videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  @ApiOperation({ summary: 'Get video list' })
  @ApiResponse({ status: 200, description: 'Returns a list of videos.' })
  @Optional()
  @UseGuards(OptionalAuthGuard)
  async findAll(
    @Request() req,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    const userId = req.user ? req.user.userId : null;
    return this.videoService.findAll(+page, +pageSize, userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new video' })
  @ApiResponse({ status: 201, description: 'Video has been created.' })
  async create(@Body() video: CreateVideoDto, @Request() req): Promise<Video> {
    const userId = req.user.userId;
    return this.videoService.create(video, userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a video' })
  @ApiResponse({ status: 201, description: 'The video has been deleted.' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.videoService.delete(id);
  }

  @Post('vote')
  @UseGuards(AuthGuard('jwt'))
  async voteVideo(@Request() req, @Body() voteDto: VoteDto) {
    const userId = req.user.userId;
    return this.videoService.voteVideo(userId, voteDto);
  }
}
