import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Send, CheckCircle2, RotateCcw, Volume2, VolumeX, ShieldCheck, Calendar, Phone, User, MessageSquare, Download } from 'lucide-react';
import { FormSubmission, RoseColorMood } from '../types';
import { saveSubmission } from '../utils/storage';
import { playRoseChime, playCelebrationFanfare } from '../utils/audio';

interface RoseFormProps {
  onGoToAdmin?: () => void;
  showAdminLink?: boolean;
}

export const RoseForm: React.FC<RoseFormProps> = ({ onGoToAdmin, showAdminLink = true }) => {
  const [fullName, setFullName] = useState('');
  const [contact, setContact] = useState('');
  const [category, setCategory] = useState<FormSubmission['category']>('feedback');
  const [roseMood, setRoseMood] = useState<RoseColorMood>('red-rose');
  const [roseRating, setRoseRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [specialDate, setSpecialDate] = useState('');
  const [favoriteFlower, setFavoriteFlower] = useState('लाल गुलाब (Red Velvet Rose)');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [submittedData, setSubmittedData] = useState<FormSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const moods: { id: RoseColorMood; name: string; hindi: string; color: string; bg: string; border: string; glow: string }[] = [
    {
      id: 'red-rose',
      name: 'Red Rose',
      hindi: 'लाल गुलाब • प्रेम व आदर',
      color: '#e11d48',
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      glow: 'shadow-rose-200',
    },
    {
      id: 'pink-rose',
      name: 'Blush Pink',
      hindi: 'गुलाबी गुलाब • कृतज्ञता व मिठास',
      color: '#ec4899',
      bg: 'bg-pink-50',
      border: 'border-pink-300',
      glow: 'shadow-pink-200',
    },
    {
      id: 'white-rose',
      name: 'Pure White',
      hindi: 'श्वेत गुलाब • शांति व सादगी',
      color: '#0d9488',
      bg: 'bg-emerald-50/50',
      border: 'border-teal-200',
      glow: 'shadow-teal-100',
    },
    {
      id: 'yellow-rose',
      name: 'Golden Rose',
      hindi: 'पीला गुलाब • मित्रता व उमंग',
      color: '#d97706',
      bg: 'bg-amber-50',
      border: 'border-amber-300',
      glow: 'shadow-amber-200',
    },
    {
      id: 'lavender-rose',
      name: 'Lavender Rose',
      hindi: 'लैवेंडर गुलाब • आकर्षण व जादू',
      color: '#9333ea',
      bg: 'bg-purple-50',
      border: 'border-purple-300',
      glow: 'shadow-purple-200',
    },
  ];

  const ratingLabels: Record<number, { title: string; desc: string }> = {
    1: { title: 'एक कली (One Bloom)', desc: 'प्रयास जारी है, सुधार अपेक्षित' },
    2: { title: 'खिलती पंखुड़ी (Growing)', desc: 'अच्छा अनुभव, और बेहतर हो सकता है' },
    3: { title: 'महकता चमन (Pleasant)', desc: 'बहुत प्यारा और संतोषजनक अनुभव' },
    4: { title: 'खिला हुआ गुलाब (Splendid)', desc: 'अत्यंत मनमोहक व सुंदर' },
    5: { title: 'संपूर्ण गुलाब बहार (Divine)', desc: 'लाजवाब! दिल जीत लिया' },
  };

  const handleRatingClick = (rate: number) => {
    setRoseRating(rate);
    if (soundEnabled) {
      playRoseChime(rate);
    }
  };

  const handleMoodSelect = (moodId: RoseColorMood) => {
    setRoseMood(moodId);
    if (soundEnabled) {
      playRoseChime(2);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) {
      errs.fullName = 'कृपया अपना शुभ नाम दर्ज करें (Please enter your name)';
    }
    if (!contact.trim()) {
      errs.contact = 'कृपया संपर्क नंबर या ईमेल दें (Phone or email required)';
    }
    if (!message.trim()) {
      errs.message = 'कृपया अपना संदेश या विचार लिखें (Please write your message)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Determine if came from QR scan via url params
      const isQr = typeof window !== 'undefined' && window.location.search.includes('source=qr');
      
      const newEntry = saveSubmission({
        fullName: fullName.trim(),
        contact: contact.trim(),
        category,
        roseMood,
        roseRating,
        message: message.trim(),
        specialDate: specialDate || undefined,
        favoriteFlower,
        source: isQr ? 'qr_scan' : 'direct_link',
      });

      setSubmittedData(newEntry);
      setIsSubmitting(false);

      if (soundEnabled) {
        playCelebrationFanfare();
      }

      // Rose petal confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#e11d48', '#fda4af', '#fb7185', '#fbbf24', '#ffffff'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#e11d48', '#ec4899', '#f43f5e'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#e11d48', '#ec4899', '#f43f5e'],
          });
        }, 300);
      } catch {
        // Confetti fallback
      }
    }, 400);
  };

  const handleReset = () => {
    setFullName('');
    setContact('');
    setMessage('');
    setSpecialDate('');
    setRoseRating(5);
    setErrors({});
    setSubmittedData(null);
  };

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto px-4 py-6 md:py-10">
      {/* Top Utility Ribbon */}
      <div className="flex items-center justify-between mb-4 text-xs md:text-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-rose-200/80 shadow-xs text-rose-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>सीधा क्यूआर फॉर्म पोर्टल • Direct Scan Access</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-full bg-white/80 border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors shadow-xs"
            title={soundEnabled ? 'आवाज़ बंद करें (Mute Sound)' : 'आवाज़ चालू करें (Enable Sound)'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {showAdminLink && onGoToAdmin && (
            <button
              type="button"
              onClick={onGoToAdmin}
              className="px-3 py-1.5 rounded-full bg-rose-900/10 hover:bg-rose-900/20 text-rose-900 border border-rose-300/60 font-medium transition-colors"
            >
              क्यूआर व एडमिन कक्ष →
            </button>
          )}
        </div>
      </div>

      {submittedData ? (
        /* SUCCESS RECEIPT / गुलाब आभार पत्र */
        <div className="rose-glass rounded-3xl border-2 border-rose-200/90 shadow-2xl p-6 md:p-10 text-center animate-in fade-in zoom-in duration-300">
          {/* Ornate Stamp Header */}
          <div className="relative inline-block mx-auto mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-lg mx-auto ring-8 ring-rose-100">
              <span className="text-4xl select-none animate-bounce">🌹</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-white rounded-full p-1.5 shadow-md">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-rose-950 font-serif tracking-tight">
            धन्यवाद एवं हार्दिक आभार!
          </h2>
          <p className="text-rose-700 font-script text-2xl md:text-3xl mt-1">
            "महक उठे हर पल आपका, जैसे खिला हो ताज़ा गुलाब"
          </p>
          <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto">
            आपका संदेश और प्रतिक्रिया सफलता पूर्वक सहेज ली गई है। आपका विवरण हमारे पास सुरक्षित है।
          </p>

          {/* Rose Seal Card / Slip */}
          <div className="mt-6 max-w-md mx-auto bg-gradient-to-b from-rose-50/90 to-amber-50/70 border border-rose-200 rounded-2xl p-5 text-left shadow-inner relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 text-rose-200 opacity-40 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="45" />
              </svg>
            </div>

            <div className="flex justify-between items-center border-b border-rose-200/80 pb-3 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">पावती संख्या / Token</span>
                <p className="text-base font-mono font-bold text-rose-900">{submittedData.tokenNumber}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500">तारीख व समय</span>
                <p className="text-xs text-slate-700">
                  {new Date(submittedData.submittedAt).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">नाम (Name):</span>
                <span className="font-semibold text-rose-950">{submittedData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">संपर्क (Contact):</span>
                <span className="font-medium text-slate-800">{submittedData.contact}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">गुलाब रेटिंग (Roses):</span>
                <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                  {Array.from({ length: submittedData.roseRating }).map((_, i) => (
                    <span key={i} className="text-base">🌹</span>
                  ))}
                  <span className="text-xs ml-1 text-slate-600">({submittedData.roseRating}/5)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">गुलाब भाव (Mood):</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-medium">
                  {submittedData.roseMood.replace('-rose', '').toUpperCase()} ROSE
                </span>
              </div>
              {submittedData.specialDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">विशेष तारीख (Date):</span>
                  <span className="text-slate-800 font-medium">{submittedData.specialDate}</span>
                </div>
              )}
            </div>

            <div className="mt-3 pt-3 border-t border-rose-200/80">
              <span className="text-[11px] font-medium text-rose-600 block mb-1">आपका संदेश (Your Message):</span>
              <p className="text-xs text-slate-700 italic bg-white/70 p-2.5 rounded-lg border border-rose-100">
                "{submittedData.message}"
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium shadow-md shadow-rose-300 transition-all hover:scale-[1.02]"
            >
              <RotateCcw className="w-4 h-4" />
              एक और फॉर्म भरें (Submit Another)
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-rose-50 text-rose-800 border border-rose-300 font-medium shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              पावती रसीद प्रिंट करें (Print Slip)
            </button>
          </div>
        </div>
      ) : (
        /* MAIN FLOWER/ROSE FORM CARD */
        <div className="rose-glass rounded-3xl border-2 border-rose-200/80 shadow-2xl overflow-hidden relative backdrop-blur-md">
          {/* Header Banner with Rose Floral Arch */}
          <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-pink-900 text-white px-6 py-8 sm:px-10 text-center relative overflow-hidden">
            {/* Background Rose Glow & Floral Vectors */}
            <div className="absolute -top-12 -left-12 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-rose-500/30 rounded-full blur-2xl" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl animate-pulse">🌸</span>
                <span className="text-xs uppercase tracking-widest font-semibold text-rose-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                  गुलाब विशेषांक • Interactive Portal
                </span>
                <span className="text-2xl animate-pulse">🌸</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif mt-1">
                गुलाब फॉर्म • Rose Bloom Response
              </h1>
              <p className="text-rose-200 text-sm sm:text-base mt-2 max-w-lg mx-auto font-light">
                क्यूआर स्कैन करके सीधा पहुंचे हैं आप! अपनी प्रतिक्रिया, संदेश या आमंत्रण को ताज़े गुलाबों की तरह दर्ज करें।
              </p>

              {/* Decorative Floral Divider */}
              <div className="flex items-center justify-center gap-3 mt-4 text-rose-300/80">
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-rose-300" />
                <span className="text-lg">🌹</span>
                <span className="text-xs tracking-widest uppercase">Rose Fragrance Form</span>
                <span className="text-lg">🌹</span>
                <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-rose-300" />
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-7">
            {/* Section 1: Rose Rating (1 to 5) */}
            <div className="bg-gradient-to-br from-rose-50/80 via-white to-pink-50/60 p-5 rounded-2xl border border-rose-200/80 shadow-xs text-center">
              <label className="block text-sm font-semibold text-rose-950 mb-1">
                गुलाब रेटिंग दें • How do you rate your experience? 🌹
              </label>
              <p className="text-xs text-rose-700/80 mb-3">
                पंखुड़ियों पर क्लिक करें और रेटिंग चुनें
              </p>

              {/* Rose Blossoms Row */}
              <div className="flex items-center justify-center gap-3 sm:gap-5 my-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || roseRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingClick(star)}
                      className={`group relative p-2 transition-transform duration-200 focus:outline-none ${
                        isActive ? 'scale-115' : 'scale-95 opacity-60 hover:opacity-90'
                      }`}
                      title={`${star} Rose${star > 1 ? 's' : ''}`}
                    >
                      <span className="text-3xl sm:text-4xl drop-shadow-sm select-none transition-all group-hover:scale-125 inline-block">
                        {isActive ? '🌹' : '🥀'}
                      </span>
                      <span className="block text-[10px] font-bold text-rose-800 mt-0.5">
                        {star}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Rating description */}
              <div className="mt-2 text-xs">
                <span className="font-bold text-rose-900">
                  {ratingLabels[hoverRating || roseRating]?.title}:
                </span>{' '}
                <span className="text-slate-600">
                  {ratingLabels[hoverRating || roseRating]?.desc}
                </span>
              </div>
            </div>

            {/* Section 2: Choose Your Rose Mood / Color */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                गुलाब का रंग व भाव चुनें • Pick Your Rose Mood
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {moods.map((m) => {
                  const isSelected = roseMood === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleMoodSelect(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? `${m.bg} ${m.border} ring-2 ring-rose-500 shadow-md ${m.glow}`
                          : 'bg-white/80 border-slate-200 hover:border-rose-200 hover:bg-rose-50/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">🌹</span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800">{m.name}</div>
                        <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{m.hindi}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Name & Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  पूरा नाम • Your Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errors.fullName) setErrors({ ...errors, fullName: '' });
                    }}
                    placeholder="जैसे: कबीर सिंह / Anita Sharma"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-sm transition-all shadow-2xs ${
                      errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-rose-200'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  संपर्क (फ़ोन या ईमेल) • Contact Info <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (errors.contact) setErrors({ ...errors, contact: '' });
                    }}
                    placeholder="फ़ोन नंबर या anita@example.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/90 border text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 text-sm transition-all shadow-2xs ${
                      errors.contact ? 'border-red-400 bg-red-50/30' : 'border-rose-200'
                    }`}
                  />
                </div>
                {errors.contact && (
                  <p className="text-red-600 text-xs mt-1">{errors.contact}</p>
                )}
              </div>
            </div>

            {/* Section 4: Purpose / Category & Special Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  प्रपत्र का उद्देश्य • Submission Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FormSubmission['category'])}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-rose-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm shadow-2xs"
                >
                  <option value="feedback">🌹 प्रतिक्रिया व अनुभव (Feedback & Reviews)</option>
                  <option value="greeting">💌 विशेष संदेश / बधाई (Greeting & Wishes)</option>
                  <option value="inquiry">🌿 पूछताछ व सहायता (Inquiry & Requests)</option>
                  <option value="event">💍 उत्सव / समारोह आमंत्रण (Special Event)</option>
                  <option value="complaint">🥀 सुधार का सुझाव (Constructive Feedback)</option>
                  <option value="other">✨ अन्य विचार (General)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  तारीख / अवसर (वैकल्पिक) • Occasion Date
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-rose-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    value={specialDate}
                    onChange={(e) => setSpecialDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white/90 border border-rose-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Section 5: Heartfelt Message / विचार व पैगाम */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  गुलाब का पैगाम • Your Message / Note <span className="text-rose-600">*</span>
                </label>
                <span className="text-xs text-rose-500 font-script text-base">
                  "दिल से दिल तक"
                </span>
              </div>
              <div className="relative">
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors({ ...errors, message: '' });
                  }}
                  placeholder="अपना संदेश, अनुभव या विचार यहाँ विस्तार से लिखें... (Share your heartfelt thoughts, feedback or wishes here)"
                  className={`w-full p-3.5 rounded-2xl bg-white/95 border text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm leading-relaxed transition-all shadow-2xs ${
                    errors.message ? 'border-red-400 bg-red-50/30' : 'border-rose-200'
                  }`}
                />
                <div className="absolute bottom-3 right-3 text-rose-300 pointer-events-none">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              {errors.message && (
                <p className="text-red-600 text-xs mt-1">{errors.message}</p>
              )}
            </div>

            {/* Section 6: Flower Dedication */}
            <div className="bg-rose-50/60 p-3.5 rounded-xl border border-rose-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-rose-900 font-medium">
                <Sparkles className="w-4 h-4 text-rose-500 shrink-0" />
                <span>गुलाब समर्पण: किस गुलाब के साथ भेजना चाहेंगे?</span>
              </div>
              <select
                value={favoriteFlower}
                onChange={(e) => setFavoriteFlower(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-rose-200 text-slate-800 text-xs focus:ring-1 focus:ring-rose-400"
              >
                <option value="लाल गुलाब (Red Velvet Rose)">🌹 लाल गुलाब (Red Velvet Rose)</option>
                <option value="पिंक गुलाब (Blush Rose)">🌸 पिंक गुलाब (Blush Rose)</option>
                <option value="कश्मीरी गुलाब (Kashmiri Damask Rose)">🥀 कश्मीरी गुलाब (Damask Rose)</option>
                <option value="सफेद गुलाब (Snow White Rose)">🤍 सफेद गुलाब (Snow White Rose)</option>
                <option value="गुलाब की पंखुड़ियां (Fresh Petals)">💐 गुलाब की पंखुड़ियां (Fresh Petals)</option>
              </select>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-700 hover:via-rose-600 hover:to-pink-700 text-white font-bold text-base shadow-lg shadow-rose-300 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>गुलाब महक के साथ सहेजा जा रहा है...</span>
                  </>
                ) : (
                  <>
                    <span>गुलाब की महक के साथ सबमिट करें</span>
                    <span className="text-xl">🌹</span>
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>यह फॉर्म पूर्णतः सुरक्षित है और डेटा आपके लोकल डिवाइस (LocalStorage) में सुरक्षित सहेजा जाता है।</span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
