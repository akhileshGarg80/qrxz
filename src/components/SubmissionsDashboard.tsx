import React, { useState, useEffect } from 'react';
import { 
  getStoredSubmissions, 
  deleteSubmission, 
  clearAllSubmissions, 
  seedDemoSubmissions 
} from '../utils/storage';
import { FormSubmission } from '../types';
import { 
  Inbox, 
  Search, 
  Download, 
  Trash2, 
  Calendar, 
  Phone, 
  ExternalLink, 
  Filter, 
  Sparkles,
  Eye,
  FileSpreadsheet,
  X,
  Database
} from 'lucide-react';

interface SubmissionsDashboardProps {
  onGoToForm: () => void;
  onGoToQR: () => void;
}

export const SubmissionsDashboard: React.FC<SubmissionsDashboardProps> = ({ onGoToForm, onGoToQR }) => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<FormSubmission | null>(null);

  const loadData = () => {
    setSubmissions(getStoredSubmissions());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('gulab_submissions_updated', handleUpdate);
    return () => {
      window.removeEventListener('gulab_submissions_updated', handleUpdate);
    };
  }, []);

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm('क्या आप सचमुच इस प्रतिक्रिया को हटाना चाहते हैं? (Delete this submission?)')) {
      deleteSubmission(id);
      loadData();
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('सावधान: क्या आप सभी स्थानीय फॉर्म डेटा हटाना चाहते हैं? (Clear all responses in LocalStorage?)')) {
      clearAllSubmissions();
      loadData();
      setSelectedItem(null);
    }
  };

  const handleSeed = () => {
    seedDemoSubmissions();
    loadData();
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['Token', 'Full Name', 'Contact', 'Category', 'Rose Rating', 'Rose Mood', 'Message', 'Date', 'Source'];
    const rows = submissions.map(s => [
      `"${s.tokenNumber}"`,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.contact.replace(/"/g, '""')}"`,
      `"${s.category}"`,
      s.roseRating,
      `"${s.roseMood}"`,
      `"${s.message.replace(/"/g, '""')}"`,
      `"${s.submittedAt}"`,
      `"${s.source}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `gulab_form_responses_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered submissions
  const filtered = submissions.filter(item => {
    const matchesSearch = 
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesRating = filterRating === 'all' || item.roseRating === Number(filterRating);

    return matchesSearch && matchesCategory && matchesRating;
  });

  // Calculate Metrics
  const totalCount = submissions.length;
  const avgRating = totalCount > 0 
    ? (submissions.reduce((acc, s) => acc + s.roseRating, 0) / totalCount).toFixed(1)
    : '0';
  const qrScansCount = submissions.filter(s => s.source === 'qr_scan').length;

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-200/60 pb-5 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-900 text-xs font-semibold mb-1.5">
            <Database className="w-3.5 h-3.5 text-rose-600" />
            <span>लोकलस्टोरेज डेटाबेस • LocalStorage Vault</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-rose-950 font-serif">
            गुलाब फॉर्म सबमिशन रिकॉर्ड्स (Responses)
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            क्यूआर स्कैन और फॉर्म से प्राप्त सभी संदेश यहाँ आपके ब्राउज़र के LocalStorage में सुरक्षित दर्ज हैं।
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {submissions.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV / Excel डाउनलोड</span>
            </button>
          )}

          {submissions.length === 0 && (
            <button
              type="button"
              onClick={handleSeed}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>डेमो डेटा भरें (Load Demo)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onGoToForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-900 border border-rose-300 text-xs sm:text-sm font-medium shadow-xs transition-colors"
          >
            <span>नया फॉर्म भरें</span>
            <ExternalLink className="w-3.5 h-3.5 text-rose-500" />
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-rose-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">कुल सबमिशन (Total)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-950 font-mono">{totalCount}</span>
            <span className="text-xs text-rose-600 font-medium">प्रतिक्रियाएं</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-rose-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">औसत गुलाब रेटिंग</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">{avgRating}</span>
            <span className="text-sm">🌹 / 5</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-rose-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">क्यूआर स्कैन से आए</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-purple-900 font-mono">{qrScansCount}</span>
            <span className="text-xs text-purple-600 font-medium">QR Scanned</span>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-rose-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">स्टोरेज स्थिति</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm font-bold text-emerald-700">सुरक्षित लोकल (Active)</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">LocalStorage Persistence</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-rose-200/80 shadow-xs mb-6 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="नाम, संपर्क नंबर, टोकन या संदेश खोजें..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">सभी श्रेणियाँ (All)</option>
            <option value="feedback">🌹 प्रतिक्रिया (Feedback)</option>
            <option value="greeting">💌 बधाई (Greeting)</option>
            <option value="inquiry">🌿 पूछताछ (Inquiry)</option>
            <option value="event">💍 उत्सव (Event)</option>
          </select>

          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700"
          >
            <option value="all">सभी रेटिंग (All Roses)</option>
            <option value="5">⭐⭐⭐⭐⭐ (5 Roses)</option>
            <option value="4">⭐⭐⭐⭐ (4 Roses)</option>
            <option value="3">⭐⭐⭐ (3 Roses)</option>
          </select>

          {submissions.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              title="Clear all LocalStorage data"
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-white/80 rounded-3xl border border-dashed border-rose-300 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3 text-3xl">
            🥀
          </div>
          <h3 className="text-lg font-bold text-rose-950">अभी कोई सबमिशन नहीं मिला</h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mt-1">
            {searchQuery
              ? 'खोज मापदंड के अनुसार कोई रिकॉर्ड नहीं मिला। खोज शब्द साफ़ करें।'
              : 'जैसे ही कोई क्यूआर कोड स्कैन करके फॉर्म भरेगा, उसका विवरण यहाँ स्वतः दिखाई देगा।'}
          </p>

          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSeed}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold shadow-xs hover:bg-rose-700"
            >
              नमूना डेटा लोड करें (Load Demo Responses)
            </button>
            <button
              type="button"
              onClick={onGoToForm}
              className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-900 text-xs font-semibold hover:bg-rose-50"
            >
              स्वयं एक फॉर्म भरें
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => {
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="bg-white/95 rounded-2xl border border-rose-200/80 p-4 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Mood Tag Accent Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400" />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
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

                  <h3 className="font-bold text-rose-950 text-sm group-hover:text-rose-700 transition-colors">
                    {item.fullName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Phone className="w-3 h-3 text-rose-400" />
                    <span>{item.contact}</span>
                  </div>

                  {/* Rose Rating Row */}
                  <div className="flex items-center gap-1 my-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="text-xs">
                        {i < item.roseRating ? '🌹' : '🥀'}
                      </span>
                    ))}
                    <span className="text-[11px] text-rose-900 font-bold ml-1">
                      {item.roseRating}/5
                    </span>
                  </div>

                  {/* Message Snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 italic bg-rose-50/40 p-2 rounded-lg border border-rose-100">
                    "{item.message}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-rose-100 text-[11px]">
                  <span className="text-rose-700 capitalize font-medium">
                    {item.category} • {item.source === 'qr_scan' ? '📱 QR' : '🔗 Web'}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL / गुलाब पत्र विस्तार */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-rose-300 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-2xl">
                🌹
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {selectedItem.tokenNumber}
                </span>
                <h2 className="text-xl font-bold text-rose-950 font-serif mt-1">
                  {selectedItem.fullName}
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-sm bg-rose-50/50 p-4 rounded-2xl border border-rose-200">
              <div className="flex justify-between">
                <span className="text-slate-500">संपर्क / Contact:</span>
                <span className="font-semibold text-slate-800">{selectedItem.contact}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">गुलाब रेटिंग / Rating:</span>
                <span className="flex items-center gap-1 font-bold text-rose-700">
                  {Array.from({ length: selectedItem.roseRating }).map((_, i) => (
                    <span key={i}>🌹</span>
                  ))}
                  <span className="ml-1">({selectedItem.roseRating} / 5)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">श्रेणी / Category:</span>
                <span className="font-medium text-slate-800 capitalize">{selectedItem.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">भाव / Mood:</span>
                <span className="font-medium text-rose-800">{selectedItem.roseMood}</span>
              </div>
              {selectedItem.favoriteFlower && (
                <div className="flex justify-between">
                  <span className="text-slate-500">पसंदीदा फूल:</span>
                  <span className="font-medium text-slate-800">{selectedItem.favoriteFlower}</span>
                </div>
              )}
              {selectedItem.specialDate && (
                <div className="flex justify-between">
                  <span className="text-slate-500">अवसर तारीख:</span>
                  <span className="font-medium text-slate-800">{selectedItem.specialDate}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-rose-200">
                <span>स्रोत: {selectedItem.source === 'qr_scan' ? 'क्यूआर स्कैन (QR Scan)' : 'डायरेक्ट लिंक (Direct)'}</span>
                <span>{new Date(selectedItem.submittedAt).toLocaleString('hi-IN')}</span>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
                पूर्ण संदेश (Message):
              </label>
              <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                {selectedItem.message}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDelete(selectedItem.id)}
                className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                यह रिकॉर्ड हटाएं
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
