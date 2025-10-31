/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return date.toLocaleDateString('es-ES', options);
};

/**
 * Format runtime in minutes to hours and minutes
 */
export const formatRuntime = (minutes: number): string => {
  if (!minutes) return 'N/A';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  
  return `${hours}h ${mins}m`;
};

/**
 * Format number to compact notation (e.g., 1.2M, 5.3K)
 */
export const formatNumber = (num: number): string => {
  if (!num) return '0';
  
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  
  return num.toString();
};

/**
 * Format vote average to one decimal
 */
export const formatVoteAverage = (vote: number): string => {
  if (!vote) return '0.0';
  return vote.toFixed(1);
};

/**
 * Format currency (USD)
 */
export const formatCurrency = (amount: number): string => {
  if (!amount) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
