import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Camera, Save, Lock, LogOut, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Profile Form State
  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name || '', email: user.email || '' });
    }
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess('');
    try {
      await authService.updateProfile(profileData);
      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    setPasswordSaving(true);
    setPasswordError('');
    setPasswordSuccess('');
    try {
      // Assuming updatePassword method is added to authService
      if (authService.updatePassword) {
        await authService.updatePassword(passwordData);
        setPasswordSuccess('Password updated successfully.');
        setPasswordData({ currentPassword: '', newPassword: '' });
      } else {
        throw new Error('Update password not implemented in frontend service yet.');
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || err.message || 'Failed to update password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        if (authService.deleteAccount) {
            await authService.deleteAccount();
            logout();
            navigate(ROUTES.HOME);
        } else {
            throw new Error('Coming soon.');
        }
      } catch (err) {
        alert(err.response?.data?.message || err.message || 'Failed to delete account.');
      }
    }
  };

  return (
    <div className="p-6 md:p-8 lg:p-10 animate-[fadeIn_0.5s_ease-out] max-w-4xl mx-auto space-y-8 h-full bg-[#F8FAFC]">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-[#64748B] mt-2 font-medium">Manage your account preferences and security.</p>
      </div>

      {/* Profile Settings Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#E2E8F0] bg-[#F1F5F9]/50">
          <h2 className="text-xl font-bold text-[#0F172A]">Profile Settings</h2>
          <p className="text-sm text-[#64748B] mt-1">Update your personal information and avatar.</p>
        </div>
        <div className="p-8">
          
          {profileSuccess && (
            <div className="mb-6 p-4 bg-[#F0FDF4] text-[#22C55E] rounded-xl text-sm font-semibold flex items-center gap-2 border border-[#22C55E]/20">
              <CheckCircle2 size={18} /> {profileSuccess}
            </div>
          )}
          {profileError && (
            <div className="mb-6 p-4 bg-[#FEF2F2] text-[#EF4444] rounded-xl text-sm font-semibold flex items-center gap-2 border border-[#EF4444]/20">
              <AlertCircle size={18} /> {profileError}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Preview */}
            <div className="flex flex-col items-center space-y-4 shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFE8DE] to-[#FED7AA] flex items-center justify-center text-[#FF6B35] font-bold text-3xl shadow-sm ring-4 ring-[#FFE8DE] relative overflow-hidden group">
                <span className="relative z-10">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20">
                  <Camera className="text-white w-6 h-6" />
                </div>
              </div>
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">Avatar</span>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleProfileSave} className="flex-1 space-y-5 w-full">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#64748B]">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] bg-white font-medium text-[#0F172A] transition-all outline-none"
                  placeholder="Your Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#64748B]">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] bg-white font-medium text-[#0F172A] transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-[#0F172A] text-white font-bold rounded-xl shadow-sm hover:bg-[#1E293B] hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  {profileSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Security Settings Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#E2E8F0] bg-[#F1F5F9]/50">
          <h2 className="text-xl font-bold text-[#0F172A]">Security Settings</h2>
          <p className="text-sm text-[#64748B] mt-1">Keep your account secure by updating your password.</p>
        </div>
        <div className="p-8">

          {passwordSuccess && (
            <div className="mb-6 p-4 bg-[#F0FDF4] text-[#22C55E] rounded-xl text-sm font-semibold flex items-center gap-2 border border-[#22C55E]/20">
              <CheckCircle2 size={18} /> {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="mb-6 p-4 bg-[#FEF2F2] text-[#EF4444] rounded-xl text-sm font-semibold flex items-center gap-2 border border-[#EF4444]/20">
              <AlertCircle size={18} /> {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSave} className="space-y-5 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#64748B]">Current Password</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] bg-white font-medium text-[#0F172A] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#64748B]">New Password</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-2.5 rounded-xl border border-[#CBD5E1] focus:ring-2 focus:ring-[#FF6B35]/20 focus:border-[#FF6B35] bg-white font-medium text-[#0F172A] transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={passwordSaving}
                className="px-6 py-2.5 bg-[#FF6B35] text-white font-bold rounded-xl shadow-sm hover:bg-[#E85D2C] hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {passwordSaving ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Update Password
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Account Actions Section */}
      <section className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] overflow-hidden">
        <div className="px-8 py-6 border-b border-[#E2E8F0] bg-[#F1F5F9]/50">
          <h2 className="text-xl font-bold text-[#0F172A]">Account Actions</h2>
          <p className="text-sm text-[#64748B] mt-1">Manage your active session and account status.</p>
        </div>
        <div className="p-8 flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#E2E8F0] text-[#0F172A] font-bold rounded-xl shadow-sm hover:bg-[#F8FAFC] transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
          
          <button 
            onClick={handleDeleteAccount}
            className="w-full sm:w-auto px-6 py-2.5 bg-white border border-[#FEE2E2] text-[#EF4444] font-bold rounded-xl shadow-sm hover:bg-[#FEF2F2] transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </section>

    </div>
  );
};

export default SettingsPage;
