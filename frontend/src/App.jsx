import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import CyberBackground from './components/CyberBackground';
import ScrollProgressBar from './components/ScrollProgressBar';
import SystemStatusStrip from './components/SystemStatusStrip';
import HeroSection from './components/HeroSection';
import StatsGrid from './components/StatsGrid';
import StudioPreview from './components/StudioPreview';
import HowItWorksPipeline from './components/HowItWorksPipeline';
import ForensicResultPreview from './components/ForensicResultPreview';
import RecentScansList from './components/RecentScansList';
import AuthModal from './components/AuthModal';

import LoadingPage from './pages/LoadingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import DetectionStudioPage from './pages/DetectionStudioPage';
import HistoryPage from './pages/HistoryPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

import { useAuth } from './context/AuthContext';

const pathToTab = (pathname) => {
  const p = (pathname || window.location.pathname).toLowerCase();
  if (p === '/login') return 'login';
  if (p === '/signup' || p === '/register') return 'signup';
  if (p === '/forgot-password' || p === '/forgot') return 'forgot';
  if (p === '/detect' || p === '/studio') return 'studio';
  if (p === '/dashboard') return 'dashboard';
  if (p === '/history' || p === '/ledger') return 'history';
  if (p === '/about' || p === '/architecture') return 'about';
  if (p === '/contact') return 'contact';
  if (p.startsWith('/admin')) return 'admin';
  return 'home';
};

const tabToPath = (tab) => {
  switch (tab) {
    case 'login': return '/login';
    case 'signup': return '/signup';
    case 'forgot': return '/forgot-password';
    case 'studio': return '/detect';
    case 'dashboard': return '/dashboard';
    case 'history': return '/history';
    case 'about': return '/about';
    case 'contact': return '/contact';
    case 'admin': return '/admin';
    default: return '/';
  }
};

export default function App() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [isBooting, setIsBooting] = useState(true);
  const [activeTab, setActiveTabState] = useState(() => pathToTab(window.location.pathname));
  const [selectedStudioModality, setSelectedStudioModality] = useState('image');
  const [authModalOpen, setAuthModalOpen] = useState(() => window.location.pathname === '/admin/login');
  const [refreshStatsKey, setRefreshStatsKey] = useState(0);

  // Enforce strict route protection
  useEffect(() => {
    if (authLoading || isBooting) return;

    if (!isAuthenticated) {
      if (activeTab !== 'login' && activeTab !== 'signup' && activeTab !== 'forgot') {
        setActiveTabState('login');
        if (window.location.pathname !== '/login') {
          window.history.replaceState(null, '', '/login');
        }
      }
    } else {
      if (activeTab === 'login' || activeTab === 'signup' || activeTab === 'forgot') {
        setActiveTabState('home');
        if (window.location.pathname !== '/') {
          window.history.replaceState(null, '', '/');
        }
      }
    }
  }, [isAuthenticated, activeTab, authLoading, isBooting]);

  const setActiveTab = (tab, pushHistory = true) => {
    setActiveTabState(tab);
    if (pushHistory) {
      const targetPath = tabToPath(tab);
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/admin/login') {
        setAuthModalOpen(true);
        setActiveTabState('admin');
      } else {
        const nextTab = pathToTab(currentPath);
        if (!isAuthenticated && nextTab !== 'login' && nextTab !== 'signup' && nextTab !== 'forgot') {
          setActiveTabState('login');
          window.history.replaceState(null, '', '/login');
        } else {
          setActiveTabState(nextTab);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  const handleStartDetection = (modality = 'image') => {
    setSelectedStudioModality(modality);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreTech = () => {
    const el = document.getElementById('pipeline-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('home');
      setTimeout(() => {
        const el2 = document.getElementById('pipeline-section');
        if (el2) el2.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleScanCompleted = () => {
    setRefreshStatsKey(k => k + 1);
  };

  return (
    <AnimatePresence mode="wait">
      {isBooting ? (
        <LoadingPage
          key="sentinel-loading-page"
          onComplete={() => setIsBooting(false)}
        />
      ) : activeTab === 'login' || activeTab === 'signup' || activeTab === 'forgot' || !isAuthenticated ? (
        <AuthPage
          key={`sentinel-auth-page-${activeTab}`}
          mode={activeTab === 'signup' || activeTab === 'forgot' ? activeTab : 'login'}
          onNavigate={(target) => setActiveTab(target)}
          onAuthSuccess={() => setActiveTab('home')}
        />
      ) : (
        <motion.div
          key="sentinel-main-app"
          initial={{ opacity: 0, filter: 'blur(6px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black relative"
        >
          {/* Scroll Progress Indicator Bar */}
          <ScrollProgressBar />

          {/* Ambient Futuristic Cyber Background with Parallax */}
          <CyberBackground />

          {/* Sticky Top Navigation Bar with Dynamic Scroll Compaction */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenAuth={() => setActiveTab('login')}
          />

          {/* Live System Status Strip */}
          <SystemStatusStrip />

          {/* Main Dynamic View Content */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <div className="space-y-4">
                <HeroSection
                  onStartDetection={() => handleStartDetection('image')}
                  onExploreTech={handleExploreTech}
                />

                <StatsGrid refreshTrigger={refreshStatsKey} />

                <StudioPreview
                  onSelectModality={handleStartDetection}
                />

                <div id="pipeline-section">
                  <HowItWorksPipeline />
                </div>

                <ForensicResultPreview />

                <RecentScansList
                  refreshTrigger={refreshStatsKey}
                  onGoToStudio={() => handleStartDetection('image')}
                />
              </div>
            )}

            {activeTab === 'studio' && (
              <DetectionStudioPage
                initialModality={selectedStudioModality}
                onScanComplete={handleScanCompleted}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                onGoToStudio={() => handleStartDetection('image')}
              />
            )}

            {activeTab === 'history' && (
              <HistoryPage />
            )}

            {activeTab === 'about' && (
              <AboutPage
                onGoToStudio={() => handleStartDetection('image')}
              />
            )}

            {activeTab === 'contact' && (
              <ContactPage />
            )}

            {activeTab === 'admin' && (
              <AdminPage />
            )}
          </main>

          {/* Cyber-Forensics Enterprise Footer */}
          <footer className="bg-slate-950/90 border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 mt-16 font-sans backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-950/90 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-heading font-extrabold text-white text-base tracking-tight">
                    Deepfake<span className="text-cyan-400">Sentinel</span>
                  </p>
                  <p className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-wider">
                    IN-JVM FORENSIC DEFENSE PLATFORM
                  </p>
                </div>
              </div>

              {/* Technology Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono-tech text-slate-400">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">Java 17+</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">Spring Boot 3</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-semibold">ONNX Runtime</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-purple-300 font-semibold">OpenCV 4.7</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-300 font-semibold">MySQL 8.0</span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">React 18</span>
              </div>

              {/* Links */}
              <div className="flex items-center gap-5 text-xs font-mono-tech text-slate-400">
                <button onClick={() => setActiveTab('about')} className="hover:text-cyan-300 transition-colors cursor-pointer">Architecture</button>
                <button onClick={() => setActiveTab('contact')} className="hover:text-cyan-300 transition-colors cursor-pointer">Contact</button>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 text-[11px]">Zero Python Overhead</span>
              </div>

            </div>
          </footer>

          {/* Global Auth Modal (Fallback) */}
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
