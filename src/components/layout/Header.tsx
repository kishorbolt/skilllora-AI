import React, { useState, useRef, useEffect } from 'react';
import type { UserProfile } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { Target, Calendar, Flame, Award, ChevronRight, ChevronDown, User, Edit3, LogOut, CheckCircle, Users } from 'lucide-react';
import { EditProfileModal } from '../modals/EditProfileModal';
import { AuthModal } from '../modals/AuthModal';
import { useLearner } from '../../context/LearnerContext';

interface HeaderProps {
  profile: UserProfile | null;
  activeTab: string;
  setActiveTab?: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ profile: propProfile, activeTab, setActiveTab }) => {
  const { profile: contextProfile, refetchProfile, logout } = useLearner();
  const profile = contextProfile || propProfile;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Executive Overview';
      case 'roadmap': return 'Personalized Learning Roadmap';
      case 'recommendations': return 'AI-Driven Recommendations';
      case 'assessments': return '30-MCQ Adaptive Skill Assessments';
      case 'projects': return 'Hands-On Projects & Evidence';
      case 'skill-dna': return 'AI Skill DNA Engine';
      case 'skill-gaps': return 'Skill Gap Analyzer';
      case 'career-simulator': return 'Career What-If Simulator';
      case 'mentor': return 'Contextual AI Mentor';
      case 'progress': return 'Progress Analytics & Timeline';
      case 'profile': return 'Learner Digital Twin';
      default: return 'Dashboard';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await logout();
    if (setActiveTab) setActiveTab('landing');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
            <BrandLogo size="sm" showWordmark={true} />
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="capitalize font-medium text-slate-600">{activeTab.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center space-x-2">
            {activeTab === 'skill-dna' && (
              <img src="/ai-dna-icon.jpg" alt="AI Skill DNA" className="w-6 h-6 rounded-md shadow-xs object-cover" />
            )}
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          </div>
        </div>

        {profile ? (
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
              <Target className="w-4 h-4 text-brand-600" />
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] font-medium leading-none">TARGET GOAL</span>
                <span className="font-semibold text-slate-900">{profile.career_goal || 'AI Engineer'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md">
              <Calendar className="w-4 h-4 text-slate-500" />
              <div className="text-xs">
                <span className="text-slate-400 block text-[10px] font-medium leading-none">TARGET DATE</span>
                <span className="font-semibold text-slate-800">{profile.target_deadline || 'March 2027'}</span>
              </div>
            </div>

            {/* Real Streak Indicator */}
            <div
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md border ${
                profile.is_today_complete
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200/70 text-amber-900'
              }`}
              title={profile.is_today_complete ? "Today's learning activity completed!" : "Complete today's learning to extend streak"}
            >
              <Flame className={`w-4 h-4 ${profile.is_today_complete ? 'text-emerald-600 fill-emerald-500' : 'text-amber-600 fill-amber-500'}`} />
              <span className="text-xs font-bold">
                {profile.current_streak || 0} Day Streak
              </span>
              {profile.is_today_complete && (
                <CheckCircle className="w-3 h-3 text-emerald-600 ml-0.5" />
              )}
            </div>

            <div className="flex items-center space-x-2 bg-brand-50 border border-brand-200 px-3 py-1.5 rounded-md">
              <Award className="w-4 h-4 text-brand-600" />
              <div className="text-xs">
                <span className="text-brand-700 block text-[10px] font-semibold leading-none">CAREER READINESS</span>
                <span className="font-bold text-brand-700">{profile.readiness_score || 0}%</span>
              </div>
            </div>

            {/* Interactive User Dropdown Container */}
            <div className="relative pl-2 border-l border-slate-200" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-label="Learner menu"
              >
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url.startsWith('http') || profile.avatar_url.startsWith('blob:') || profile.avatar_url.startsWith('data:') ? profile.avatar_url : `http://127.0.0.1:8000${profile.avatar_url}`}
                    alt={profile.name}
                    className="w-8 h-8 rounded-full object-cover border border-brand-500 shadow-2xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border border-slate-700 shadow-2xs">
                    {getInitials(profile.name)}
                  </div>
                )}

                <div className="hidden xl:block text-left">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{profile.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">{profile.target_role || profile.career_goal}</span>
                </div>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 animate-in fade-in-50 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900 block">{profile.name}</span>
                    <span className="text-[11px] text-brand-600 font-medium">{profile.target_role || profile.career_goal}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{profile.email}</span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        if (setActiveTab) setActiveTab('profile');
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-medium cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>View Learner Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowEditModal(true);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-medium cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-brand-600" />
                      <span>Edit Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setShowAuthModal(true);
                      }}
                      className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 font-medium cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-brand-600" />
                      <span>Switch Account / Demo</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-semibold cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Sign In / Switch Account
            </button>
          </div>
        )}
      </div>

      {showEditModal && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onProfileUpdated={() => {
            refetchProfile();
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </header>
  );
};
