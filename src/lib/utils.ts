import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getOrdinal(n: number): string {
  if (n >= 11 && n <= 13) {
    return n + "th";
  }

  switch (n % 10) {
    case 1:
      return n + "st";
    case 2:
      return n + "nd";
    case 3:
      return n + "rd";
    default:
      return n + "th";
  }
}

/**
 * Returns the number and suffix parts of an ordinal number
 */
export function getOrdinalParts(n: number): { num: number; suffix: string } {
  if (n >= 11 && n <= 13) {
    return { num: n, suffix: "th" };
  }

  switch (n % 10) {
    case 1:
      return { num: n, suffix: "st" };
    case 2:
      return { num: n, suffix: "nd" };
    case 3:
      return { num: n, suffix: "rd" };
    default:
      return { num: n, suffix: "th" };
  }
}
