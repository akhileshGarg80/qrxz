/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { FloralBackground } from './components/FloralBackground';
import { HeaderNav } from './components/HeaderNav';
import { RoseForm } from './components/RoseForm';
import { QRStudio } from './components/QRStudio';
import { SubmissionsDashboard } from './components/SubmissionsDashboard';
import { getStoredSubmissions } from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('form');
  const [showPetals, setShowPetals] = useState<boolean>(true);
  const [submissionsCount, setSubmissionsCount] = useState<number>(0);

  // Sync with URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'qr') {
        setCurrentView('qr-studio');
      } else if (viewParam === 'submissions' || viewParam === 'admin') {
        setCurrentView('submissions');
      } else {
        // Default to form view for maximum direct QR scan experience!
        setCurrentView('form');
      }

      // Initial count
      setSubmissionsCount(getStoredSubmissions().length);

      const handleUpdate = () => {
        setSubmissionsCount(getStoredSubmissions().length);
      };
      window.addEventListener('gulab_submissions_updated', handleUpdate);
      return () => {
        window.removeEventListener('gulab_submissions_updated', handleUpdate);
      };
    }
  }, []);

  const handleSelectView = (view: ViewMode) => {
    setCurrentView(view);
    // Update browser URL query without reloading
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (view === 'form') {
        url.searchParams.set('view', 'form');
      } else if (view === 'qr-studio') {
        url.searchParams.set('view', 'qr');
      } else {
        url.searchParams.set('view', 'submissions');
      }
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative font-sans text-slate-800 bg-[#fff5f6]">
      {/* Dynamic Animated Falling Rose Petals & Botanical Glow */}
      <FloralBackground showPetals={showPetals} />

      {/* Top Header Navigation Bar (Hidden during print) */}
      <HeaderNav
        currentView={currentView}
        onSelectView={handleSelectView}
        showPetals={showPetals}
        onTogglePetals={() => setShowPetals(!showPetals)}
        submissionsCount={submissionsCount}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 flex flex-col justify-start">
        {currentView === 'form' && (
          <RoseForm
            onGoToAdmin={() => handleSelectView('qr-studio')}
            showAdminLink={true}
          />
        )}

        {currentView === 'qr-studio' && (
          <QRStudio
            onOpenFormPreview={() => handleSelectView('form')}
          />
        )}

        {currentView === 'submissions' && (
          <SubmissionsDashboard
            onGoToForm={() => handleSelectView('form')}
            onGoToQR={() => handleSelectView('qr-studio')}
          />
        )}
      </main>

      {/* Subtle Romantic Footer */}
      <footer className="mt-auto py-5 text-center text-xs text-rose-800/80 border-t border-rose-200/60 bg-white/40 backdrop-blur-xs no-print relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-script text-lg text-rose-900">
            <span>🌹 गुलाब फॉर्म एवं क्यूआर कोड प्रिंट स्टूडियो</span>
          </div>
          <div className="text-[11px] text-slate-500">
            डेटा केवल आपके लोकलस्टोरेज (LocalStorage) में सुरक्षित सहेजा जाता है।
          </div>
          <div className="flex items-center gap-3 text-rose-700 font-medium">
            <button
              type="button"
              onClick={() => handleSelectView('qr-studio')}
              className="hover:underline"
            >
              क्यूआर स्टैंडी प्रिंट करें
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleSelectView('submissions')}
              className="hover:underline"
            >
              रिकॉर्ड्स ({submissionsCount})
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
