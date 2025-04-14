/**
 * Utility functions for data export and formatting
 */

/**
 * Convert data to CSV format and trigger download
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download (without extension)
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (!data || !data.length) {
    console.warn('No data to export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        headers.map(header => {
          const cell = row[header];
          // Handle special cases and formatting
          if (cell === null || cell === undefined) {
            return '';
          }
          if (typeof cell === 'string' && cell.includes(',')) {
            return `"${cell}"`;
          }
          if (cell instanceof Date) {
            return cell.toISOString();
          }
          return cell;
        }).join(',')
      )
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    // Handle browser specifics
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, `${filename}.csv`);
    } else {
      // Other browsers
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `${filename}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw new Error('Failed to export data to CSV');
  }
};

/**
 * Format currency values
 * @param value Number to format as currency
 * @param currency Currency code (default: USD)
 */
export const formatCurrency = (value: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
};

/**
 * Format date to local string
 * @param date Date to format
 * @param options Intl.DateTimeFormatOptions
 */
export const formatDate = (
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', options);
};

/**
 * Format number with thousands separator
 * @param value Number to format
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Calculate percentage and format it
 * @param value Current value
 * @param total Total value
 * @param decimals Number of decimal places
 */
export const calculatePercentage = (
  value: number,
  total: number,
  decimals: number = 1
): string => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(decimals)}%`;
};

/**
 * Format file size in bytes to human readable format
 * @param bytes File size in bytes
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text to specified length
 * @param text Text to truncate
 * @param length Maximum length
 * @param suffix Suffix to add to truncated text
 */
export const truncateText = (
  text: string,
  length: number = 50,
  suffix: string = '...'
): string => {
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length) + suffix;
};

/**
 * Generate a random ID
 * @param length Length of the ID
 */
export const generateId = (length: number = 8): string => {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
};

/**
 * Deep clone an object
 * @param obj Object to clone
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Compare two objects for equality
 * @param obj1 First object
 * @param obj2 Second object
 */
export const isEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Debounce a function
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};