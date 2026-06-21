import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTanggalIndonesia(tanggal: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date(tanggal));
}

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
}

export function formatTime(datetime: string) {
  const a = datetime.split('T')[1].split(':');
  return `${a[0]}:${a[1]}`;
}

function nowWIBTimestamp() {
  const now = Date.now();
  const offset = 7 * 60 * 60 * 1000; // +7 jam

  return now + offset;
}

export function calculateProgress(waktuMulai: string, waktuSelesai: string): number {
  const start = new Date(waktuMulai).getTime();
  const end = new Date(waktuSelesai).getTime();
  const now = nowWIBTimestamp();
  // console.log(now);

  if (now <= start) return 0;
  if (now >= end) return 100;
  const result = ((now - start) / (end - start)) * 100;
  return result;
}

// 20/06/2026
export function getTodaysDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export function timeToDateTime(date: string, time: string) {
  return `${date}T${time}:00Z`;
}
