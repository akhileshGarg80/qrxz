import React from 'react';
import { ViewMode } from '../types';
import { QrCode, FileText, Database, Sparkles, Flower2 } from 'lucide-react';

interface HeaderNavProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  showPetals: boolean;
  onTogglePetals: () => void;
  submissionsCount: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentView,
  onSelectView,
  showPetals,
  onTogglePetals,
  submissionsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-rose-200/80 shadow-2xs no-print">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectView('form')}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 via-rose-500 to-pink-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <span className="text-xl">🌹</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-rose-950 font-serif text-base tracking-tight">
                गुलाब स्टूडियो
              </span>
              <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full uppercase">
                QR & Form
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5">
              Scan QR to Instant Rose Form
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="flex items-center gap-1 bg-rose-100/60 p-1 rounded-2xl border border-rose-200/80">
          <button
            type="button"
            onClick={() => onSelectView('form')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'form'
                ? 'bg-white text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-rose-900 hover:bg-white/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-600" />
            <span>गुलाब फॉर्म (Form Page)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('qr-studio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'qr-studio'
                ? 'bg-white text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-rose-900 hover:bg-white/40'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-rose-600" />
            <span>क्यूआर स्टैंडी (QR & Print)</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectView('submissions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all relative ${
              currentView === 'submissions'
                ? 'bg-white text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-rose-900 hover:bg-white/40'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-rose-600" />
            <span>डेटा रिकॉर्ड्स</span>
            {submissionsCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-rose-600 text-white">
                {submissionsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right actions: Petals animation toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onTogglePetals}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              showPetals 
                ? 'bg-rose-50 text-rose-800 border-rose-300' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
            title={showPetals ? 'गुलाब पंखुड़ियां बंद करें' : 'गुलाब पंखुड़ियां चालू करें'}
          >
            <Flower2 className={`w-3.5 h-3.5 ${showPetals ? 'text-rose-600 animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
            <span className="hidden md:inline">{showPetals ? 'पंखुड़ियां चालू' : 'पंखुड़ियां बंद'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
