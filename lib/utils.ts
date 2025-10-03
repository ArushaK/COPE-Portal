import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const countryNameToIsoMap: Record<string, string> = {
  USA: 'US',
  UK: 'GB',
  Germany: 'DE',
  India: 'IN',
  UAE: 'AE',
  Japan: 'JP',
  Brazil: 'BR',
  Canada: 'CA',
}

export function countryToFlag(countryName: string): string {
  const iso = (countryNameToIsoMap[countryName] || countryName).toUpperCase()
  // Expect ISO-2. Convert to regional indicators
  if (iso.length !== 2) return '🏳️'
  const codePoints = [...iso].map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

export function countryToFlagPath(countryName: string): string {
  // Normalize to lowercase hyphen/space insensitive filenames
  const normalized = countryName
    .toLowerCase()
    .replace(/[^a-z]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  // Prefer ISO code filename if present in map
  const iso = (countryNameToIsoMap[countryName] || '').toLowerCase()
  return iso ? `/flag/${iso}.png` : `/flag/${normalized}.png`
}

// Currency utilities
export const currencyRates: Record<string, number> = {
  USD: 1,      // base
  EUR: 0.92,
  GBP: 0.78,
  CHF: 0.91,
  AED: 3.67,
  INR: 83.0,
  CAD: 1.34,
  AUD: 1.52,
  CNY: 7.25,
}

export type CurrencyCode = keyof typeof currencyRates

export function convertFromUSD(amountUSD: number, to: CurrencyCode): number {
  const rate = currencyRates[to] || 1
  return amountUSD * rate
}

export function convertToUSD(amount: number, from: CurrencyCode): number {
  const rate = currencyRates[from] || 1
  return amount / rate
}

export function formatCurrency(amount: number, code: CurrencyCode): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(amount)
  } catch {
    const symbol = code === 'USD' ? '$' : code + ' '
    return `${symbol}${amount.toFixed(2)}`
  }
}

const cityToGlyphMap: Record<string, string> = {
  'New York': '🗽',
  'San Francisco': '🌉',
  Chicago: '🌬️',
  Austin: '🎸',
  Seattle: '🌧️',
  London: '🎡',
  Manchester: '⚽',
  Birmingham: '🏭',
  Berlin: '🦅',
  Munich: '🍺',
  Frankfurt: '🏦',
  Mumbai: '🌅',
  Bengaluru: '💻',
  Delhi: '🏰',
  Dubai: '🏙️',
  'Abu Dhabi': '🕌',
  Tokyo: '🗼',
  Osaka: '🎏',
  'Sao Paulo': '🌆',
  'Rio de Janeiro': '⛰️',
  Toronto: '🧊',
  Vancouver: '🌲',
}

export function cityToIcon(city: string): string {
  return cityToGlyphMap[city] || '🏙️'
}
