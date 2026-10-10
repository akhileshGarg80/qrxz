export type ViewMode = 'form' | 'qr-studio' | 'submissions';

export type RoseColorMood = 
  | 'red-rose'       // Love & Respect (गहरा प्रेम व आदर)
  | 'pink-rose'      // Gratitude & Grace (कृतज्ञता व स्नेह)
  | 'white-rose'     // Purity & Peace (शांति व पावनता)
  | 'yellow-rose'    // Joy & Friendship (उमंग व मित्रता)
  | 'lavender-rose'; // Elegance & Charm (जादुई आकर्षण)

export interface FormSubmission {
  id: string;
  fullName: string;
  contact: string;
  category: 'feedback' | 'inquiry' | 'greeting' | 'event' | 'complaint' | 'other';
  roseMood: RoseColorMood;
  roseRating: number; // 1 to 5
  message: string;
  specialDate?: string;
  favoriteFlower?: string;
  submittedAt: string;
  tokenNumber: string;
  source: 'qr_scan' | 'direct_link' | 'web';
}

export interface QRStandeeConfig {
  title: string;
  tagline: string;
  instruction: string;
  theme: 'royal-rose' | 'velvet-crimson' | 'champagne-gold' | 'midnight-noir' | 'botanical-sage';
  size: 'standee' | 'badge' | 'flyer' | 'tent-card';
  logoIcon: 'rose' | 'heart' | 'sparkle' | 'gift';
  includeInstructions: boolean;
  borderStyle: 'ornate' | 'minimal' | 'vintage' | 'double';
}
