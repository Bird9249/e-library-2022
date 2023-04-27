interface Result {
  success: Array<SuccessData>;
  failed: Array<FailedData>;
}

interface FailedData {
  no: number;
  fileName: string;
  message: string;
}

interface SuccessData {
  code?: string;
  url: string;
  name: string;
}

interface BookFiles {
  cover: Express.Multer.File[];
  contents?: Express.Multer.File[];
  file?: Express.Multer.File[];
}

export { Result, FailedData, SuccessData, BookFiles };
