export type ServiceStatus = 'ok' | 'bald' | 'ueberfaellig';

export interface HistoryEntry {
  date: string;
  km: number;
  type: string;
  workshop?: string;
}

export interface Vehicle {
  model: string;
  plate: string;
  bodyType: string;      // Karosserietyp
  fuel: string;          // Kraftstoff
  transmission: string;  // Getriebeart
  powerPs: number;       // Leistung in PS
  currentKm: number;
  lastServiceKm: number;
  serviceIntervalKm: number;
  lastServiceDate: string;
  serviceIntervalMonths: number;
  oil: string;
  filters: string;
  isHuk: boolean;
  history: HistoryEntry[];
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
  nextServiceKm: number;
  nextServiceDate: Date;
}

export const VIN_PARAM = 'vin';

export const FLEET: Record<string, Vehicle> = {
  'WVWZZZ1TZJW012345': {
    model: 'VW Golf VIII',
    plate: 'MK-AB 1234',
    bodyType: 'Schrägheck',
    fuel: 'Benzin',
    transmission: 'DSG 7-Gang',
    powerPs: 150,
    currentKm: 48_500,
    lastServiceKm: 47_000,
    serviceIntervalKm: 15_000,
    lastServiceDate: '2025-07-01',
    serviceIntervalMonths: 12,
    oil: '5W-30 LL',
    filters: 'Luft, Öl, Innenraum',
    isHuk: true,
    history: [
      { date: '2025-07-01', km: 47_000, type: 'Inspektion + Ölwechsel',      workshop: 'Pitstop Coburg' },
      { date: '2024-06-15', km: 32_000, type: 'Ölwechsel',                   workshop: 'Pitstop Coburg' },
      { date: '2023-05-20', km: 17_000, type: 'Inspektion + Reifenwechsel',  workshop: 'VW Autohaus Mayer' },
    ],
  },
  'WBA8E3100GK123456': {
    model: 'BMW 3er Touring',
    plate: 'CO-BM 4321',
    bodyType: 'Kombi',
    fuel: 'Benzin',
    transmission: 'Automatik 8-Gang',
    powerPs: 258,
    currentKm: 34_000,
    lastServiceKm: 25_000,
    serviceIntervalKm: 20_000,
    lastServiceDate: '2026-01-15',
    serviceIntervalMonths: 24,
    oil: '0W-30 LL',
    filters: 'Luft, Öl, Innenraum',
    isHuk: false,
    history: [
      { date: '2026-01-15', km: 25_000, type: 'Inspektion + Ölwechsel', workshop: 'BMW Autohaus Kern' },
      { date: '2024-01-10', km: 8_000,  type: 'Erstinspektion',          workshop: 'BMW Autohaus Kern' },
    ],
  },
  'WAUZZZ8KZFA654321': {
    model: 'Audi A6 Avant',
    plate: 'IN-AU 9876',
    bodyType: 'Kombi',
    fuel: 'Diesel',
    transmission: 'Automatik 7-Gang',
    powerPs: 204,
    currentKm: 61_200,
    lastServiceKm: 55_000,
    serviceIntervalKm: 15_000,
    lastServiceDate: '2026-02-20',
    serviceIntervalMonths: 12,
    oil: '5W-40',
    filters: 'Luft, Öl',
    isHuk: true,
    history: [
      { date: '2026-02-20', km: 55_000, type: 'Ölwechsel',               workshop: 'Pitstop Ingolstadt' },
      { date: '2025-02-15', km: 40_000, type: 'Inspektion + Ölwechsel',  workshop: 'Pitstop Ingolstadt' },
      { date: '2024-01-20', km: 25_000, type: 'Ölwechsel',               workshop: 'Audi Zentrum Ingolstadt' },
      { date: '2023-01-08', km: 10_000, type: 'Erstinspektion',          workshop: 'Audi Zentrum Ingolstadt' },
    ],
  },
  'WDD2040011A987654': {
    model: 'Mercedes C-Klasse',
    plate: 'S-MB 7001',
    bodyType: 'Limousine',
    fuel: 'Diesel',
    transmission: 'Automatik 9-Gang',
    powerPs: 200,
    currentKm: 112_000,
    lastServiceKm: 93_000,
    serviceIntervalKm: 15_000,
    lastServiceDate: '2024-03-10',
    serviceIntervalMonths: 12,
    oil: '5W-30 MB 229.5',
    filters: 'Luft, Öl, Kraftstoff, Innenraum',
    isHuk: false,
    history: [
      { date: '2024-03-10', km: 93_000, type: 'Inspektion + Ölwechsel',       workshop: 'Pitstop Stuttgart' },
      { date: '2023-03-05', km: 78_000, type: 'Inspektion + Bremsencheck',    workshop: 'Mercedes-Benz Autohaus' },
      { date: '2022-02-18', km: 63_000, type: 'Großinspektion + Zahnriemen',  workshop: 'Mercedes-Benz Autohaus' },
      { date: '2021-01-14', km: 48_000, type: 'Ölwechsel + Reifenwechsel',    workshop: 'Pitstop Stuttgart' },
    ],
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
  const nextServiceKm = v.lastServiceKm + v.serviceIntervalKm;
  const kmLeft = nextServiceKm - v.currentKm;

  const lastDate = new Date(v.lastServiceDate);
  const nextServiceDate = new Date(lastDate);
  nextServiceDate.setMonth(nextServiceDate.getMonth() + v.serviceIntervalMonths);
  const daysLeft = Math.round((nextServiceDate.getTime() - Date.now()) / 86_400_000);

  const byKm: ServiceStatus   = kmLeft < 0   ? 'ueberfaellig' : kmLeft < 2_000 ? 'bald' : 'ok';
  const byDate: ServiceStatus = daysLeft < 0 ? 'ueberfaellig' : daysLeft < 30  ? 'bald' : 'ok';

  const rank: Record<ServiceStatus, number> = { ok: 0, bald: 1, ueberfaellig: 2 };
  const status: ServiceStatus = rank[byKm] >= rank[byDate] ? byKm : byDate;

  return { status, kmLeft, daysLeft, nextServiceKm, nextServiceDate };
}
