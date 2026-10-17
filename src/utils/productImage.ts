/** Uploaded paths belong to the API; externally hosted images keep their URL. */
export function productImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) return image;
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  return `${base}/${image.replace(/^\/+/, '')}`;
}
