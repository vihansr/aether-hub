import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { X, Cloud, CloudUpload, CloudDownload, RefreshCw, User, Check, AlertTriangle, Calendar } from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    todos: any[];
    notes: any[];
    events: any[];
    fitnessLogs: any[];
    sleepLogs: any[];
    foodWaterLogs: Record<string, any>;
  };
  onLoadData: (data: {
    todos: any[];
    notes: any[];
    events: any[];
    fitnessLogs: any[];
    sleepLogs: any[];
    foodWaterLogs: Record<string, any>;
  }) => void;
}

interface UserProfile {
  name: string;
  email: string;
}

const getWeekStartDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const day = d.getDay();
  // Adjust to previous Monday
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
};

const getTodayDateString = () => {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onLoadData,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('aether_sync_user');
    return cached ? JSON.parse(cached) : null;
  });

  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(() => getWeekStartDate(getTodayDateString()));
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: '',
  });
  const [savedWeeks, setSavedWeeks] = useState<{ week_start_date: string; created_at: string }[]>([]);

  useEffect(() => {
    if (profile) {
      fetchSavedWeeks(profile.email);
    }
  }, [profile]);

  const fetchSavedWeeks = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('aether_user_activities')
        .select('week_start_date, created_at')
        .eq('email', email.trim().toLowerCase())
        .order('week_start_date', { ascending: false });

      if (!error && data) {
        setSavedWeeks(data);
      }
    } catch (err) {
      console.error('Failed to fetch saved weeks:', err);
    }
  };

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) {
      setStatus({ type: 'error', message: 'Name and email are required.' });
      return;
    }
    const newProfile = { name: nameInput.trim(), email: emailInput.trim().toLowerCase() };
    localStorage.setItem('aether_sync_user', JSON.stringify(newProfile));
    setProfile(newProfile);
    setStatus({ type: 'success', message: 'Profile saved locally!' });
  };

  const handleUpload = async () => {
    if (!profile) return;
    setStatus({ type: 'loading', message: 'Uploading activity log...' });

    try {
      const payload = {
        name: profile.name,
        email: profile.email,
        week_start_date: selectedWeek,
        activity_log: currentData,
      };

      const { error } = await supabase
        .from('aether_user_activities')
        .upsert(payload, { onConflict: 'email,week_start_date' });

      if (error) {
        throw new Error(error.message);
      }

      setStatus({ type: 'success', message: `Successfully saved activity for week of ${selectedWeek}!` });
      fetchSavedWeeks(profile.email);
    } catch (err: any) {
      setStatus({ type: 'error', message: `Upload failed: ${err.message}` });
    }
  };

  const handleDownload = async (targetWeek: string) => {
    if (!profile) return;
    if (!confirm(`Are you sure you want to download logs for the week of ${targetWeek}? This will overwrite your current local dashboard data.`)) {
      return;
    }

    setStatus({ type: 'loading', message: 'Downloading activity log...' });

    try {
      const { data, error } = await supabase
        .from('aether_user_activities')
        .select('activity_log')
        .eq('email', profile.email)
        .eq('week_start_date', targetWeek)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data && data.activity_log) {
        onLoadData(data.activity_log);
        setStatus({ type: 'success', message: `Successfully restored dashboard state for week of ${targetWeek}!` });
      } else {
        setStatus({ type: 'error', message: 'No data found for the selected week.' });
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: `Download failed: ${err.message}` });
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect profile? Your local data will remain intact.')) {
      localStorage.removeItem('aether_sync_user');
      setProfile(null);
      setNameInput('');
      setEmailInput('');
      setSavedWeeks([]);
      setStatus({ type: 'idle', message: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-[#2d2a26]/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#b08b46]/20 rounded-3xl w-full max-w-lg shadow-[0_10px_50px_rgba(176,139,70,0.12)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#b08b46]/10 flex items-center justify-between bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#b08b46]" />
            <div>
              <h2 className="font-serif italic text-lg text-[#b08b46]">Cloud Sync Center</h2>
              <p className="text-[10px] text-[#2d2a26]/50 uppercase tracking-wider">Multi-User PostgreSQL Persistence</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#b08b46]/10 text-[#2d2a26]/60 hover:text-[#b08b46] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Status Message */}
          {status.message && (
            <div className={`p-3.5 rounded-xl border flex items-start gap-2 text-xs ${
              status.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
              status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              status.type === 'loading' ? 'bg-amber-50 border-amber-100 text-amber-800' :
              'bg-blue-50 border-blue-100 text-blue-800'
            }`}>
              {status.type === 'loading' && <RefreshCw className="w-4 h-4 animate-spin shrink-0 mt-0.5" />}
              {status.type === 'success' && <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {status.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              <span>{status.message}</span>
            </div>
          )}

          {!profile ? (
            /* Setup Profile Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="bg-[#b08b46]/5 border border-[#b08b46]/10 rounded-2xl p-4 text-xs text-[#2d2a26]/70 leading-relaxed">
                Enter your details to create a persistent profile. Your weekly logs will be stored in your own workspace on the PostgreSQL database completely independent of other users.
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#2d2a26]/60 uppercase tracking-wider mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#b08b46]/20 bg-[#faf8f5]/50 focus:bg-white focus:border-[#b08b46] focus:ring-1 focus:ring-[#b08b46] outline-none text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#2d2a26]/60 uppercase tracking-wider mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="e.g. john@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#b08b46]/20 bg-[#faf8f5]/50 focus:bg-white focus:border-[#b08b46] focus:ring-1 focus:ring-[#b08b46] outline-none text-sm transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#b08b46] hover:bg-[#967438] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:shadow"
              >
                <User className="w-4 h-4" />
                Connect Sync Profile
              </button>
            </form>
          ) : (
            /* Sync Controls */
            <div className="space-y-6">
              {/* Active Profile Info */}
              <div className="flex items-center justify-between p-4 bg-[#faf8f5] border border-[#b08b46]/10 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#b08b46]/10 border border-[#b08b46]/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#b08b46]" />
                  </div>
                  <div>
                    <h4 className="font-serif italic font-medium text-sm text-[#2d2a26]">{profile.name}</h4>
                    <p className="text-xs text-[#2d2a26]/55">{profile.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-[10px] text-[#2d2a26]/40 hover:text-rose-600 transition-colors uppercase tracking-wider font-semibold cursor-pointer"
                >
                  Disconnect
                </button>
              </div>

              {/* Action Area */}
              <div className="space-y-4">
                <h3 className="text-xs font-semibold text-[#2d2a26]/80 uppercase tracking-wider border-b border-[#b08b46]/10 pb-1.5">Weekly Save/Restore</h3>
                
                {/* Week Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-[#2d2a26]/60 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#b08b46]" />
                    Select Week Start Date (Monday)
                  </label>
                  <input
                    type="date"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(getWeekStartDate(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#b08b46]/20 bg-[#faf8f5]/50 focus:bg-white focus:border-[#b08b46] outline-none text-sm transition-all"
                  />
                  <p className="text-[10px] text-[#2d2a26]/45 mt-1">
                    Your full log will be saved under the week of: <strong className="text-[#b08b46]">{selectedWeek}</strong>
                  </p>
                </div>

                {/* Backup Button */}
                <button
                  onClick={handleUpload}
                  disabled={status.type === 'loading'}
                  className="w-full py-3 bg-[#b08b46] hover:bg-[#967438] disabled:bg-gray-300 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <CloudUpload className="w-4.5 h-4.5" />
                  Save Week's Activity to Database
                </button>
              </div>

              {/* History / Restores */}
              {savedWeeks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-[#2d2a26]/80 uppercase tracking-wider border-b border-[#b08b46]/10 pb-1.5">Restore From Database</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {savedWeeks.map((week) => (
                      <div 
                        key={week.week_start_date}
                        className="flex items-center justify-between p-3 bg-white border border-[#b08b46]/10 hover:border-[#b08b46]/30 rounded-xl transition-all"
                      >
                        <div>
                          <p className="text-xs font-semibold text-[#2d2a26]/80">Week of {week.week_start_date}</p>
                          <p className="text-[10px] text-[#2d2a26]/45">Saved: {new Date(week.created_at).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleDownload(week.week_start_date)}
                          className="px-2.5 py-1 bg-[#b08b46]/10 hover:bg-[#b08b46]/20 text-[#b08b46] rounded-lg text-[10px] font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CloudDownload className="w-3.5 h-3.5" />
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
