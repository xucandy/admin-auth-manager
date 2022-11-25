import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from '../../../entitys/file.entity';
import { Repository, Transaction, TransactionRepository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
const FILE_UPLOAD_FOLDER = '/public/uploads/';
const FILE_PREFIX = '/uploads/';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private fileRepository: Repository<FileEntity>,
  ) {}
  @Transaction()
  async saveFile(
    file: any,
    fileName: string,
    @TransactionRepository(FileEntity) fileRepository?: Repository<FileEntity>,
  ) {
    const fileEntity = new FileEntity();
    fileEntity.createTime = new Date();
    fileEntity.updateTime = new Date();
    const fileNameNew =
      file.originalname == 'blob' ? fileName : file.originalname;
    fileEntity.name =
      Date.now() + fileNameNew.substring(fileNameNew.lastIndexOf('.'));
    fileEntity.fileName = fileNameNew;
    fileEntity.path = FILE_PREFIX + fileEntity.name;
    const fileFolder = path.join(__dirname, '../../../../', FILE_UPLOAD_FOLDER);
    if (!fs.existsSync(fileFolder)) {
      fs.mkdirSync(fileFolder);
    }
    const ws = fs.createWriteStream(`${fileFolder}${fileEntity.name}`);
    const wsP = new Promise((resolve, reject) => {
      ws.write(file.buffer, (err) => {
        if (!err) {
          resolve('');
          return;
        }
        reject(err);
        throw err;
      });
    });
    const fileResult = await fileRepository.save(fileEntity);
    await wsP;
    return fileResult;
  }
}
