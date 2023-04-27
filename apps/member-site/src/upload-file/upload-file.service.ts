import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileStreaming } from '../common/interface/interface';

@Injectable()
export class UploadFileService {
  private publicPath = join(__dirname, '../../..', 'public') + '/';

  async uploadFile(path: string, file: Express.Multer.File): Promise<string> {
    const filename: uuidv4 = await uuidv4();

    const fullPath = this.publicPath + path;

    if (!existsSync(fullPath)) {
      mkdirSync(fullPath, {
        recursive: true,
      });
    }

    writeFileSync(
      fullPath + filename + extname(file.originalname),
      file.buffer,
    );

    return path + filename + extname(file.originalname);
  }

  deleteFile(path: string) {
    unlinkSync(this.publicPath + path);
  }

  async streamimgFile(res: Response, file: FileStreaming): Promise<any> {
    const result = createReadStream(
      join(process.cwd(), file.path + file.fileName),
    );

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.fileName}"`,
    });

    return new StreamableFile(result);
  }

  getFilesizeInBytes(path: string) {
    const stats = statSync(this.publicPath + path);
    return stats.size;
  }
}
