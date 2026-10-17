import { Coordinates, CalculationMethod, PrayerTimes, Qibla } from 'adhan';
import type { PrayerName, PrayerTimeItem } from '../types/prayer';

export interface CalculatedPrayerData {
  prayers: PrayerTimeItem[];
  nextPrayer: PrayerTimeItem | null;
  currentPrayer: PrayerTimeItem | null;
  timeRemainingSeconds: number;
  formattedCountdown: string;
  progressPercent: number;
  qiblaDirection: number;
  hijriDate: {
    day: number;
    month: string;
    monthArabic: string;
    year: number;
    formatted: string;
  };
}

const HIJRI_MONTHS = [
  { id: 'Muharram', ar: 'مُحَرَّم' },
  { id: 'Safar', ar: 'صَفَر' },
  { id: "Rabi'ul Awwal", ar: 'رَبِيع الأَوَّل' },
  { id: "Rabi'ul Akhir", ar: 'رَبِيع الآخِر' },
  { id: 'Jumadil Awwal', ar: 'جُمَادَى الأُولَى' },
  { id: 'Jumadil Akhir', ar: 'جُمَادَى الآخِرَة' },
  { id: 'Rajab', ar: 'رَجَب' },
  { id: "Sya'ban", ar: 'شَعْبَان' },
  { id: 'Ramadhan', ar: 'رَمَضَان' },
  { id: 'Syawwal', ar: 'شَوَّال' },
  { id: "Dzulqa'dah", ar: 'ذُو القَعْدَة' },
  { id: 'Dzulhijjah', ar: 'ذُو الحِجَّة' },
];

/**
 * Approximate Hijri Date using astronomical calculation with custom offset
 */
export function getHijriDate(date: Date = new Date(), adjustmentDays: number = 0) {
  const adjustedDate = new Date(date.getTime() + adjustmentDays * 86400000);
  
  // Standard Kuwaiti / Ummul Qura algorithm approximation
  const day = adjustedDate.getDate();
  const month = adjustedDate.getMonth();
  const year = adjustedDate.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  
  const z = jd - 1948439.5;
  const cyc = Math.floor(z / 10631);
  const rem = z - cyc * 10631;
  const j = Math.floor((rem + 0.5) / 354.366);
  const yH = cyc * 30 + j + 1;
  const remDays = rem - Math.floor(j * 354.366);
  const mH = Math.min(11, Math.floor((remDays + 1) / 29.5));
  const dH = Math.max(1, Math.min(30, Math.floor(remDays - Math.floor(mH * 29.5) + 1)));

  const monthObj = HIJRI_MONTHS[mH] || HIJRI_MONTHS[0];

  return {
    day: dH,
    month: monthObj.id,
    monthArabic: monthObj.ar,
    year: yH,
    formatted: `${dH} ${monthObj.id} ${yH} H`
  };
}

