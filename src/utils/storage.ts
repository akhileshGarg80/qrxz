import { StudentRegistration } from '../types';

const STORAGE_KEY = 'krishan_computer_registrations_v1';

export function getStoredRegistrations(): StudentRegistration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error reading localStorage:', err);
    return [];
  }
}

export function saveRegistration(
  data: Omit<StudentRegistration, 'id' | 'submittedAt' | 'tokenNumber'>
): StudentRegistration {
  const all = getStoredRegistrations();
  const tokenNumber = 'KCN-' + Math.floor(1000 + Math.random() * 9000);

  const newEntry: StudentRegistration = {
    ...data,
    id: 'kcn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    tokenNumber,
    submittedAt: new Date().toISOString(),
  };

  const updated = [newEntry, ...all];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save registration:', err);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('krishan_registrations_updated'));
  }

  return newEntry;
}

export function deleteRegistration(id: string): void {
  const all = getStoredRegistrations();
  const updated = all.filter(r => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('krishan_registrations_updated'));
  }
}

export function clearAllRegistrations(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error(err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('krishan_registrations_updated'));
  }
}

export function seedDemoRegistrations(): void {
  const samples: StudentRegistration[] = [
    {
      id: 'demo_1',
      tokenNumber: 'KCN-8241',
      fullName: 'रोहित कुशवाहा',
      fatherName: 'श्री रामकृपाल कुशवाहा',
      mobile: '9303616654',
      gmail: 'rohit.nagod@gmail.com',
      address: 'वार्ड क्र. 04, नागोद, जिला सतना',
      course: 'PGDCA',
      qualification: 'ग्रेजुएशन (B.Sc)',
      message: 'नागोद सेंटर में मॉर्निंग बैच में एडमिशन चाहिए।',
      submittedAt: new Date().toISOString(),
    },
    {
      id: 'demo_2',
      tokenNumber: 'KCN-9152',
      fullName: 'प्रिया सोनी',
      fatherName: 'श्री संतोष सोनी',
      mobile: '9826123456',
      gmail: 'priya.soni@gmail.com',
      address: 'बस स्टैंड के पास, नागोद',
      course: 'DCA',
      qualification: '12वीं उत्तीर्ण',
      message: 'डीसीए और टैली दोनों की जानकारी चाहिए।',
      submittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  } catch (err) {
    console.error(err);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('krishan_registrations_updated'));
  }
}
