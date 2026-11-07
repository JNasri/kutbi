import sharp from 'sharp';

/** Keep display resolution and transparency; normalize camera orientation. */
export async function optimizeImage(input: Buffer): Promise<Buffer> {
  return sharp(input, { limitInputPixels: 40_000_000, animated: true })
    .rotate()
    .webp({ quality: 85, alphaQuality: 100, effort: 5 })
    .toBuffer();
}
