import path from 'node:path';

export const isUploadingFileAllowed = (filename: string) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(fileExtension);
};
