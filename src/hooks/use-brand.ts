/**
 * Returns Quotable's active brand palette (warm paper in light, ink in dark),
 * following the device color scheme. Terracotta accent is constant across both.
 */
import { Palette, type BrandPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useBrand(): BrandPalette {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Palette.dark : Palette.light;
}
