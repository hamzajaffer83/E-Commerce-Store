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
