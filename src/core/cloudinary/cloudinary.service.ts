import { Injectable } from '@nestjs/common';
import toStream from 'buffer-to-stream';
import {
  UploadApiErrorResponse,
  UploadApiOptions,
  UploadApiResponse,
  v2,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Storage.MultipartFile,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const buffer = await file.toBuffer();

    const options: UploadApiOptions = {
      resource_type: 'auto',
      folder: 'food-recipes',
      transformation: [
        {
          quality: 'auto',
          fetch_format: 'webp',
        },
      ],
    };

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(options, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
      toStream(buffer).pipe(upload);
    });
  }
}
