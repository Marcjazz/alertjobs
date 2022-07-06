import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TagCreationAttributes } from 'src/models/tag';
import { TagService } from 'src/services/tag.service';

@Controller('tags')
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async findAll() {
    const tags = await this.tagService.findAll();
    return {
      tags: tags.map((tag) => tag.toJSON()),
    };
  }

  @Post('new')
  async addNewTag(@Res() res: Response, @Body() newTag: TagCreationAttributes) {
    await this.tagService.create(newTag);
    res.redirect('/admin');
  }

  @Get(':tag_id/delete')
  async deleteTag(@Res() res: Response, @Param('tag_id') tag_id: string) {
    await this.tagService.delete(tag_id);
    res.redirect('/admin');
  }
}
