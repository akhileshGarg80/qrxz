import React, { useState, useEffect } from 'react';
import { 
  getStoredRegistrations, 
  deleteRegistration, 
  clearAllRegistrations, 
  seedDemoRegistrations 
} from '../utils/storage';
import { 
  StudentRegistration, 
  INSTITUTE_NAME, 
  INSTITUTE_WHATSAPP_NUMBER 
} from '../types';
import { 
  Search, 
  Trash2, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowLeft, 
  Sparkles, 
  FileSpreadsheet, 
  X, 
  MessageCircle, 
  GraduationCap
} from 'lucide-react';

interface SubmissionsDashboardProps {
  onBackToForm: () => void;
}

export const SubmissionsDashboard: React.FC<SubmissionsDashboardProps> = ({ onBackToForm }) => {
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<StudentRegistration | null>(null);

  const loadData = () => {
    setRegistrations(getStoredRegistrations());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('krishan_registrations_updated', handleUpdate);
    return () => {
      window.removeEventListener('krishan_registrations_updated', handleUpdate);
    };
  }, []);

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('क्या आप सचमुच इस विद्यार्थी का रजिस्ट्रेशन हटाना चाहते हैं?')) {
      deleteRegistration(id);
      loadData();
      if (selectedItem?.id === id) setSelectedItem(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('सावधान: क्या आप संस्थान के सभी स्थानीय रिकॉर्ड्स हटाना चाहते हैं?')) {
      clearAllRegistrations();
      loadData();
      setSelectedItem(null);
    }
  };

  const handleExportCSV = () => {
    if (registrations.length === 0) return;
    const headers = ['Token', 'Full Name', 'Father Name', 'Mobile', 'Gmail', 'Address', 'Course', 'Qualification', 'Message', 'Date'];
    const rows = registrations.map(r => [
      `"${r.tokenNumber}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${(r.fatherName || '').replace(/"/g, '""')}"`,
      `"${r.mobile.replace(/"/g, '""')}"`,
      `"${r.gmail.replace(/"/g, '""')}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.course === 'OTHER' ? (r.customCourse || 'OTHER') : r.course}"`,
      `"${r.qualification.replace(/"/g, '""')}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      `"${r.submittedAt}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Krishan_Computer_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = registrations.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.fullName.toLowerCase().includes(q) ||
      item.mobile.toLowerCase().includes(q) ||
      item.gmail.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q) ||
      item.course.toLowerCase().includes(q) ||
      item.tokenNumber.toLowerCase().includes(q)
    );
  });

  const sendWhatsApp = (item: StudentRegistration) => {
    const courseName = item.course === 'OTHER' ? item.customCourse : item.course;
    const text = `🚩 *${INSTITUTE_NAME} - ऑनलाइन प्रवेश विवरण*\n\n` +
      `📋 *टोकन क्र:* ${item.tokenNumber}\n` +
      `👤 *छात्र का नाम:* ${item.fullName}\n` +
      (item.fatherName ? `👨‍👦 *पिता का नाम:* ${item.fatherName}\n` : '') +
      `📱 *मोबाइल:* ${item.mobile}\n` +
      `📧 *Gmail:* ${item.gmail}\n` +
      `🏠 *पता:* ${item.address}\n` +
      `🎓 *कोर्स:* ${courseName}\n` +
      `📚 *योग्यता:* ${item.qualification}\n\n` +
      `📍 *संस्थान:* ${INSTITUTE_NAME}, नागोद`;
    window.open(`https://wa.me/91${INSTITUTE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 mb-5 border-b border-amber-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToForm}
            className="p-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 transition-colors shadow-xs"
            title="वापस फॉर्म पर जाएं"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-amber-950 font-serif">
              {INSTITUTE_NAME} - रजिस्ट्रेशन रिकॉर्ड्स
            </h1>
            <p className="text-xs text-slate-500">
              कुल {registrations.length} छात्र पंजीकृत (LocalStorage)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {registrations.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-xs transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>CSV एक्सेल डाउनलोड</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-medium transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>साफ़ करें</span>
              </button>
            </>
          )}

          {registrations.length === 0 && (
            <button
              type="button"
              onClick={() => {
                seedDemoRegistrations();
                loadData();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>नमूना डेटा लोड करें</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      {registrations.length > 0 && (
        <div className="relative mb-5">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="छात्र का नाम, मोबाइल नंबर, पता, कोर्स या टोकन खोजें..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
          />
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="bg-white/90 rounded-3xl border border-dashed border-amber-300 p-10 text-center shadow-xs">
          <div className="text-4xl mb-2">🎓</div>
          <h3 className="text-base font-bold text-amber-950">अभी कोई रिकॉर्ड नहीं मिला</h3>
          <p className="text-slate-500 text-xs mt-1">
            छात्रों द्वारा फॉर्म भरते ही विवरण यहाँ प्रदर्शित होगा।
          </p>
          <button
            type="button"
            onClick={onBackToForm}
            className="mt-4 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
          >
            फॉर्म पर जाएं
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl border-2 border-amber-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  {item.tokenNumber}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.submittedAt).toLocaleDateString('hi-IN', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-amber-950 text-sm">{item.fullName}</h3>
                  {item.fatherName && (
                    <p className="text-xs text-slate-500">पिता: {item.fatherName}</p>
                  )}
                </div>

                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 text-xs font-bold border border-purple-200">
                  {item.course === 'OTHER' ? item.customCourse : item.course}
                </span>
              </div>

              <div className="mt-2 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-mono font-medium">{item.mobile}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span className="truncate">{item.gmail}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span className="truncate">{item.address}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    sendWhatsApp(item);
                  }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp भेजें</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(item.id, e)}
                  className="p-1 rounded text-slate-400 hover:text-red-600"
                  title="हटाएं"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal View */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-400 relative">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🎓</span>
              <div>
                <span className="font-mono text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  {selectedItem.tokenNumber}
                </span>
                <h2 className="text-lg font-bold text-amber-950 mt-0.5">{selectedItem.fullName}</h2>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
              {selectedItem.fatherName && (
                <div className="flex justify-between">
                  <span className="text-slate-500">पिता का नाम:</span>
                  <span className="font-medium text-slate-800">{selectedItem.fatherName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">मोबाइल:</span>
                <span className="font-medium font-mono text-slate-800">{selectedItem.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Gmail:</span>
                <span className="font-medium text-slate-800">{selectedItem.gmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">पता:</span>
                <span className="font-medium text-slate-800 text-right">{selectedItem.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">कोर्स:</span>
                <span className="font-bold text-purple-900">
                  {selectedItem.course === 'OTHER' ? selectedItem.customCourse : selectedItem.course}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">योग्यता:</span>
                <span className="font-medium text-slate-800">{selectedItem.qualification}</span>
              </div>
            </div>

            {selectedItem.message && (
              <div className="mt-3">
                <span className="text-[11px] text-slate-500 block mb-1">संदेश:</span>
                <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {selectedItem.message}
                </p>
              </div>
            )}

            <div className="mt-5 flex justify-between items-center">
              <button
                type="button"
                onClick={() => sendWhatsApp(selectedItem)}
                className="px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp पर 9303616654 को भेजें</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
