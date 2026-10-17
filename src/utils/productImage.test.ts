import { productImageUrl } from './productImage';

test('keeps external image URLs intact and resolves existing uploads against the API', () => {
  vi.stubEnv('VITE_API_URL', 'https://api.example.com/');
  try {
    expect(productImageUrl('https://images.example.com/backpack.webp')).toBe('https://images.example.com/backpack.webp');
    expect(productImageUrl('/uploads/existing.jpg')).toBe('https://api.example.com/uploads/existing.jpg');
  } finally { vi.unstubAllEnvs(); }
});
