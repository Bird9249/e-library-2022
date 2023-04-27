interface FileStreaming {
  fileName: string;
  path: string;
  mimeType: string;
}

interface BookFiles {
  cover?: Express.Multer.File[];
  content?: Express.Multer.File[];
  bookFile?: Express.Multer.File[];
  videoFile?: Express.Multer.File[];
  audioFile?: Express.Multer.File[];
}

export { FileStreaming, BookFiles };
