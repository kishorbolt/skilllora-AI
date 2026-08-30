import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import {
  LayoutDashboard, GitMerge, Compass, FileCheck2, FolderGit2,
  SlidersHorizontal, Bot, LineChart, User, LogOut, Sparkles
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenOnboarding: () => void;
}

const CustomAIIcon = ({ className }: { className?: string }) => (
  <img src="/ai-dna-icon.jpg" alt="AI Skill DNA" className={`${className} rounded-sm object-cover`} />
);

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onOpenOnboarding }) => {
  const navItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'skill-dna', label: 'AI Skill DNA', icon: CustomAIIcon, badge: 'Flagship' },
    { id: 'skill-gaps', label: 'Skill Gap Analyzer', icon: GitMerge },
    { id: 'roadmap', label: 'Adaptive Roadmap', icon: LineChart },
    { id: 'recommendations', label: 'Recommendations', icon: Compass },
    { id: 'assessments', label: 'Assessments', icon: FileCheck2 },
    { id: 'projects', label: 'Projects & Evidence', icon: FolderGit2 },
    { id: 'career-simulator', label: 'Career Simulator', icon: SlidersHorizontal },
    { id: 'mentor', label: 'AI Mentor Chat', icon: Bot },
    { id: 'progress', label: 'Analytics & Timeline', icon: LineChart },
    { id: 'profile', label: 'Learner Profile', icon: User },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col justify-between p-4 z-30 shrink-0">
      <div>
        {/* Brand Header with Uploaded SKILLORA AI Logo */}
        <div className="px-2 py-3 border-b border-slate-100 mb-4">
          <BrandLogo size="md" showWordmark={true} />
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-extrabold bg-brand-600 text-white px-1.5 py-0.2 rounded uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100">
        <button
          onClick={onOpenOnboarding}
          className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm flex items-center justify-center space-x-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Update Goals Wizard</span>
        </button>

        <button
          onClick={() => setActiveTab('landing')}
          className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
          <span>Back to Landing Page</span>
        </button>

        {/* Piyroware Attribution Footer (Kept Separate) */}
        <div className="pt-3 border-t border-slate-100 flex items-center space-x-2.5 px-2">
          <img
            src="/piyrowarelogo.jpeg"
            alt="Piyroware Logo"
            className="w-5 h-5 rounded object-cover border border-slate-200"
          />
          <span className="text-[11px] text-slate-500 font-semibold tracking-tight">
            Designed by Team Piyroware
          </span>
        </div>
      </div>
    </aside>
  );
};
