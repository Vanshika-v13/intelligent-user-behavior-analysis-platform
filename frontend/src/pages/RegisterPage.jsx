import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants/routes';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    if (!formData.fullName.trim()) {
      return 'Please enter your full name.';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'Please enter a valid email address.';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await register({ 
        name: formData.fullName, 
        email: formData.email, 
        password: formData.password 
      });
      setSuccess(true);
      setTimeout(() => {
        // Since we automatically login on register, redirect to courses instead of login
        navigate(ROUTES.COURSES);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.4s_ease-out]">
      <div className="w-full max-w-[1000px] bg-white rounded-[32px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-stone-200/60 flex flex-col md:flex-row">
        
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white order-2 md:order-1">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[var(--color-primary-text)] tracking-tight mb-2">Create Account</h1>
            <p className="text-[15px] text-[var(--color-secondary-text)]">
              Already have an account? <Link to={ROUTES.LOGIN} className="text-orange-600 font-bold hover:underline">Log in</Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 animate-[fadeIn_0.3s]">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-700 animate-[fadeIn_0.3s]">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <p className="text-[14px] font-medium">Registration successful! Redirecting to login...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-[14px] font-bold text-[var(--color-primary-text)] pl-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 text-[var(--color-primary-text)] rounded-[16px] pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[15px]"
                  placeholder="Jane Doe"
                  disabled={loading || success}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-bold text-[var(--color-primary-text)] pl-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Mail size={18} />
                </div>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 text-[var(--color-primary-text)] rounded-[16px] pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[15px]"
                  placeholder="you@example.com"
                  disabled={loading || success}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-bold text-[var(--color-primary-text)] pl-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 text-[var(--color-primary-text)] rounded-[16px] pl-11 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[15px]"
                  placeholder="At least 6 characters"
                  disabled={loading || success}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-400 hover:text-stone-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[14px] font-bold text-[var(--color-primary-text)] pl-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-stone-50 border border-stone-200 text-[var(--color-primary-text)] rounded-[16px] pl-11 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-[15px]"
                  placeholder="Repeat your password"
                  disabled={loading || success}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || success}
              className="mt-2 w-full bg-orange-500 text-white rounded-[16px] py-4 text-[16px] font-bold hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
          
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:block w-full md:w-1/2 bg-stone-50 p-12 relative order-1 md:order-2">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
              alt="Join LearnPulse" 
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          <div className="relative h-full flex flex-col justify-end text-white">
            <h2 className="text-3xl font-bold mb-4">Start Learning Today</h2>
            <p className="text-[17px] text-stone-200 leading-relaxed max-w-[400px]">
              Join a community of learners and take your skills to the next level with our interactive courses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
