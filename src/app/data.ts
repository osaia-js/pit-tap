export type ServiceStatus = 'ok' | 'bald' | 'ueberfaellig';

export interface Vehicle {
  model: string;
  plate: string;
  currentKm: number;
  lastServiceKm: number;
  serviceIntervalKm: number;
  lastServiceDate: string;
  serviceIntervalMonths: number;
  oil: string;
  filters: string;
  isHuk: boolean;
}

export interface ServiceItem {
  key: string;
  title: string;
  sub: string;
  from: number; // Cent
  recommend: boolean;
  icon: string;
}

export interface StatusResult {
  status: ServiceStatus;
  kmLeft: number;
  daysLeft: number;
}

// Query-Parameter-Name wie auf den NFC-Chips programmiert
export const VIN_PARAM = 'vin';

export const FLEET: Record<string, Vehicle> = {
  'WVWZZZ1TZJW012345': {
    model: 'VW Golf VIII',
    plate: 'MK-AB 1234',
    currentKm: 48_500,
    lastServiceKm: 47_000,
    serviceIntervalKm: 15_000,
    lastServiceDate: '2025-07-01',
    serviceIntervalMonths: 12,
    oil: '5W-30 LL',
    filters: 'Luft, Öl, Innenraum',
    isHuk: true,
  },
  'WBA8E3100GK123456': {
    model: 'BMW 3er Touring',
    plate: 'CO-BM 4321',
    currentKm: 34_000,
    lastServiceKm: 25_000,
    serviceIntervalKm: 20_000,
    lastServiceDate: '2026-01-15',
    serviceIntervalMonths: 24,
    oil: '0W-30 LL',
    filters: 'Luft, Öl, Innenraum',
    isHuk: false,
  },
  'WAUZZZ8KZFA654321': {
    model: 'Audi A6 Avant',
    plate: 'IN-AU 9876',
    currentKm: 61_200,
    lastServiceKm: 55_000,
    serviceIntervalKm: 15_000,
    lastServiceDate: '2026-02-20',
    serviceIntervalMonths: 12,
    oil: '5W-40',
    filters: 'Luft, Öl',
    isHuk: true,
  },
  'WDD2040011A987654': {
    model: 'Mercedes C-Klasse',
    plate: 'S-MB 7001',
    currentKm: 112_000,
    lastServiceKm: 93_000,
    serviceIntervalKm: 15_000,
    lastServiceDate: '2024-03-10',
    serviceIntervalMonths: 12,
    oil: '5W-30 MB 229.5',
    filters: 'Luft, Öl, Kraftstoff, Innenraum',
    isHuk: false,
  },
};

export const SERVICES: ServiceItem[] = [
  { key: 'oel',        title: 'Ölwechsel',    sub: 'inkl. Ölfilter',             from: 4990,  recommend: true,  icon: '🛢' },
  { key: 'inspektion', title: 'Inspektion',    sub: 'Sichtprüfung + alle Filter', from: 12990, recommend: true,  icon: '🔧' },
  { key: 'bremsen',    title: 'Bremsencheck',  sub: 'Bremsbeläge & Scheiben',     from: 2990,  recommend: false, icon: '🔴' },
  { key: 'reifen',     title: 'Reifenwechsel', sub: 'Montage + Auswuchten',       from: 5990,  recommend: false, icon: '⚙️' },
];

export const PITSTOP_BASE = 'https://www.pitstop.de/termin';
export const HUK_DISCOUNT = 0.1;

export function computeStatus(v: Vehicle): StatusResult {
  const kmLeft = v.lastServiceKm + v.serviceIntervalKm - v.currentKm;

  const lastDate = new Date(v.lastServiceDate);
  const nextDate = new Date(lastDate);
  nextDate.setMonth(nextDate.getMonth() + v.serviceIntervalMonths);
  const daysLeft = Math.round((nextDate.getTime() - Date.now()) / 86_400_000);

  const byKm: ServiceStatus = kmLeft < 0 ? 'ueberfaellig' : kmLeft < 2_000 ? 'bald' : 'ok';
  const byDate: ServiceStatus = daysLeft < 0 ? 'ueberfaellig' : daysLeft < 30 ? 'bald' : 'ok';

  const rank: Record<ServiceStatus, number> = { ok: 0, bald: 1, ueberfaellig: 2 };
  const status: ServiceStatus = rank[byKm] >= rank[byDate] ? byKm : byDate;

  return { status, kmLeft, daysLeft };
}
