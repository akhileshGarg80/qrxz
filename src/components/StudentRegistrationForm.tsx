import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  BookOpen, 
  Send, 
  CheckCircle2, 
  Download, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw,
  Award,
  Calendar,
  MessageCircle
} from 'lucide-react';
import { 
  StudentRegistration, 
  CourseType, 
  INSTITUTE_WHATSAPP_NUMBER, 
  INSTITUTE_NAME, 
  INSTITUTE_SUBTITLE 
} from '../types';
import { saveRegistration } from '../utils/storage';
import { playCelebrationFanfare, playRoseChime } from '../utils/audio';

interface StudentRegistrationFormProps {
  onOpenRecords?: () => void;
  savedCount?: number;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  onOpenRecords, 
  savedCount = 0 
}) => {
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gmail, setGmail] = useState('');
  const [address, setAddress] = useState('');
  const [course, setCourse] = useState<CourseType>('PGDCA');
  const [customCourse, setCustomCourse] = useState('');
  const [qualification, setQualification] = useState('12वीं पास (12th Passed)');
  const [message, setMessage] = useState('');

  const [submittedData, setSubmittedData] = useState<StudentRegistration | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cardRef = useRef<HTMLDivElement>(null);

  // Available courses with attractive styling badges
  const coursesList: { id: CourseType; title: string; desc: string; badge: string; color: string; bg: string; icon: string }[] = [
    {
      id: 'PGDCA',
      title: 'PGDCA (1 Year)',
      desc: 'Post Graduate Diploma in Computer Applications',
      badge: 'ग्रेजुएशन के बाद',
      color: 'border-purple-500 text-purple-900',
      bg: 'from-purple-50 to-indigo-50/70',
      icon: '🎓',
    },
    {
      id: 'DCA',
      title: 'DCA (1 Year)',
      desc: 'Diploma in Computer Applications (MCU Bhopal)',
      badge: '12वीं के बाद',
      color: 'border-blue-500 text-blue-900',
      bg: 'from-blue-50 to-sky-50/70',
      icon: '💻',
    },
    {
      id: 'CPCT',
      title: 'CPCT Special',
      desc: 'कंप्यूटर प्रोफिशिएंसी व हिंदी/इंग्लिश टाइपिंग टेस्ट',
      badge: 'सरकारी नौकरी हेतु',
      color: 'border-emerald-500 text-emerald-900',
      bg: 'from-emerald-50 to-teal-50/70',
      icon: '⌨️',
    },
    {
      id: 'TALLY_GST',
      title: 'Tally Prime + GST',
      desc: 'कंप्लीट अकाउंटिंग, इनवॉइसिंग, रिटर्न फाइलिंग',
      badge: 'जॉब ओरिएंटेड',
      color: 'border-amber-500 text-amber-900',
      bg: 'from-amber-50 to-orange-50/70',
      icon: '📊',
    },
    {
      id: 'BASIC_COMPUTER',
      title: 'बेसिक कंप्यूटर कोर्स',
      desc: 'MS Word, Excel, PowerPoint, Internet, Typing',
      badge: 'शुरुआती छात्रों हेतु',
      color: 'border-rose-500 text-rose-900',
      bg: 'from-rose-50 to-pink-50/70',
      icon: '🖥️',
    },
    {
      id: 'DTP_GRAPHICS',
      title: 'DTP & ग्राफिक डिजाइनिंग',
      desc: 'Photoshop, PageMaker, CorelDraw, फ्लेक्स प्रिंटिंग',
      badge: 'क्रिएटिव डिजाइन',
      color: 'border-cyan-500 text-cyan-900',
      bg: 'from-cyan-50 to-blue-50/70',
      icon: '🎨',
    },
    {
      id: 'OTHER',
      title: 'अन्य कोर्स (Other)',
      desc: 'कोई अन्य विशिष्ट कंप्यूटर कोर्स',
      badge: 'कस्टम',
      color: 'border-slate-500 text-slate-800',
      bg: 'from-slate-50 to-gray-50',
      icon: '✨',
    },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = 'कृपया छात्र/छात्रा का नाम दर्ज करें';
    if (!mobile.trim()) {
      errs.mobile = 'कृपया मोबाइल नंबर दर्ज करें';
    } else if (mobile.trim().length < 10) {
      errs.mobile = 'कृपया मान्य 10 अंकों का मोबाइल नंबर दर्ज करें';
    }
    if (!gmail.trim()) {
      errs.gmail = 'कृपया Gmail / ईमेल आईडी दर्ज करें';
    } else if (!gmail.includes('@')) {
      errs.gmail = 'कृपया सही Gmail आईडी दर्ज करें (जैसे: name@gmail.com)';
    }
    if (!address.trim()) {
      errs.address = 'कृपया अपना पता / गांव / शहर दर्ज करें';
    }
    if (course === 'OTHER' && !customCourse.trim()) {
      errs.customCourse = 'कृपया कोर्स का नाम लिखें';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const saved = saveRegistration({
        fullName: fullName.trim(),
        fatherName: fatherName.trim() || undefined,
        mobile: mobile.trim(),
        gmail: gmail.trim(),
        address: address.trim(),
        course,
        customCourse: course === 'OTHER' ? customCourse.trim() : undefined,
        qualification,
        message: message.trim() || undefined,
      });

      setSubmittedData(saved);
      setIsSubmitting(false);

      playCelebrationFanfare();

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#e11d48', '#10b981', '#3b82f6', '#ec4899'],
        });
      } catch {
        // confetti fallback
      }
    }, 350);
  };

  const handleReset = () => {
    setFullName('');
    setFatherName('');
    setMobile('');
    setGmail('');
    setAddress('');
    setCourse('PGDCA');
    setCustomCourse('');
    setQualification('12वीं पास (12th Passed)');
    setMessage('');
    setErrors({});
    setSubmittedData(null);
  };

  // Generate WhatsApp Message text for 9303616654
  const getWhatsAppMessageText = (item: StudentRegistration) => {
    const courseName = item.course === 'OTHER' ? item.customCourse : item.course;
    return `🚩 *${INSTITUTE_NAME} - ऑनलाइन प्रवेश विवरण*\n\n` +
      `📋 *टोकन / रसीद क्र:* ${item.tokenNumber}\n` +
      `👤 *छात्र का नाम:* ${item.fullName}\n` +
      (item.fatherName ? `👨‍👦 *पिता का नाम:* ${item.fatherName}\n` : '') +
      `📱 *मोबाइल:* ${item.mobile}\n` +
      `📧 *Gmail:* ${item.gmail}\n` +
      `🏠 *पता:* ${item.address}\n` +
      `🎓 *इच्छित कोर्स:* ${courseName}\n` +
      `📚 *शैक्षणिक योग्यता:* ${item.qualification}\n` +
      (item.message ? `💬 *संदेश/टिप्पणी:* ${item.message}\n` : '') +
      `\n📍 *संस्थान:* ${INSTITUTE_NAME}, नागोद\n` +
      `📞 *हेल्पलाइन:* ${INSTITUTE_WHATSAPP_NUMBER}\n` +
      `✅ *ऑनलाइन पोर्टल द्वारा प्रेषित*`;
  };

  const handleSendToWhatsApp = () => {
    if (!submittedData) return;
    const text = getWhatsAppMessageText(submittedData);
    const encoded = encodeURIComponent(text);
    const url = `https://wa.me/91${INSTITUTE_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Download Card as PNG Image using html2canvas
  const handleDownloadCardImage = async () => {
    if (!cardRef.current || !submittedData) return;
    setIsGeneratingImage(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2.5,
        useCORS: true,
        backgroundColor: '#ffffff',
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Krishan-Computer-Nagod-${submittedData.tokenNumber}.png`;
      link.click();
    } catch (err) {
      console.error('Image generation error:', err);
      alert('इमेज बनाने में असमर्थ, कृपया स्क्रीनशॉट लें या प्रिंट करें।');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Web Share API to share card directly to WhatsApp if supported
  const handleShareCard = async () => {
    if (!cardRef.current || !submittedData) return;
    if (navigator.share) {
      try {
        setIsGeneratingImage(true);
        const canvas = await html2canvas(cardRef.current, { scale: 2 });
        canvas.toBlob(async (blob) => {
          if (!blob) {
            handleSendToWhatsApp();
            return;
          }
          const file = new File([blob], `KCN-${submittedData.tokenNumber}.png`, { type: 'image/png' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${INSTITUTE_NAME} प्रवेश कार्ड`,
              text: getWhatsAppMessageText(submittedData),
            });
          } else {
            handleSendToWhatsApp();
          }
          setIsGeneratingImage(false);
        });
      } catch {
        setIsGeneratingImage(false);
        handleSendToWhatsApp();
      }
    } else {
      handleSendToWhatsApp();
    }
  };

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-5 sm:py-8">
      {/* ========================================================
          GRAND HEADER - KRISHAN COMPUTER NAGOD
          With lush marigold, rose, and floral garlands
          ======================================================== */}
      <div className="text-center mb-6 relative">
        {/* Decorative Top Garland */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-2 text-xl sm:text-2xl select-none">
          <span>🌼</span>
          <span>🌺</span>
          <span>🌻</span>
          <span>🌸</span>
          <span>🌹</span>
          <span className="font-bold text-amber-600 text-xs sm:text-sm bg-amber-100/90 px-3 py-0.5 rounded-full border border-amber-300">
            श्री गणेशाय नमः
          </span>
          <span>🌹</span>
          <span>🌸</span>
          <span>🌻</span>
          <span>🌺</span>
          <span>🌼</span>
        </div>

        {/* Institute Main Title Card */}
        <div className="bg-gradient-to-r from-amber-700 via-rose-700 to-amber-700 text-white rounded-3xl p-5 sm:p-7 shadow-xl shadow-amber-900/15 border-2 border-amber-300/80 relative overflow-hidden">
          {/* Decorative Corner Blossoms */}
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-400/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full border border-white/20 text-xs sm:text-sm font-semibold mb-2">
              <span>🖥️</span>
              <span>कंप्यूटर प्रशिक्षण संस्थान • नागोद (म.प्र.)</span>
              <span>⭐</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif drop-shadow-md">
              {INSTITUTE_NAME}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-1 font-medium tracking-wide">
              {INSTITUTE_SUBTITLE}
            </p>

            <div className="mt-3.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm shadow-md animate-pulse">
              <span>🎯</span>
              <span>सत्र 2026-27 प्रवेश प्रारंभ (Admissions Open)</span>
              <span>🎓</span>
            </div>

            {/* Helpline bar */}
            <div className="mt-3 flex items-center justify-center gap-3 text-xs text-amber-100">
              <span className="flex items-center gap-1 font-medium">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>हेल्पलाइन / WhatsApp:</span>
                <strong className="text-white text-sm font-mono tracking-wider">{INSTITUTE_WHATSAPP_NUMBER}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Subtitle Hint */}
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5 font-medium">
          ऑनलाइन प्रवेश या जानकारी के लिए नीचे दिया गया फॉर्म भरें एवं तुरंत अपना कार्ड प्राप्त करें
        </p>
      </div>

      {/* ========================================================
          SUCCESS STATE: OFFICIAL ADMISSION CARD & WHATSAPP SHARE
          ======================================================== */}
      {submittedData ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
          {/* THE OFFICIAL PRINTABLE / SHAREABLE CARD */}
          <div
            ref={cardRef}
            id="student-admission-card"
            className="bg-white rounded-3xl border-4 border-amber-500 shadow-2xl p-6 sm:p-8 relative overflow-hidden"
            style={{ minHeight: '440px' }}
          >
            {/* Card Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <span className="text-9xl font-bold font-serif">KCN</span>
            </div>

            {/* Card Header */}
            <div className="border-b-2 border-amber-400 pb-4 mb-4 text-center relative">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-xs">
                  🖥️
                </div>
                <div className="flex-1 px-2">
                  <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                    प्रवेश पावती / REGISTRATION CARD
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-950 font-serif">
                    {INSTITUTE_NAME}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    नागोद, जिला सतना (म.प्र.) • Mob: {INSTITUTE_WHATSAPP_NUMBER}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 border border-rose-300 flex items-center justify-center text-2xl shadow-xs">
                  🎓
                </div>
              </div>

              {/* Token Pill */}
              <div className="mt-3 flex items-center justify-between text-xs bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                <span className="font-semibold text-slate-700">
                  पंजीकरण क्र: <strong className="font-mono text-amber-900 text-sm">{submittedData.tokenNumber}</strong>
                </span>
                <span className="text-slate-500 text-[11px]">
                  दिनांक: {new Date(submittedData.submittedAt).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Student Info Table */}
            <div className="space-y-2.5 text-xs sm:text-sm text-slate-800">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">छात्र/छात्रा का नाम:</span>
                <strong className="text-amber-950 text-sm font-bold">{submittedData.fullName}</strong>
              </div>

              {submittedData.fatherName && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">पिता का नाम:</span>
                  <span className="font-semibold text-slate-800">{submittedData.fatherName}</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">मोबाइल नंबर:</span>
                <strong className="text-slate-900 font-mono">{submittedData.mobile}</strong>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Gmail / ईमेल:</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px] sm:max-w-xs">{submittedData.gmail}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">पता (Address):</span>
                <span className="font-medium text-slate-800 text-right">{submittedData.address}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100 items-center">
                <span className="text-slate-500">चयनित कोर्स:</span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs sm:text-sm border border-purple-300">
                  🎓 {submittedData.course === 'OTHER' ? submittedData.customCourse : submittedData.course}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">शैक्षणिक योग्यता:</span>
                <span className="font-medium text-slate-800">{submittedData.qualification}</span>
              </div>

              {submittedData.message && (
                <div className="pt-1 text-xs">
                  <span className="text-slate-500 block">टिप्पणी / संदेश:</span>
                  <p className="italic text-slate-700 bg-amber-50/60 p-2 rounded-lg border border-amber-100 mt-0.5">
                    "{submittedData.message}"
                  </p>
                </div>
              )}
            </div>

            {/* Official Stamp Footer */}
            <div className="mt-5 pt-3 border-t-2 border-amber-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>वेरिफाइड ऑनलाइन रजिस्ट्रेशन</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">अधिकृत संस्थान</span>
                <span className="font-bold text-amber-900 font-serif">कृष्ण कंप्यूटर, नागोद</span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS: WHATSAPP SHARE TO 9303616654 & DOWNLOAD IMAGE */}
          <div className="bg-white/95 rounded-3xl p-5 border border-amber-200 shadow-lg space-y-3">
            <h3 className="text-center font-bold text-slate-900 text-sm">
              📲 अपने इस कार्ड और विवरण को WhatsApp पर भेजें:
            </h3>

            {/* PRIMARY WHATSAPP BUTTON TO 9303616654 */}
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-4 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-base shadow-lg shadow-emerald-200 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-6 h-6 fill-white" />
              <span>WhatsApp पर 9303616654 को भेजें</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* DOWNLOAD CARD AS PNG IMAGE */}
              <button
                type="button"
                onClick={handleDownloadCardImage}
                disabled={isGeneratingImage}
                className="py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4" />
                <span>{isGeneratingImage ? 'इमेज तैयार हो रही है...' : 'कार्ड इमेज डाउनलोड करें (PNG)'}</span>
              </button>

              {/* SHARE IMAGE DIRECTLY */}
              <button
                type="button"
                onClick={handleShareCard}
                disabled={isGeneratingImage}
                className="py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                <Share2 className="w-4 h-4" />
                <span>सीधा शेयर करें (Share Card)</span>
              </button>
            </div>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 font-semibold hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>एक और फॉर्म भरें (New Registration)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================
            THE MAIN REGISTRATION FORM
            Single page with distinctly designed attractive sections
            ======================================================== */
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ----------------------------------------------------
              SECTION 1: STUDENT PROFILE (विद्यार्थी विवरण)
              ---------------------------------------------------- */}
          <div className="bg-white/95 rounded-3xl border-2 border-amber-300/80 shadow-md p-5 sm:p-6 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-amber-100">
              <span className="text-xl">👤</span>
              <h2 className="font-bold text-amber-950 text-sm sm:text-base">
                1. विद्यार्थी का व्यक्तिगत विवरण (Student Details)
              </h2>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                  छात्र / छात्रा का पूरा नाम (Full Name) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="जैसे: रोहित कुशवाहा / Priya Soni"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 bg-amber-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                      errors.fullName ? 'border-rose-400 bg-rose-50/40' : 'border-amber-200'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-rose-600 text-[11px] mt-1">{errors.fullName}</p>}
              </div>

              {/* Father's Name */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                  पिताजी का नाम (Father's Name)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="जैसे: श्री रामकृपाल कुशवाहा"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-800 bg-amber-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                  शैक्षणिक योग्यता (Education Qualification)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 text-xs sm:text-sm text-slate-800 bg-amber-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                  >
                    <option value="12वीं पास (12th Passed)">12वीं पास (12th Passed)</option>
                    <option value="ग्रेजुएशन (B.A / B.Sc / B.Com / BCA)">ग्रेजुएशन (B.A / B.Sc / B.Com / BCA)</option>
                    <option value="10वीं पास (10th Passed)">10वीं पास (10th Passed)</option>
                    <option value="पोस्ट ग्रेजुएशन (M.A / M.Sc / M.Com)">पोस्ट ग्रेजुएशन (M.A / M.Sc / M.Com)</option>
                    <option value="अन्य अध्ययनरत (Studying)">अन्य अध्ययनरत (Other)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------
              SECTION 2: COURSE SELECTION (कोर्स चयन)
              Distinctly designed cards for each course
              ---------------------------------------------------- */}
          <div className="bg-white/95 rounded-3xl border-2 border-purple-300/80 shadow-md p-5 sm:p-6 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h2 className="font-bold text-purple-950 text-sm sm:text-base">
                  2. कोर्स का चयन करें (Choose Your Course) <span className="text-rose-600">*</span>
                </h2>
              </div>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                नागोद सेंटर
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {coursesList.map((c) => {
                const isSelected = course === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setCourse(c.id);
                      playRoseChime(2);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? `bg-gradient-to-br ${c.bg} ${c.color} ring-2 ring-purple-500 shadow-md scale-[1.01]`
                        : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-purple-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{c.icon}</span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{c.title}</h3>
                          <span className="text-[10px] font-semibold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded">
                            {c.badge}
                          </span>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">
                      {c.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Custom course input if 'OTHER' selected */}
            {course === 'OTHER' && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  कोर्स का नाम लिखें (Specify Course Name) <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={customCourse}
                  onChange={(e) => setCustomCourse(e.target.value)}
                  placeholder="उदा. Python, Data Entry, Typing etc."
                  className="w-full px-3.5 py-2 rounded-xl border border-purple-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                {errors.customCourse && (
                  <p className="text-rose-600 text-[11px] mt-1">{errors.customCourse}</p>
                )}
              </div>
            )}
          </div>

          {/* ----------------------------------------------------
              SECTION 3: CONTACT & ADDRESS (संपर्क व स्थायी पता)
              ---------------------------------------------------- */}
          <div className="bg-white/95 rounded-3xl border-2 border-emerald-300/80 shadow-md p-5 sm:p-6 relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-emerald-100">
              <span className="text-xl">📍</span>
              <h2 className="font-bold text-emerald-950 text-sm sm:text-base">
                3. संपर्क व स्थायी पता (Contact & Address Details)
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mobile Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                    मोबाइल नंबर (WhatsApp/Calling) <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => {
                        setMobile(e.target.value);
                        if (errors.mobile) setErrors({ ...errors, mobile: '' });
                      }}
                      placeholder="उदा. 9303616654"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.mobile ? 'border-rose-400 bg-rose-50/40' : 'border-emerald-200'
                      }`}
                    />
                  </div>
                  {errors.mobile && <p className="text-rose-600 text-[11px] mt-1">{errors.mobile}</p>}
                </div>

                {/* Gmail / Email */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                    Gmail / ईमेल आईडी <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={gmail}
                      onChange={(e) => {
                        setGmail(e.target.value);
                        if (errors.gmail) setErrors({ ...errors, gmail: '' });
                      }}
                      placeholder="उदा. rohit@gmail.com"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                        errors.gmail ? 'border-rose-400 bg-rose-50/40' : 'border-emerald-200'
                      }`}
                    />
                  </div>
                  {errors.gmail && <p className="text-rose-600 text-[11px] mt-1">{errors.gmail}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                  स्थायी पता / ग्राम / कस्बा (Address) <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (errors.address) setErrors({ ...errors, address: '' });
                    }}
                    placeholder="उदा. वार्ड 04, नागोद, जिला सतना (म.प्र.)"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs sm:text-sm text-slate-800 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                      errors.address ? 'border-rose-400 bg-rose-50/40' : 'border-emerald-200'
                    }`}
                  />
                </div>
                {errors.address && <p className="text-rose-600 text-[11px] mt-1">{errors.address}</p>}
              </div>

              {/* Additional message / notes */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
                  अन्य कोई सवाल या संदेश (Any Query / Notes)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="जैसे: मॉर्निंग बैच का समय, फीस की जानकारी या अन्य सवाल..."
                  className="w-full p-3 rounded-xl border border-emerald-200 text-xs sm:text-sm text-slate-800 bg-emerald-50/20 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-rose-600 to-amber-700 hover:from-amber-700 hover:via-rose-700 hover:to-amber-800 text-white font-bold text-base sm:text-lg shadow-xl shadow-amber-900/20 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>पंजीकरण दर्ज हो रहा है...</span>
                </>
              ) : (
                <>
                  <span>प्रवेश फॉर्म सबमिट करें एवं कार्ड बनाएं</span>
                  <Send className="w-5 h-5 ml-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                सबमिट करने के बाद आपका कार्ड तैयार होगा जिसे आप WhatsApp पर <strong>{INSTITUTE_WHATSAPP_NUMBER}</strong> में भेज सकेंगे।
              </span>
            </div>
          </div>
        </form>
      )}

      {/* Discreet Records Vault Link for Institute Admin */}
      {onOpenRecords && (
        <div className="text-center mt-7 pt-4 border-t border-amber-200/50">
          <button
            type="button"
            onClick={onOpenRecords}
            className="text-xs text-amber-900 hover:text-amber-700 font-semibold underline underline-offset-2 transition-colors"
          >
            📋 संस्थान रिकॉर्ड्स देखें (कुल एडमिशन: {savedCount})
          </button>
        </div>
      )}
    </div>
  );
};
