import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const truncateWords = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(' ') + '...'
        : text;
};

/**
 * Converts a UTC timestamp string (ISO 8601) to a formatted local time string.
 * @param utcString - UTC time string in ISO 8601 format, e.g., "2025-07-08T11:05:18.000000Z"
 * @param locale - Optional locale for formatting (default is system locale)
 * @returns Local time string in "YYYY-MM-DD HH:mm:ss" format
 */
export function convertUtcToLocal(utcString: string, locale?: string): string {
  // Clean up microseconds to ensure compatibility with JS Date
  const fixedString = utcString.replace(/\.\d{6}Z$/, "Z");

  const utcDate = new Date(fixedString);
  if (isNaN(utcDate.getTime())) {
    throw new Error("Invalid UTC date string");
  }

  const pad = (n: number): string => n.toString().padStart(2, '0');

  // You could return a localized string with toLocaleString instead:
  // return utcDate.toLocaleString(locale);

  // Custom format: "YYYY-MM-DD HH:mm:ss"
  return `${utcDate.getFullYear()}-${pad(utcDate.getMonth() + 1)}-${pad(utcDate.getDate())} ` +
         `${pad(utcDate.getHours())}:${pad(utcDate.getMinutes())}:${pad(utcDate.getSeconds())}`;
}

/**
 * Converts a UTC timestamp string (ISO 8601) to a formatted local time string.
 * @param utcString - UTC time string in ISO 8601 format, e.g., "2025-07-08T11:05:18.000000Z"
 * @param locale - Optional locale for formatting (default is system locale)
 * @returns Local time string in "YYYY-MM-DD" format
 */
export function convertUtcToLocalDate(utcString: string, locale?: string): string {
  // Clean up microseconds to ensure compatibility with JS Date
  const fixedString = utcString.replace(/\.\d{6}Z$/, "Z");

  const utcDate = new Date(fixedString);
  if (isNaN(utcDate.getTime())) {
    throw new Error("Invalid UTC date string");
  }

  const pad = (n: number): string => n.toString().padStart(2, '0');

  // You could return a localized string with toLocaleString instead:
  // return utcDate.toLocaleString(locale);

  // Custom format: "YYYY-MM-DD HH:mm:ss"
  return `${utcDate.getFullYear()}-${pad(utcDate.getMonth() + 1)}-${pad(utcDate.getDate())} `
}