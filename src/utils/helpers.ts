import { API_CONFIG } from './constants';

/**
 * Get full image URL from TMDB path
 */
export const getImageUrl = (
  path: string | null,
  size: 'small' | 'medium' | 'large' | 'original' = 'medium',
  type: 'poster' | 'backdrop' | 'profile' = 'poster'
): string => {
  if (!path) return '/placeholder-image.png';

  const sizeMap = {
    poster: API_CONFIG.IMAGE_SIZES.POSTER,
    backdrop: API_CONFIG.IMAGE_SIZES.BACKDROP,
    profile: API_CONFIG.IMAGE_SIZES.PROFILE,
  };

  const sizeKey = {
    small: 'SMALL',
    medium: 'MEDIUM',
    large: 'LARGE',
    original: 'ORIGINAL',
  };

  const imageSize = sizeMap[type][sizeKey[size] as keyof typeof sizeMap[typeof type]];

  return `${API_CONFIG.IMAGE_BASE_URL}/${imageSize}${path}`;
};

/**
 * Get YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (videoKey: string): string => {
  return `https://img.youtube.com/vi/${videoKey}/hqdefault.jpg`;
};

/**
 * Get YouTube video URL
 */
export const getYouTubeUrl = (videoKey: string): string => {
  return `https://www.youtube.com/watch?v=${videoKey}`;
};

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number = 150): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Get route with params
 */
export const getRoute = (route: string, params: Record<string, string | number>): string => {
  let finalRoute = route;
  
  Object.entries(params).forEach(([key, value]) => {
    finalRoute = finalRoute.replace(`:${key}`, String(value));
  });
  
  return finalRoute;
};
