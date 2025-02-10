import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Test } from '../../schemas/test.schema';
import { Model } from 'mongoose';
import { TestDto } from '../dto/test.dto';

@Injectable()
export class TestService {
  constructor(@InjectModel(Test.name) private testModel: Model<Test>) {}
  async create(testDto: TestDto): Promise<Test> {
    const newTest = new this.testModel(testDto);
    return newTest.save();
  }

  async findAll(): Promise<Test[]> {
    console.log(this.testModel.name);
    return this.testModel.find().exec();
  }
}
