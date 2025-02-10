import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestService } from '../service/test.service';
import { TestDto } from '../dto/test.dto';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  async addTest(@Body() test: TestDto) {
    return this.testService.create(test);
  }

  @Get('/get_all_test')
  async findAll() {
    return this.testService.findAll();
  }
}