export function formatTwoDigits(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatTimeHHMM(d: Date): string {
  return `${formatTwoDigits(d.getHours())}:${formatTwoDigits(d.getMinutes())}`;
}

/**
 * Calculates prayer times using Indonesian Ministry of Religious Affairs (Kemenag RI) standards:
 * - Subuh angle: 20 degrees
 * - Isya angle: 18 degrees
 * - Asr shadow: Shafi'i (1x)
 * - Ikhtiyat (safety margin): +2 minutes
 * - Imsak: Subuh - 10 minutes
 * - Dhuha: Syuruq + 20 minutes
 */
export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  targetDate: Date = new Date(),
  hijriAdjustment: number = 0
): CalculatedPrayerData {
  const coords = new Coordinates(latitude, longitude);

  // Kemenag configuration
  const params = CalculationMethod.Singapore();
  params.fajrAngle = 20;
  params.ishaAngle = 18;
  params.adjustments.fajr = 2;
  params.adjustments.dhuhr = 2;
  params.adjustments.asr = 2;
  params.adjustments.maghrib = 2;
  params.adjustments.isha = 2;

  const ptToday = new PrayerTimes(coords, targetDate, params);

  // Next day prayers for midnight wrap-around
  const tomorrow = new Date(targetDate);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const ptTomorrow = new PrayerTimes(coords, tomorrow, params);

  // Derived times
  // Imsak = Subuh - 10 minutes
  const imsakDate = new Date(ptToday.fajr.getTime() - 10 * 60000);
  const imsakTomorrow = new Date(ptTomorrow.fajr.getTime() - 10 * 60000);

  // Dhuha = Syuruq + 20 minutes
  const dhuhaDate = new Date(ptToday.sunrise.getTime() + 20 * 60000);

  const now = new Date();
  const isToday =
    targetDate.getFullYear() === now.getFullYear() &&
    targetDate.getMonth() === now.getMonth() &&
    targetDate.getDate() === now.getDate();

  const currentTime = now.getTime();

  const rawPrayers: { id: PrayerName; name: string; arabicName: string; date: Date; canPlayAdzan: boolean }[] = [
    { id: 'imsak', name: 'Imsak', arabicName: 'الإمساك', date: imsakDate, canPlayAdzan: false },
    { id: 'fajr', name: 'Subuh', arabicName: 'الفجر', date: ptToday.fajr, canPlayAdzan: true },
    { id: 'sunrise', name: 'Terbit', arabicName: 'الشروق', date: ptToday.sunrise, canPlayAdzan: false },
    { id: 'dhuha', name: 'Dhuha', arabicName: 'الضحى', date: dhuhaDate, canPlayAdzan: false },
    { id: 'dhuhr', name: 'Dzuhur', arabicName: 'الظهر', date: ptToday.dhuhr, canPlayAdzan: true },
    { id: 'asr', name: 'Ashar', arabicName: 'العصر', date: ptToday.asr, canPlayAdzan: true },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', date: ptToday.maghrib, canPlayAdzan: true },
    { id: 'isha', name: 'Isya', arabicName: 'العشاء', date: ptToday.isha, canPlayAdzan: true },
  ];

  // Determine which is next and which is current
  let nextPrayerItem: { id: PrayerName; name: string; arabicName: string; date: Date; canPlayAdzan: boolean } | null = null;
  let currentPrayerItem: { id: PrayerName; name: string; arabicName: string; date: Date; canPlayAdzan: boolean } | null = null;

  if (isToday) {
    for (let i = 0; i < rawPrayers.length; i++) {
      if (rawPrayers[i].date.getTime() > currentTime) {
        nextPrayerItem = rawPrayers[i];
        currentPrayerItem = i > 0 ? rawPrayers[i - 1] : { id: 'isha', name: 'Isya (Kemarin)', arabicName: 'العشاء', date: new Date(ptToday.fajr.getTime() - 6 * 3600000), canPlayAdzan: true };
        break;
      }
    }

    // After Isya tonight -> next is Tomorrow's Imsak/Subuh
    if (!nextPrayerItem) {
      nextPrayerItem = { id: 'imsak', name: 'Imsak', arabicName: 'الإمساك', date: imsakTomorrow, canPlayAdzan: false };
      currentPrayerItem = rawPrayers[rawPrayers.length - 1]; // Isya
    }
  } else {
    // If viewing another date, default next to Subuh
    nextPrayerItem = rawPrayers[1];
    currentPrayerItem = rawPrayers[0];
  }

  // Calculate countdown and progress
  let timeRemainingSeconds = 0;
  let progressPercent = 0;

  if (nextPrayerItem && isToday) {
    timeRemainingSeconds = Math.max(0, Math.floor((nextPrayerItem.date.getTime() - currentTime) / 1000));
    
    if (currentPrayerItem) {
      const totalSpan = nextPrayerItem.date.getTime() - currentPrayerItem.date.getTime();
      const elapsed = currentTime - currentPrayerItem.date.getTime();
      if (totalSpan > 0) {
        progressPercent = Math.min(100, Math.max(0, Math.round((elapsed / totalSpan) * 100)));
      }
    }
  }

  const hours = Math.floor(timeRemainingSeconds / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;
  const formattedCountdown = `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;

  const prayers: PrayerTimeItem[] = rawPrayers.map((p) => {
    const isPassed = isToday ? p.date.getTime() <= currentTime : false;
    const isNext = nextPrayerItem ? nextPrayerItem.id === p.id && isToday : false;
    const isCurrent = currentPrayerItem ? currentPrayerItem.id === p.id && isToday : false;

    return {
      id: p.id,
      name: p.name,
      arabicName: p.arabicName,
      time: formatTimeHHMM(p.date),
      date: p.date,
      isPassed,
      isNext,
      isCurrent,
      canPlayAdzan: p.canPlayAdzan,
    };
  });

  const nextPrayerResult = prayers.find((p) => p.isNext) || prayers[1];
  const currentPrayerResult = prayers.find((p) => p.isCurrent) || prayers[0];

  const qibla = Math.round(Qibla(coords) * 10) / 10;
  const hijri = getHijriDate(targetDate, hijriAdjustment);

  return {
    prayers,
    nextPrayer: nextPrayerResult,
    currentPrayer: currentPrayerResult,
    timeRemainingSeconds,
    formattedCountdown,
    progressPercent,
    qiblaDirection: qibla,
    hijriDate: hijri,
  };
}
