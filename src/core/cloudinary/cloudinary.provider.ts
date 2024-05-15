import { v2 } from 'cloudinary';

import { CLOUDINARY, envs } from '@src/config';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: envs.API_NAME,
      api_key: envs.API_KEY,
      api_secret: envs.API_SECRET,
    });
  },
};
