export type ViewMode = 'form' | 'submissions';

export type CourseType = 
  | 'PGDCA'
  | 'DCA'
  | 'CPCT'
  | 'TALLY_GST'
  | 'BASIC_COMPUTER'
  | 'DTP_GRAPHICS'
  | 'OTHER';

export interface StudentRegistration {
  id: string;
  tokenNumber: string;
  fullName: string;
  fatherName?: string;
  mobile: string;
  gmail: string;
  address: string;
  course: CourseType;
  customCourse?: string;
  qualification: string;
  message?: string;
  submittedAt: string;
}

export const INSTITUTE_WHATSAPP_NUMBER = '9303616654';
export const INSTITUTE_NAME = 'कृष्ण कंप्यूटर नागोद';
export const INSTITUTE_SUBTITLE = 'Krishan Computer Institute, Nagod (M.P.)';
