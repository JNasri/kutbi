import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { optimizeImage } from './imageOptimization.js';

test('JPEG, PNG, AVIF and WebP become WebP without resizing', async () => {
  for (const format of ['jpeg', 'png', 'avif', 'webp'] as const) {
    const input = await sharp({ create: { width: 320, height: 240, channels: 4, background: '#33669980' } }).toFormat(format).toBuffer();
    const output = await optimizeImage(input);
    const metadata = await sharp(output).metadata();
    assert.equal(metadata.format, 'webp');
    assert.equal(metadata.width, 320);
    assert.equal(metadata.height, 240);
    if (format !== 'jpeg') {
      assert.equal(metadata.hasAlpha, true);
      const pixel = await sharp(output).raw().toBuffer();
      assert.equal(pixel[3], 128);
    }
  }
});

test('camera orientation is preserved visually', async () => {
  const input = await sharp({ create: { width: 80, height: 40, channels: 3, background: 'red' } }).jpeg().withMetadata({ orientation: 6 }).toBuffer();
  const metadata = await sharp(await optimizeImage(input)).metadata();
  assert.equal(metadata.width, 40);
  assert.equal(metadata.height, 80);
});

test('invalid and excessive pixel inputs are rejected', async () => {
  await assert.rejects(optimizeImage(Buffer.from('not an image')));
  const huge = await sharp({ create: { width: 6500, height: 6500, channels: 3, background: 'white' } }).png().toBuffer();
  await assert.rejects(optimizeImage(huge), /pixel limit/);
});

test('S3 upload writes real WebP with correct extension, MIME and cache policy', async () => {
  for (const [key, value] of Object.entries({ S3_ENDPOINT: 'https://storage.test', S3_BUCKET: 'test', S3_ACCESS_KEY_ID: 'test', S3_SECRET_ACCESS_KEY: 'test', S3_PUBLIC_BASE_URL: 'https://images.test', S3_PREFIX: 'test-images' })) process.env[key] = value;
  const { storage } = await import('./storage.js');
  const { uploadFileToS3, uploadFilesToS3 } = await import('./scripts/uploadFileToS3.js');
  const sent: any[] = [];
  const send = storage.send;
  storage.send = (async (command: any) => { sent.push(command.input); return {}; }) as typeof send;
  try {
    const buffer = await sharp({ create: { width: 30, height: 20, channels: 4, background: '#ffffff80' } }).png().toBuffer();
    const file = { buffer, mimetype: 'image/png' } as Express.Multer.File;
    const url = await uploadFileToS3(file);
    assert.match(url, /^https:\/\/images.test\/test-images\/.*\.webp$/);
    assert.equal(sent[0].ContentType, 'image/webp');
    assert.equal(sent[0].CacheControl, 'public, max-age=31536000, immutable');
    assert.equal((await sharp(sent[0].Body).metadata()).format, 'webp');
    sent.length = 0;
    await assert.rejects(uploadFilesToS3([file, { ...file, buffer: Buffer.from('bad') }]));
    assert.equal(sent.length, 2);
    assert.equal(sent[1].Key, sent[0].Key); // Successful sibling upload cleaned up.
    assert.equal(sent[1].Body, undefined);
  } finally { storage.send = send; storage.destroy(); }
});
