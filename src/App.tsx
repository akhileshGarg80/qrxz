/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode, INSTITUTE_NAME, INSTITUTE_WHATSAPP_NUMBER } from './types';
import { FloralBackground } from './components/FloralBackground';
import { StudentRegistrationForm } from './components/StudentRegistrationForm';
import { SubmissionsDashboard } from './components/SubmissionsDashboard';
import { getStoredRegistrations } from './utils/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('form');
  const [savedCount, setSavedCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'records' || params.get('view') === 'admin') {
        setCurrentView('submissions');
      } else {
        setCurrentView('form');
      }

      setSavedCount(getStoredRegistrations().length);

      const handleUpdate = () => {
        setSavedCount(getStoredRegistrations().length);
      };
      window.addEventListener('krishan_registrations_updated', handleUpdate);
      return () => {
        window.removeEventListener('krishan_registrations_updated', handleUpdate);
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative font-sans text-slate-800 bg-[#fffdf7]">
      {/* Attractive festive floral background with drifting petals */}
      <FloralBackground showPetals={true} />

      {/* Main Single Page Content */}
      <main className="flex-1 flex flex-col justify-start">
        {currentView === 'form' ? (
          <StudentRegistrationForm
            onOpenRecords={() => setCurrentView('submissions')}
            savedCount={savedCount}
          />
        ) : (
          <SubmissionsDashboard
            onBackToForm={() => setCurrentView('form')}
          />
        )}
      </main>

      {/* Official Footer with Krishan Computer Nagod contact */}
      <footer className="mt-auto py-4 text-center text-xs text-amber-950/80 border-t border-amber-200/60 bg-white/60 backdrop-blur-xs no-print relative z-10">
        <div className="max-w-2xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <p className="font-semibold text-amber-950">
            🚩 {INSTITUTE_NAME} • नागोद (म.प्र.)
          </p>
          <p className="text-slate-600">
            हेल्पलाइन / WhatsApp: <strong className="font-mono text-amber-900">{INSTITUTE_WHATSAPP_NUMBER}</strong>
          </p>
        </div>
      </footer>
    </div>
  );
}
