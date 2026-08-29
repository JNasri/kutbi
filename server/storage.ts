import { S3Client } from '@aws-sdk/client-s3';

function requireEnvironmentVariable(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required for journal image storage.`);
  return value;
}

const prefix = (process.env.S3_PREFIX?.trim() || 'kutbi_journal').replace(/^\/+|\/+$/g, '');
const publicBaseUrl = requireEnvironmentVariable('S3_PUBLIC_BASE_URL').replace(/\/+$/g, '');

export const storageConfig = Object.freeze({
  bucket: requireEnvironmentVariable('S3_BUCKET'),
  prefix,
  publicBaseUrl,
});

export const storage = new S3Client({
  endpoint: requireEnvironmentVariable('S3_ENDPOINT'),
  region: process.env.S3_REGION?.trim() || 'auto',
  forcePathStyle: true,
  credentials: {
    accessKeyId: requireEnvironmentVariable('S3_ACCESS_KEY_ID'),
    secretAccessKey: requireEnvironmentVariable('S3_SECRET_ACCESS_KEY'),
  },
});