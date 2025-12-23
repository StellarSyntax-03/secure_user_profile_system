import React, { useEffect, useState } from 'react';
import { UserProfile, AuthStatus } from '../types';
import { mockFetchProfile, mockUpdatePassword, mockRevokeToken } from '../services/mockServer';
import Modal from '../components/Modal';
import Input from '../components/Input';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);
  const [error, setError] = useState<string>('');
  const [isRevealed, setIsRevealed] = useState(false);
  
  // UI States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Revoke States
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);
  
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Clear notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error("No token found");
      
      const data = await mockFetchProfile(token);
      setProfile(data);
      setStatus(AuthStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch profile");
      setStatus(AuthStatus.ERROR);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  // --- Action Handlers ---

  const handleExportData = () => {
    if (!profile) return;
    try {
      // Create a JSON blob of the profile
      const dataStr = JSON.stringify({
        ...profile,
        exportedAt: new Date().toISOString(),
        note: "CONFIDENTIAL - SECUREID SYSTEM EXPORT"
      }, null, 2);
      
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `secure-id-export-${profile.id.substring(0, 8)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showToast("Encrypted profile data exported successfully.", "success");
    } catch (e) {
      showToast("Failed to export data.", "error");
    }
  };

  const handleRevokeConfirm = async () => {
    setRevokeLoading(true);
    try {
        const token = localStorage.getItem('auth_token');
        if (token) {
            await mockRevokeToken(token);
        }
        // After server acknowledges, we clear local session
        onLogout();
    } catch (e) {
        showToast("Failed to revoke token. Please try again.", "error");
        setRevokeLoading(false);
        setIsRevokeModalOpen(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordForm.new.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setPasswordLoading(true);
    try {
      if (!profile) throw new Error("Profile not loaded");
      await mockUpdatePassword(profile.id, passwordForm.new);
      showToast("Password updated successfully.", "success");
      setIsPasswordModalOpen(false);
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPasswordError("Failed to update password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (status === AuthStatus.LOADING) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-darker relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-24 right-4 z-[60] px-6 py-3 rounded-lg shadow-xl backdrop-blur-md border animate-fade-in ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto animate-slide-up">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Secure Dashboard</h1>
            <p className="text-slate-400">Manage your encrypted identity profile.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Encrypted Connection Active
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
                    {profile.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
                    <p className="text-slate-400 text-sm">{profile.email}</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-md bg-white/5 text-xs text-slate-400 font-mono hidden sm:block">
                  ID: {profile.id.slice(0, 8)}...
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-darker/50 border border-white/5">
                  <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">
                    System Unique ID
                  </label>
                  <p className="text-slate-200 font-mono break-all">{profile.id}</p>
                </div>

                <div className="p-4 rounded-xl bg-darker/50 border border-white/5 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-primary uppercase tracking-wider">
                      Aadhaar / National ID (Encrypted)
                    </label>
                    <button 
                      onClick={() => setIsRevealed(!isRevealed)}
                      className="text-xs text-slate-400 hover:text-white transition-colors"
                    >
                      {isRevealed ? 'Hide' : 'Decrypt & Reveal'}
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`font-mono text-lg transition-all duration-300 ${isRevealed ? 'text-white tracking-widest' : 'text-slate-500 blur-sm select-none'}`}>
                      {isRevealed ? profile.aadhaarDecrypted : 'XXXX-XXXX-XXXX-XXXX'}
                    </p>
                    {isRevealed && (
                      <span className="text-emerald-500 text-xs flex items-center gap-1 animate-fade-in ml-2">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Decrypted
                      </span>
                    )}
                  </div>
                  
                  {!isRevealed && (
                    <div className="mt-2 text-xs text-slate-600 truncate font-mono">
                      Cipher: {profile.aadhaarEncrypted.substring(0, 40)}...
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Audit Log Mockup */}
            <div className="glass-panel rounded-2xl p-6">
               <h3 className="text-lg font-semibold text-white mb-4">Access Logs</h3>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${i===1 ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                        <p className="text-sm text-slate-300">Profile Data Decryption Request</p>
                      </div>
                      <span className="text-xs text-slate-500 font-mono">
                        {new Date(Date.now() - i * 1000 * 60 * 60).toLocaleTimeString()}
                      </span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
             <div className="glass-panel rounded-2xl p-6 bg-gradient-to-b from-primary/10 to-transparent border-primary/20">
                <h3 className="text-white font-semibold mb-2">Security Status</h3>
                <div className="flex items-center gap-2 mb-4">
                   <div className="text-4xl font-bold text-white">98%</div>
                   <div className="text-xs text-emerald-400 font-medium">+2.4%</div>
                </div>
                <div className="w-full bg-darker rounded-full h-1.5 mb-2">
                   <div className="bg-primary h-1.5 rounded-full w-[98%]"></div>
                </div>
                <p className="text-xs text-slate-400">Your profile meets the highest encryption standards (AES-256).</p>
             </div>

             <div className="glass-panel rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-all flex items-center gap-3 group border border-transparent hover:border-white/10 active:scale-[0.98]"
                  >
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <span className="truncate">Change Password</span>
                  </button>
                  
                  <button 
                    onClick={handleExportData}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-slate-300 transition-all flex items-center gap-3 group border border-transparent hover:border-white/10 active:scale-[0.98]"
                  >
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </div>
                    <span className="truncate">Export Encrypted Data</span>
                  </button>
                  
                  <button 
                    onClick={() => setIsRevokeModalOpen(true)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-sm text-red-400 transition-all flex items-center gap-3 group border border-transparent hover:border-red-500/30 active:scale-[0.98]"
                  >
                    <div className="flex-shrink-0">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                    </div>
                    <span className="truncate">Revoke Access Tokens</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      <Modal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
        title="Change Password"
      >
        <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.current}
            onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
            placeholder="Enter current password"
            required
          />
          <Input
            label="New Password"
            type="password"
            value={passwordForm.new}
            onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
            placeholder="Enter new password"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordForm.confirm}
            onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
            placeholder="Confirm new password"
            required
          />
          
          {passwordError && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 p-2 rounded-lg">
              {passwordError}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={passwordLoading}
              className="flex-1 py-2.5 bg-primary hover:bg-sky-400 text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/25 transition-all"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Revoke Access Confirmation Modal */}
      <Modal 
        isOpen={isRevokeModalOpen} 
        onClose={() => setIsRevokeModalOpen(false)} 
        title="Revoke Access"
      >
        <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
            
            <p className="text-slate-300">
                Are you sure you want to revoke all access tokens? 
                This will invalidate your current session and you will be logged out immediately.
            </p>

            <div className="flex gap-3 mt-8">
                <button
                type="button"
                onClick={() => setIsRevokeModalOpen(false)}
                disabled={revokeLoading}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                Cancel
                </button>
                <button
                type="button"
                onClick={handleRevokeConfirm}
                disabled={revokeLoading}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-red-600/25 transition-all flex items-center justify-center gap-2"
                >
                {revokeLoading ? (
                    <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Revoking...
                    </>
                ) : 'Yes, Revoke'}
                </button>
            </div>
        </div>
      </Modal>

    </div>
  );
};

export default Dashboard;