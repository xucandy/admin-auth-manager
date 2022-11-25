import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../../service/file/file.service';
import { MyResponse } from '../../../common/myResponse';
@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file, @Query('fileName') fileName: string) {
    console.log(file, fileName);
    const res = await this.fileService.saveFile(file, fileName);
    return MyResponse.success(res);
  }
}
