import { FormSubmission } from '../types';

const STORAGE_KEY = 'gulab_forms_submissions_v1';

export function getStoredSubmissions(): FormSubmission[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading submissions from localStorage:', err);
    return [];
  }
}

export function saveSubmission(submission: Omit<FormSubmission, 'id' | 'submittedAt' | 'tokenNumber'>): FormSubmission {
  const all = getStoredSubmissions();
  
  const tokenNumber = 'GLB-' + Math.floor(100000 + Math.random() * 900000);
  const newEntry: FormSubmission = {
    ...submission,
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    submittedAt: new Date().toISOString(),
    tokenNumber,
  };

  const updated = [newEntry, ...all];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }

  // Dispatch custom event for real-time tab updates
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gulab_submissions_updated'));
  }

  return newEntry;
}

export function deleteSubmission(id: string): void {
  const all = getStoredSubmissions();
  const updated = all.filter(s => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete from localStorage:', err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gulab_submissions_updated'));
  }
}

export function clearAllSubmissions(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear localStorage:', err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gulab_submissions_updated'));
  }
}

export function seedDemoSubmissions(): void {
  const sampleData: FormSubmission[] = [
    {
      id: 'sub_demo_1',
      fullName: 'Aarav Sharma (आरव शर्मा)',
      contact: '+91 98765 43210',
      category: 'greeting',
      roseMood: 'red-rose',
      roseRating: 5,
      message: 'गुलाब के फूलों की तरह आपकी खिदमत और ये खूबसूरत फॉर्म दिल को छू गया! बहुत ही शानदार अनुभव रहा।',
      specialDate: '2026-10-14',
      favoriteFlower: 'लाल गुलाब (Red Velvet Rose)',
      submittedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
      tokenNumber: 'GLB-481920',
      source: 'qr_scan',
    },
    {
      id: 'sub_demo_2',
      fullName: 'Priya Verma (प्रिया वर्मा)',
      contact: 'priya.verma@example.com',
      category: 'feedback',
      roseMood: 'pink-rose',
      roseRating: 5,
      message: 'QR code scan karte hi seedha itna pyara floral page open hua, bilkul alag feeling aayi!',
      specialDate: '2026-10-12',
      favoriteFlower: 'पिंक गुलाब (Blush Rose)',
      submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      tokenNumber: 'GLB-839201',
      source: 'qr_scan',
    },
    {
      id: 'sub_demo_3',
      fullName: 'Vikram & Ananya',
      contact: '+91 99887 76655',
      category: 'event',
      roseMood: 'lavender-rose',
      roseRating: 4,
      message: 'We scanned this QR from the table standee at the reception. Beautiful initiative!',
      specialDate: '2026-10-25',
      favoriteFlower: 'लैवेंडर गुलाब (Lavender Rose)',
      submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      tokenNumber: 'GLB-910482',
      source: 'qr_scan',
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
  } catch (err) {
    console.error(err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('gulab_submissions_updated'));
  }
}
