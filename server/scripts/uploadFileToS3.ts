import { randomUUID } from 'node:crypto';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { storage, storageConfig } from '../storage.js';

const imageExtensions = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/avif', '.avif'],
]);

function createPublicUrl(key: string) {
  const encodedKey = key.split('/').map(encodeURIComponent).join('/');
  return `${storageConfig.publicBaseUrl}/${encodedKey}`;
}

function objectKeyFromPublicUrl(value: string) {
  try {
    const fileUrl = new URL(value);
    const publicUrl = new URL(`${storageConfig.publicBaseUrl}/`);
    if (fileUrl.origin !== publicUrl.origin) return null;

    const publicPath = publicUrl.pathname.replace(/^\/+|\/+$/g, '');
    const filePath = decodeURIComponent(fileUrl.pathname).replace(/^\/+/, '');
    const key = publicPath
      ? filePath.startsWith(`${publicPath}/`) ? filePath.slice(publicPath.length + 1) : null
      : filePath;

    if (!key || !key.startsWith(`${storageConfig.prefix}/`)) return null;
    return key;
  } catch {
    return null;
  }
}

export async function uploadFileToS3(file: Express.Multer.File) {
  const extension = imageExtensions.get(file.mimetype);
  if (!extension) throw new Error('Unsupported journal image type.');

  const key = `${storageConfig.prefix}/${Date.now()}-${randomUUID()}${extension}`;
  await storage.send(new PutObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return createPublicUrl(key);
}

export async function uploadFilesToS3(files: Express.Multer.File[]) {
  const results = await Promise.allSettled(files.map(uploadFileToS3));
  const uploadedUrls = results.flatMap((result) => result.status === 'fulfilled' ? [result.value] : []);
  const failedUpload = results.find((result) => result.status === 'rejected');

  if (failedUpload?.status === 'rejected') {
    await Promise.allSettled(uploadedUrls.map(deleteFileFromS3));
    throw failedUpload.reason;
  }

  return uploadedUrls;
}

export async function deleteFileFromS3(url: string) {
  const key = objectKeyFromPublicUrl(url);
  if (!key) return false;

  await storage.send(new DeleteObjectCommand({
    Bucket: storageConfig.bucket,
    Key: key,
  }));
  return true;
}