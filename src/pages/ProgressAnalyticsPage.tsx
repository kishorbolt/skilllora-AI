import React from 'react';
import type { AnalyticsData } from '../types';
import { LineChart, BarChart, ResponsiveContainer, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { LineChart as LineChartIcon, History, AlertTriangle } from 'lucide-react';
import { EmptyState } from '../components/common/EmptyState';

interface ProgressAnalyticsPageProps {
  analytics: AnalyticsData | null;
  onNavigate?: (tab: string) => void;
}

export const ProgressAnalyticsPage: React.FC<ProgressAnalyticsPageProps> = ({ analytics, onNavigate }) => {
  const growthData = analytics?.skill_growth_over_time || [
    { month: 'Month 1', Python: 60, ML: 40, DL: 20 },
    { month: 'Month 2', Python: 75, ML: 55, DL: 30 },
    { month: 'Month 3', Python: 85, ML: 68, DL: 42 },
    { month: 'Month 4', Python: 91, ML: 76, DL: 48 }
  ];

  const hoursData = analytics?.weekly_learning_hours || [
    { week: 'Week 1', hours: 12.5, target: 14 },
    { week: 'Week 2', hours: 14.0, target: 14 },
    { week: 'Week 3', hours: 11.0, target: 14 },
    { week: 'Week 4', hours: 15.5, target: 14 }
  ];

  const timeline = analytics?.learning_history_timeline || [
    {
      date: 'Today, 2:30 PM',
      title: 'Python Diagnostic Assessment Completed',
      category: 'Assessment',
      type: 'score_change',
      detail: 'Scored 80% (24/30). Python Skill DNA score increased from 84% to 90%.'
    },
    {
      date: 'Yesterday, 6:00 PM',
      title: 'PyTorch Classifier Project Evaluated',
      category: 'Project',
      type: 'practical_proof',
      detail: 'Submitted code snippet and reflection. Practical application verified at 82%.'
    },
    {
      date: 'Aug 22, 2026',
      title: 'AI Roadmap Fast-Track Adaptation',
      category: 'Adaptation',
      type: 'adaptation',
      detail: 'Fast-tracked Python Foundations phase based on high initial proficiency.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <LineChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Progress Analytics & Learning Timeline
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Audit trail tracking skill growth trajectories, weekly learning hours, decay retention, and digital twin milestones.
            </p>
          </div>
        </div>
      </div>

      {/* 2. DECAY & RETENTION ALERTS */}
      {analytics?.decaying_skills && analytics.decaying_skills.length > 0 && (
        <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-5 shadow-2xs space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-purple-900 uppercase">
            <AlertTriangle className="w-4 h-4 text-purple-600" />
            <span>SKILL DECAY & RETENTION ALERT</span>
          </div>

          <div className="space-y-2">
            {analytics.decaying_skills.map((d) => (
              <div key={d.skill_name} className="p-3.5 bg-white border border-purple-200/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <span className="font-extrabold text-slate-900">{d.skill_name}</span>
                  <span className="text-slate-500 ml-2 font-medium">Retention dropped to {d.retention}% (Last practiced: {d.last_practiced})</span>
                </div>
                <span className="font-bold text-purple-800 bg-purple-100 border border-purple-200 px-2.5 py-1 rounded-lg w-fit">
                  {d.recommendation}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Growth Trajectory */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Skill Growth Trajectory</h3>
              <p className="text-[11px] text-slate-400 font-medium">Evidence-backed mastery over time</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1 text-blue-600"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /><span>Python</span></span>
              <span className="flex items-center space-x-1 text-emerald-600"><span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" /><span>ML</span></span>
              <span className="flex items-center space-x-1 text-amber-600"><span className="w-2 h-2 rounded-full bg-amber-600 inline-block" /><span>DL</span></span>
            </div>
          </div>

          {growthData && growthData.length > 0 ? (
            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }} />
                  <Line type="monotone" dataKey="Python" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ML" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="DL" stroke="#D97706" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={LineChartIcon}
              title="Not Enough Learning History Yet"
              description="Complete an assessment or project to start tracking your skill growth trajectory."
              actionText="Take Assessment"
              onAction={() => onNavigate && onNavigate('assessments')}
              variant="compact"
            />
          )}
        </div>

        {/* Weekly Learning Hours vs Target */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Learning Hours vs Target</h3>
              <p className="text-[11px] text-slate-400 font-medium">Logged study effort vs target allocation</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1 text-blue-600"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /><span>Hours</span></span>
              <span className="flex items-center space-x-1 text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /><span>Target</span></span>
            </div>
          </div>

          {hoursData && hoursData.length > 0 ? (
            <div className="h-64 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '11px', border: 'none' }} />
                  <Bar dataKey="hours" fill="#2563EB" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              icon={LineChartIcon}
              title="No Study Hours Logged"
              description="Study activity will be recorded here as you complete modules and quizzes."
              actionText="Explore Roadmap"
              onAction={() => onNavigate && onNavigate('roadmap')}
              variant="compact"
            />
          )}
        </div>
      </div>

      {/* 4. DIGITAL TWIN TIMELINE LOG */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <History className="w-4 h-4 text-slate-500" />
            <span>Learner Digital Twin Event History Log</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Immutable Event Audit</span>
        </div>

        {timeline && timeline.length > 0 ? (
          <div className="space-y-3">
            {timeline.map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-brand-200 transition-colors">
                <div className="flex items-center space-x-3.5">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase shrink-0 ${
                    item.type === 'adaptation' ? 'bg-brand-100 text-brand-700' :
                    item.type === 'score_change' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.category}
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{item.title}</span>
                    <span className="text-slate-600 text-[11px] font-medium leading-relaxed mt-0.5">{item.detail}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0 sm:ml-4">{item.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={History}
            title="No Learning History Events Yet"
            description="Take your first technology diagnostic assessment to start building your digital twin history log."
            actionText="Take Assessment"
            onAction={() => onNavigate && onNavigate('assessments')}
          />
        )}
      </div>
    </div>
  );
};
