import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatCurrency(value: any): string {
  return currencyFormatter.format(Number(value));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatPercent(value: any): string {
  return `${(Number(value) * 100).toFixed(1)}%`;
}
