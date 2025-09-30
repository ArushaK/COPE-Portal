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
