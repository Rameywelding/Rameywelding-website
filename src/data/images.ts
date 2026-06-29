import type { ImageMetadata } from 'astro';

// ── HERO IMAGE ───────────────────────────────────────────────────────────────
// Drop ONE photo into src/assets/hero/ and it becomes the hero background.
// If the folder is empty, the hero falls back to a styled steel gradient.
const heroModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/hero/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);
const heroEntries = Object.entries(heroModules).sort(([a], [b]) => a.localeCompare(b));
export const heroImage: ImageMetadata | null = heroEntries[0]?.[1].default ?? null;

// ── GALLERY ──────────────────────────────────────────────────────────────────
// Drop any number of photos into src/assets/gallery/ — they fill the gallery
// grid automatically, sorted by filename (prefix 01-, 02- to control order).
const galleryModules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}',
  { eager: true },
);
export const galleryImages: ImageMetadata[] = Object.entries(galleryModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, mod]) => mod.default);
