import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from '../components/auth/AuthModal';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [heroPhone, setHeroPhone] = useState('');

  const openAuth = (mode: 'signin' | 'register', phonePrefill = '') => {
    setAuthMode(mode);
    if (phonePrefill) setHeroPhone(phonePrefill);
    setAuthModalOpen(true);
  };

  const cleanLocalPart = (raw: string) => {
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      return cleaned.slice(2);
    }
    return cleaned || '9876543210';
  };

  const previewLocal = heroPhone.trim() ? cleanLocalPart(heroPhone) : '9876543210';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      {/* Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-48 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl" />
      <div className="pointer-events-none absolute top-2/3 -right-48 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                PhoneMail
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1.0 Hackathon
              </span>
            </div>
          </div>

          {/* Center Links (Desktop) */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#doors" className="hover:text-white transition-colors">3 Signup Doors</a>
            <a href="#architecture" className="hover:text-white transition-colors">SMTP Engine</a>
            <a href="#security" className="hover:text-white transition-colors">E2E Security</a>
          </nav>

          {/* Right Corner Buttons */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30 flex items-center space-x-1.5"
                >
                  <span>Dashboard</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => openAuth('signin')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/80 transition border border-slate-700/60"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuth('register')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-cyan-500 text-white hover:from-indigo-500 hover:to-cyan-400 transition shadow-md shadow-indigo-600/30"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-6 backdrop-blur-sm animate-fade-in">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Self-Hosted SMTP • Zero Third-Party Email SaaS</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
          Your Phone Number Is Your{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
            New Email Address.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          No complex usernames. PhoneMail maps your mobile number directly to a full-featured webmail inbox:
          <span className="font-mono text-cyan-300 font-medium"> 9876543210@phonemail.com</span>.
        </p>

        {/* Live Phone-to-Email Demo Box */}
        <div className="mt-10 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-2xl shadow-indigo-950/60">
          <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider text-left flex items-center justify-between">
            <span>Try your phone number:</span>
            <span className="text-emerald-400 lowercase font-normal flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              instant setup
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-3 text-slate-500 font-mono text-sm">+91</span>
              <input
                type="tel"
                placeholder="Enter 10-digit number..."
                value={heroPhone}
                onChange={(e) => setHeroPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-12 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>
            <button
              onClick={() => openAuth('register', heroPhone)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold text-sm hover:from-indigo-500 hover:to-cyan-400 transition shadow-lg shadow-indigo-600/30 whitespace-nowrap flex items-center justify-center space-x-1.5"
            >
              <span>Claim Address</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Result preview */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Assigned Email:</span>
            <span className="font-mono font-bold text-indigo-300 bg-indigo-950/60 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              {previewLocal}@phonemail.com
            </span>
          </div>
        </div>

        {/* Quick CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openAuth('register')}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/40 flex items-center space-x-2"
          >
            <span>Create Free Account</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button
            onClick={() => openAuth('signin')}
            className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800/80 font-semibold text-sm transition"
          >
            Sign In with Password
          </button>
        </div>
      </section>

      {/* 3 Parallel Doors Section */}
      <section id="doors" className="py-20 border-t border-slate-800/80 bg-slate-900/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              Three Account-Creation Doors
            </h2>
            <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              One Unified Phone Identity. Three Parallel Ways In.
            </p>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Users pick any single door. Every path converges on the same MongoDB User collection keyed by normalized E.164 phone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Door A */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between hover:border-indigo-500/50 transition">
              <div>
                <div className="h-12 w-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 border border-indigo-500/30">
                  Door A
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Web Browser Signup</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Enter your phone number directly on the website. Verify and set a secure password to unlock your webmail dashboard instantly.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 text-xs font-mono text-indigo-300">
                Identity: Website Form
              </div>
            </div>

            {/* Door B */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition">
              <div>
                <div className="h-12 w-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-lg mb-4 border border-cyan-500/30">
                  Door B
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Inbound IVR Phone Call</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Call the PhoneMail voice line. Twilio Voice captures the caller ID, creates your skeleton account, and invites you to finish setup.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 text-xs font-mono text-cyan-300">
                Identity: Caller ID (Twilio Voice)
              </div>
            </div>

            {/* Door C */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition">
              <div>
                <div className="h-12 w-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4 border border-emerald-500/30">
                  Door C
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Inbound SMS Keyword</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-4">
                  Text <code className="text-emerald-300 bg-emerald-950 px-1 py-0.5 rounded">SIGNUP</code> to the linked textbee Android gateway. An automated SMS confirmation creates your account.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 text-xs font-mono text-emerald-300">
                Identity: SMS Sender (textbee.dev)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
            Engineered For Performance & Security
          </h2>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Everything You Expect From Modern Email
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Zero Passwords Over SMS</h3>
            <p className="text-sm text-slate-400">
              Passwords never travel over telecom lines or phone calls. Account passwords can only be set securely via the authenticated web interface.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Self-Hosted SMTP Engine</h3>
            <p className="text-sm text-slate-400">
              Native SMTP receiver and sender built on Node.js and port 2525. Direct closed-loop mail routing without Mailgun, SendGrid, or AWS SES.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">End-to-End Encryption</h3>
            <p className="text-sm text-slate-400">
              Message bodies are encrypted client-side using TweetNaCl asymmetric crypto. The server and SMTP layers only ever see ciphertext.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-16 border-t border-slate-800/80 bg-gradient-to-b from-slate-900/50 to-slate-950">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to claim your phone-number email address?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-8">
            Create your account in seconds without waiting for SMS codes. Your inbox is waiting for you.
          </p>
          <button
            onClick={() => openAuth('register')}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold text-sm hover:opacity-95 transition shadow-xl shadow-indigo-600/40 inline-flex items-center space-x-2"
          >
            <span>Get Started Now</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
        <p>PhoneMail — Alphastack Buildathon 2026. Built with React, Tailwind, Express & MongoDB.</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        initialPhone={heroPhone}
      />
    </div>
  );
};
