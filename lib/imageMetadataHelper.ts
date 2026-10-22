import imageMetadata from "@/lib/imageMetadata.json";

export interface ImageMetadataEntry {
  slug: string;
  src: string;
  width: number;
  height: number;
  aspectRatio: number;
  blurDataUrl: string;
  dominantColor: string;
  accentLight: string;
  accentDark: string;
}

const metadataMap = imageMetadata as Record<string, ImageMetadataEntry>;

export function getImageMetadata(slugOrSrc?: string): ImageMetadataEntry | undefined {
  if (!slugOrSrc) return undefined;
  if (metadataMap[slugOrSrc]) {
    return metadataMap[slugOrSrc];
  }
  return Object.values(metadataMap).find((entry) => entry.src === slugOrSrc);
}
