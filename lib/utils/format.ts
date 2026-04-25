import { format } from "date-fns";

export function formatDate(value: string | Date): string {
  return format(new Date(value), "MMM d, yyyy");
}

export function formatNumber(value: number, digits = 2): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}
