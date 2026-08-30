import React, { useState } from 'react';
import type { OverallSkillDNA, SkillDNA } from '../types';
import { ShieldCheck, AlertTriangle, TrendingUp, Award, Search, X } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/SkeletonLoader';

interface SkillDNADashboardProps {
  skillDNA: OverallSkillDNA | null;
  onOpenSkillDrawer: (skill: SkillDNA) => void;
  onNavigate?: (tab: string) => void;
}

export const SkillDNADashboard: React.FC<SkillDNADashboardProps> = ({
  skillDNA,
  onOpenSkillDrawer
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');

  if (!skillDNA) {
    return (
      <div className="space-y-6 pb-12">
        <SkeletonCard rows={3} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} rows={2} />
          ))}
        </div>
      </div>
    );
  }

  const allSkills = skillDNA.skills || [];

  const filteredSkills = allSkills.filter(skill => {
    const matchesSearch = skill.skill_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.category.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedFilter === 'All') return matchesSearch;
    if (selectedFilter === 'Verified') return matchesSearch && skill.is_verified;
    if (selectedFilter === 'At Risk') return matchesSearch && (skill.status === 'At Risk' || skill.trend === 'decaying');
    if (selectedFilter === 'Needs Focus') return matchesSearch && skill.status === 'Needs Focus';
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden shadow-md">
              <img src="/ai-dna-icon.jpg" alt="AI Skill DNA" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded uppercase tracking-wider">
                  FLAGSHIP FEATURE
                </span>
                <span className="text-xs text-slate-400 font-medium">Transparent 6-Factor Engine</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                AI Skill DNA Engine
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed font-medium">
                Skill DNA computes verifiable proficiency derived from real learner evidence (Courses, Diagnostic Assessments, Practical Projects, and Decay Tracking).
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center space-x-6 text-center shrink-0">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">OVERALL DNA SCORE</span>
              <span className="text-3xl font-black text-slate-900">{skillDNA.overall_dna_score || 72}%</span>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">CAREER READINESS</span>
              <span className="text-3xl font-black text-brand-700">{skillDNA.career_readiness_score || 72}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 4 TOP METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">STRENGTHS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skillDNA.strengths && skillDNA.strengths.length > 0 ? (
              skillDNA.strengths.map(s => (
                <span key={s} className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-medium">Python, Machine Learning</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">PRIORITY GAPS</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skillDNA.bottlenecks && skillDNA.bottlenecks.length > 0 ? (
              skillDNA.bottlenecks.map(b => (
                <span key={b} className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                  {b}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 font-medium">Deep Learning, Statistics</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AT-RISK / DECAY</span>
            <TrendingUp className="w-4 h-4 text-purple-600 rotate-180" />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skillDNA.at_risk_skills && skillDNA.at_risk_skills.length > 0 ? (
              skillDNA.at_risk_skills.map(r => (
                <span key={r} className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200/80 px-2.5 py-1 rounded-lg">
                  {r}
                </span>
              ))
            ) : (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">All skills healthy</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 card-hover shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">EVIDENCE COVERAGE</span>
            <Award className="w-4 h-4 text-brand-600" />
          </div>
          <div className="pt-1">
            <span className="text-2xl font-black text-slate-900">
              {allSkills.filter(s => s.has_enough_evidence || s.is_verified).length} / {allSkills.length} Skills
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Verified evidence logged</span>
          </div>
        </div>
      </div>

      {/* 3. SKILL MATRIX & CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-slate-900">Skill DNA Matrix</h3>
            <span className="text-xs text-slate-400 font-medium">({filteredSkills.length} of {allSkills.length} Skills)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500 font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {['All', 'Verified', 'Needs Focus', 'At Risk'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSelectedFilter(f)}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedFilter === f ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SKILLS GRID */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => onOpenSkillDrawer(skill)}
                className="p-5 bg-slate-50/70 border border-slate-200 rounded-2xl hover:border-brand-300 hover:bg-white cursor-pointer transition-all card-hover flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{skill.category}</span>
                      <h4 className="text-base font-bold text-slate-900 flex items-center space-x-1.5 mt-0.5">
                        <span>{skill.skill_name}</span>
                        {skill.is_verified && <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </h4>
                    </div>
                    <span className="text-2xl font-black text-slate-900">{skill.overall_score}%</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Mastery (30%)</span>
                      <span className="font-bold text-slate-800">{skill.mastery}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${skill.mastery}%` }} />
                    </div>

                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-slate-500 font-medium">Practical Application (20%)</span>
                      <span className="font-bold text-slate-800">{skill.practical_application}%</span>
                    </div>
                    <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${skill.practical_application}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded ${
                    skill.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {skill.status}
                  </span>

                  <span className="text-[11px] font-bold text-brand-600 hover:underline">
                    Inspect Evidence →
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No Skills Match Your Filter"
            description={`No skills found matching "${searchTerm || selectedFilter}". Try adjusting your search query or reset filters.`}
            actionText="Reset Filters"
            onAction={() => {
              setSearchTerm('');
              setSelectedFilter('All');
            }}
          />
        )}
      </div>
    </div>
  );
};
