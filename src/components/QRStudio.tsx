import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Sliders, 
  Smartphone, 
  Layers,
  Palette,
  Maximize2
} from 'lucide-react';
import { QRStandeeConfig } from '../types';

interface QRStudioProps {
  onOpenFormPreview: () => void;
}

export const QRStudio: React.FC<QRStudioProps> = ({ onOpenFormPreview }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [customParam, setCustomParam] = useState<string>('');
  
  const [config, setConfig] = useState<QRStandeeConfig>({
    title: 'गुलाब कुंज • Rose Special Form',
    tagline: 'कैमरा से स्कैन करें और सीधा गुलाब फॉर्म भरें',
    instruction: 'कोई ऐप डाउनलोड करने की आवश्यकता नहीं — मोबाइल कैमरा से स्कैन करते ही आकर्षक फॉर्म खुल जाएगा।',
    theme: 'royal-rose',
    size: 'standee',
    logoIcon: 'rose',
    includeInstructions: true,
    borderStyle: 'ornate',
  });

  const printRef = useRef<HTMLDivElement>(null);

  // Compute the live target URL that opens the form directly
  const targetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?view=form&source=qr${tableNumber ? `&table=${encodeURIComponent(tableNumber)}` : ''}${customParam ? `&ref=${encodeURIComponent(customParam)}` : ''}`
    : 'https://ais-forms.app/?view=form&source=qr';

  // Theme palettes for QR and standee styling
  const themes = {
    'royal-rose': {
      name: 'Royal Crimson (शाही गुलाब)',
      darkColor: '#9f1239',
      lightColor: '#fff1f2',
      bgGradient: 'from-rose-900 via-rose-800 to-pink-950',
      cardBg: 'bg-gradient-to-b from-rose-50 to-white',
      borderClass: 'border-rose-400',
      accentColor: 'text-rose-800',
      badgeBg: 'bg-rose-100 text-rose-900',
    },
    'velvet-crimson': {
      name: 'Velvet Red (मखमली लाल)',
      darkColor: '#be123c',
      lightColor: '#ffffff',
      bgGradient: 'from-red-950 via-rose-900 to-red-900',
      cardBg: 'bg-white',
      borderClass: 'border-rose-600',
      accentColor: 'text-rose-700',
      badgeBg: 'bg-red-100 text-red-900',
    },
    'champagne-gold': {
      name: 'Champagne Gold (गोल्डन गुलाब)',
      darkColor: '#78350f',
      lightColor: '#fefce8',
      bgGradient: 'from-amber-950 via-amber-900 to-stone-900',
      cardBg: 'bg-gradient-to-b from-amber-50 to-orange-50/40',
      borderClass: 'border-amber-400',
      accentColor: 'text-amber-900',
      badgeBg: 'bg-amber-100 text-amber-950',
    },
    'midnight-noir': {
      name: 'Midnight Noir (रॉयल ब्लैक व रोज़)',
      darkColor: '#1c1917',
      lightColor: '#fdf2f8',
      bgGradient: 'from-zinc-950 via-neutral-900 to-rose-950',
      cardBg: 'bg-neutral-900 text-white',
      borderClass: 'border-rose-500/60',
      accentColor: 'text-rose-300',
      badgeBg: 'bg-rose-950 text-rose-200 border border-rose-700/50',
    },
    'botanical-sage': {
      name: 'Botanical Sage (उपवन हरा व गुलाब)',
      darkColor: '#14532d',
      lightColor: '#f0fdf4',
      bgGradient: 'from-emerald-950 via-teal-900 to-emerald-900',
      cardBg: 'bg-gradient-to-b from-emerald-50/60 to-rose-50/40',
      borderClass: 'border-emerald-400',
      accentColor: 'text-emerald-900',
      badgeBg: 'bg-emerald-100 text-emerald-900',
    },
  };

  const currentTheme = themes[config.theme] || themes['royal-rose'];

  // Generate QR Code data URL whenever target URL or theme changes
  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: currentTheme.darkColor,
        light: currentTheme.lightColor,
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR code generation error:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [targetUrl, config.theme, currentTheme.darkColor, currentTheme.lightColor]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `gulab-qr-${config.theme}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Top Studio Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-200/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>क्यूआर प्रिंट व स्टैंडी स्टूडियो • QR Print & Standee Station</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-950 font-serif">
            गुलाब क्यूआर कोड एवं प्रिंटेबल स्टैंडी
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            इसे प्रिंट करके टेबल, काउंटर या दीवार पर लगाएं। कोई भी अपने फोन कैमरे से स्कैन करेगा तो सीधे सुंदर गुलाब फॉर्म पर पहुंचेगा!
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            type="button"
            onClick={onOpenFormPreview}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium text-xs sm:text-sm shadow-md shadow-rose-200 transition-all hover:scale-[1.02]"
          >
            <Smartphone className="w-4 h-4" />
            <span>सीधा फॉर्म खोलें (Test Scan)</span>
            <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-300 font-medium text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-rose-600" />
            <span>स्टैंडी प्रिंट करें (Print)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadQR}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 border border-slate-300 font-medium text-xs sm:text-sm shadow-xs transition-colors"
            title="Download PNG QR only"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>क्यूआर पीएनजी</span>
          </button>
        </div>
      </div>

      {/* Grid: Left Column Controls, Right Column Live Printable Standee Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Customization Controls (Hidden during print) */}
        <div className="lg:col-span-5 space-y-6 no-print">
          {/* Target URL Card */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-rose-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-rose-800">
                क्यूआर का सीधा लिंक (Scan Destination)
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active & Live
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-2.5">
              यूजर को लिंक टाइप नहीं करना पड़ेगा; स्कैन करते ही सीधे फॉर्म खुल जाएगा:
            </p>

            <div className="flex items-center gap-1.5 p-2.5 rounded-xl bg-rose-50/60 border border-rose-200">
              <code className="text-[11px] text-rose-950 font-mono flex-1 truncate select-all">
                {targetUrl}
              </code>
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 transition-colors shrink-0"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <p className="text-[11px] text-emerald-600 font-medium mt-1">
                ✓ लिंक कॉपी हो गया! आप इसे कहीं भी शेयर कर सकते हैं।
              </p>
            )}

            {/* Optional Table / Counter Tag */}
            <div className="mt-4 pt-3 border-t border-rose-100 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  टेबल / काउंटर नंबर (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. Table 05 / Reception"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-rose-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  अभियान / सोर्स टैग (वैकल्पिक)
                </label>
                <input
                  type="text"
                  placeholder="उदा. event-entry"
                  value={customParam}
                  onChange={(e) => setCustomParam(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-1 focus:ring-rose-400"
                />
              </div>
            </div>
          </div>

          {/* Standee Theme & Layout Controls */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-rose-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-rose-950 font-semibold text-sm pb-2 border-b border-rose-100">
              <Palette className="w-4 h-4 text-rose-600" />
              <span>स्टैंडी का रंग व थीम चुनें (Visual Theme)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(themes) as Array<keyof typeof themes>).map((tKey) => {
                const item = themes[tKey];
                const isSelected = config.theme === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => setConfig({ ...config, theme: tKey })}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/80 ring-2 ring-rose-400 font-bold'
                        : 'border-slate-200 hover:border-rose-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: item.darkColor }}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Standee Titles Customization */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-rose-950 font-semibold text-sm">
                <Sliders className="w-4 h-4 text-rose-600" />
                <span>स्टैंडी पर लिखे शब्द बदलें (Text Content)</span>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  शीर्षक (Standee Title)
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  उप-शीर्षक (Sub-headline)
                </label>
                <input
                  type="text"
                  value={config.tagline}
                  onChange={(e) => setConfig({ ...config, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  नीचे दी गई हिदायत (Instructions Note)
                </label>
                <textarea
                  rows={2}
                  value={config.instruction}
                  onChange={(e) => setConfig({ ...config, instruction: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-1 focus:ring-rose-400"
                />
              </div>

              {/* Layout Size Selector */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    फॉर्मेट (Print Size)
                  </label>
                  <select
                    value={config.size}
                    onChange={(e) => setConfig({ ...config, size: e.target.value as QRStandeeConfig['size'] })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="standee">टेबल स्टैंडी (A5 / Standee)</option>
                    <option value="tent-card">टेंट कार्ड (Folded Table Tent)</option>
                    <option value="flyer">दीवार पोस्टर (A4 Flyer)</option>
                    <option value="badge">मिनी कार्ड (Small Badge)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    केंद्र चिह्न (Icon Motif)
                  </label>
                  <select
                    value={config.logoIcon}
                    onChange={(e) => setConfig({ ...config, logoIcon: e.target.value as QRStandeeConfig['logoIcon'] })}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="rose">🌹 लाल गुलाब (Rose)</option>
                    <option value="heart">💖 प्रेम दिल (Heart)</option>
                    <option value="sparkle">✨ चमक (Sparkle)</option>
                    <option value="gift">🎁 उपहार (Gift)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Beautiful Printable Standee Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 text-xs text-slate-500 no-print">
            <span className="flex items-center gap-1 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-rose-600" />
              लाइव स्टैंडी प्रिव्यू (प्रिंट होने पर ऐसा दिखेगा):
            </span>
            <span className="text-rose-700 font-semibold">
              Ready to Print / A4 & A5 Suitable
            </span>
          </div>

          {/* THE PRINTABLE CARD */}
          <div
            ref={printRef}
            className={`printable-card w-full max-w-md mx-auto rounded-3xl overflow-hidden border-4 shadow-2xl relative transition-all duration-300 ${
              currentTheme.borderClass
            } ${currentTheme.cardBg}`}
            style={{
              minHeight: config.size === 'badge' ? '400px' : '540px',
            }}
          >
            {/* Top Floral Arch Header Banner */}
            <div className={`px-6 py-6 text-center text-white bg-gradient-to-r ${currentTheme.bgGradient} relative overflow-hidden`}>
              {/* Botanical Accent Overlay */}
              <div className="absolute -top-6 -left-6 w-20 h-20 text-white/10">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" />
                </svg>
              </div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 text-white/10">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <circle cx="50" cy="50" r="45" />
                </svg>
              </div>

              <div className="relative z-10">
                {tableNumber && (
                  <div className="inline-block px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-widest mb-2 border border-white/25">
                    📍 {tableNumber}
                  </div>
                )}

                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl">🌹</span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-serif drop-shadow-sm">
                    {config.title}
                  </h2>
                  <span className="text-xl">🌹</span>
                </div>

                <p className="text-rose-100 text-xs sm:text-sm mt-1 font-light drop-shadow-xs max-w-xs mx-auto">
                  {config.tagline}
                </p>
              </div>
            </div>

            {/* Inner Content Body */}
            <div className="p-6 text-center flex flex-col items-center justify-center">
              {/* Ornate Frame around the QR Code */}
              <div className="relative p-4 rounded-2xl bg-white border-2 border-rose-200/90 shadow-lg">
                {/* Vintage Corner Brackets */}
                <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-rose-500 rounded-tl-sm pointer-events-none" />
                <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-rose-500 rounded-tr-sm pointer-events-none" />
                <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-rose-500 rounded-bl-sm pointer-events-none" />
                <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-rose-500 rounded-br-sm pointer-events-none" />

                {qrDataUrl ? (
                  <div className="relative">
                    <img
                      src={qrDataUrl}
                      alt="Gulab Form QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                    />

                    {/* Center Motif Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white shadow-md border-2 border-rose-300 flex items-center justify-center">
                        <span className="text-2xl select-none">
                          {config.logoIcon === 'rose' && '🌹'}
                          {config.logoIcon === 'heart' && '💖'}
                          {config.logoIcon === 'sparkle' && '✨'}
                          {config.logoIcon === 'gift' && '🎁'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-rose-500">
                    <span className="animate-spin text-3xl">🌹</span>
                  </div>
                )}
              </div>

              {/* Call to Action Badge */}
              <div className={`mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${currentTheme.badgeBg}`}>
                <Smartphone className="w-3.5 h-3.5" />
                <span>फोन कैमरे से स्कैन करें • Scan with Mobile</span>
              </div>

              {/* Footer Instructions */}
              {config.includeInstructions && (
                <div className="mt-4 pt-4 border-t border-rose-200/60 max-w-xs text-center">
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {config.instruction}
                  </p>
                  <p className="text-[10px] text-rose-700/80 mt-1 font-script text-base">
                    "खिलते गुलाबों की तरह आपका हर पल खुशहाल रहे"
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Accent Bar */}
            <div className={`h-2.5 w-full bg-gradient-to-r ${currentTheme.bgGradient}`} />
          </div>

          {/* Quick Print Tip */}
          <div className="mt-4 text-center text-xs text-slate-500 no-print max-w-sm">
            💡 <strong>टिप:</strong> "स्टैंडी प्रिंट करें" बटन दबाने पर यह सीधा पेपर या कार्ड शीट पर प्रिंट के लिए तैयार हो जाता है। आप इसे लैमिनेट करके टेबल पर भी रख सकते हैं।
          </div>
        </div>
      </div>
    </div>
  );
};
