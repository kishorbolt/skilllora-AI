import React, { useState } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import { Sparkles, ArrowRight, GitMerge, Compass, LineChart, LogIn } from 'lucide-react';
import { AuthModal } from '../components/modals/AuthModal';

interface LandingPageProps {
  onStartOnboarding: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartOnboarding, onExploreDemo }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <BrandLogo size="lg" showWordmark={true} showTagline={true} />

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="text-xs font-semibold text-slate-700 hover:text-brand-600 px-3 py-2 flex items-center space-x-1 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
            <button
              onClick={onExploreDemo}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 cursor-pointer"
            >
              Explore Demo Profile
            </button>
            <button
              onClick={onStartOnboarding}
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Build My Learning Path</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-8 py-16 flex flex-col items-center text-center justify-center space-y-8">
        <div className="inline-flex items-center space-x-2 bg-brand-50 border border-brand-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-brand-700 shadow-2xs">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>ADAPTIVE LEARNING OPERATING SYSTEM</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-none max-w-4xl">
          Your Goal.<br />
          Your Skills.<br />
          <span className="text-brand-600">Your AI-Generated Learning Path.</span>
        </h1>

        <p className="text-base text-slate-600 max-w-2xl leading-relaxed font-medium">
          SKILLORA AI understands where you are, where you want to go, identifies your skill gaps, builds your personalized learning roadmap, and continuously adapts it as you improve.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onStartOnboarding}
            className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span>Build My Learning Path</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="px-8 py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold text-sm rounded-xl shadow-2xs transition-all cursor-pointer"
          >
            Explore Demo Account
          </button>

          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-2xs transition-all cursor-pointer flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Account</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12 text-left w-full">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 card-hover">
            <img src="/ai-dna-icon.jpg" alt="AI Skill DNA" className="w-6 h-6 rounded object-cover" />
            <h3 className="text-base font-bold text-slate-900">AI Skill DNA Engine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Transparent 6-factor proficiency model derived from actual learner evidence.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 card-hover">
            <GitMerge className="w-6 h-6 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Skill Gap Analyzer</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Quantifies verified skills against standard target role requirements.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 card-hover">
            <Compass className="w-6 h-6 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">7-Factor Recommendations</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Multi-factor recommendation ranking tuned to your schedule and interested courses.
            </p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2 card-hover">
            <LineChart className="w-6 h-6 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Continuous AI Adaptation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dynamic roadmap updates based on diagnostic assessments and project evaluations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer with Piyroware Attribution */}
      <footer className="bg-white border-t border-slate-200 py-6 px-8 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo size="sm" showWordmark={true} />

          <div className="flex items-center space-x-2">
            <img
              src="/piyrowarelogo.jpeg"
              alt="Piyroware Logo"
              className="w-5 h-5 rounded object-cover border border-slate-200"
            />
            <span className="text-xs font-semibold text-slate-600">Designed by Team Piyroware</span>
          </div>
        </div>
      </footer>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => {
            setShowAuthModal(false);
            onExploreDemo();
          }}
        />
      )}
    </div>
  );
};
