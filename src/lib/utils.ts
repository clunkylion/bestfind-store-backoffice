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

type Numeric = number | string | { toString(): string };

// Convert Prisma Decimal objects to plain numbers for Client Component serialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data, (_key, value) =>
    value !== null && typeof value === "object" && typeof value.toNumber === "function"
      ? value.toNumber()
      : value
  ));
}

export function formatCurrency(value: Numeric): string {
  return currencyFormatter.format(Number(value));
}

export function formatPercent(value: Numeric): string {
  return `${(Number(value) * 100).toFixed(1)}%`;
}
