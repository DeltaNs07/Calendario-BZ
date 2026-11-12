import { TimeZoneOption } from '../types/clan';

export const TIMEZONE_OPTIONS: TimeZoneOption[] = [
  { code: 'CO', country: 'Colombia', city: 'Bogotá', flag: '🇨🇴', tz: 'America/Bogota', utcOffset: 'UTC-5' },
  { code: 'MX', country: 'México', city: 'CDMX', flag: '🇲🇽', tz: 'America/Mexico_City', utcOffset: 'UTC-6' },
  { code: 'PE', country: 'Perú', city: 'Lima', flag: '🇵🇪', tz: 'America/Lima', utcOffset: 'UTC-5' },
  { code: 'AR', country: 'Argentina', city: 'Buenos Aires', flag: '🇦🇷', tz: 'America/Argentina/Buenos_Aires', utcOffset: 'UTC-3' },
  { code: 'CL', country: 'Chile', city: 'Santiago', flag: '🇨🇱', tz: 'America/Santiago', utcOffset: 'UTC-3' },
  { code: 'VE', country: 'Venezuela', city: 'Caracas', flag: '🇻🇪', tz: 'America/Caracas', utcOffset: 'UTC-4' },
  { code: 'ES', country: 'España', city: 'Madrid', flag: '🇪🇸', tz: 'Europe/Madrid', utcOffset: 'UTC+1' },
  { code: 'US_ET', country: 'EE.UU. (Este)', city: 'Miami / NY', flag: '🇺🇸', tz: 'America/New_York', utcOffset: 'UTC-5' },
];

export function formatMatchTime(isoDate: string, timeZone: string) {
  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      return { formattedTime: '--:--', formattedDate: 'Fecha inválida', fullString: '--:--' };
    }
    const timeFormatter = new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone,
    });
    const dateFormatter = new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone,
    });
    const formattedTime = timeFormatter.format(date);
    const formattedDate = dateFormatter.format(date);
    return { formattedTime, formattedDate, fullString: `${formattedDate} · ${formattedTime}` };
  } catch {
    return { formattedTime: '--:--', formattedDate: 'Error', fullString: '--:--' };
  }
}

export function getWorldMatchTimes(isoDate: string) {
  return TIMEZONE_OPTIONS.map((tz) => {
    const formatted = formatMatchTime(isoDate, tz.tz);
    return {
      ...tz,
      time: formatted.formattedTime,
      date: formatted.formattedDate,
    };
  });
}

export function getCountdown(isoDate: string) {
  const diff = new Date(isoDate).getTime() - Date.now();
  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      isLive: Math.abs(diff) / 3600000 < 2.5,
      totalSeconds: 0,
    };
  }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    isPast: false,
    isLive: false,
    totalSeconds: Math.floor(diff / 1000),
  };
}
