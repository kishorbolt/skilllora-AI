import React from 'react';
import type { SkillDNA } from '../../types';
import { X, CheckCircle2, ShieldCheck, TrendingUp, History, Award } from 'lucide-react';

interface SkillDetailDrawerProps {
  skill: SkillDNA | null;
  onClose: () => void;
  onTakeAction?: (actionText: string) => void;
}

export const SkillDetailDrawer: React.FC<SkillDetailDrawerProps> = ({ skill, onClose, onTakeAction }) => {
  if (!skill) return null;

  const factors = [
    { label: 'Knowledge (Mastery)', weight: '30%', value: skill.mastery, color: 'bg-blue-600' },
    { label: 'Assessment Performance', weight: '20%', value: skill.assessment_performance, color: 'bg-indigo-600' },
    { label: 'Practical Application', weight: '20%', value: skill.practical_application, color: 'bg-emerald-600' },
    { label: 'Confidence Level', weight: '15%', value: skill.confidence, color: 'bg-cyan-600' },
    { label: 'Retention Score', weight: '10%', value: skill.retention, color: 'bg-amber-600' },
    { label: 'Learning Velocity', weight: '5%', value: Math.max(0, Math.min(100, 50 + skill.learning_velocity)), color: 'bg-purple-600' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        <div>
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{skill.category}</span>
                <span className="text-slate-300">•</span>
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded ${
                  skill.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {skill.status}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center space-x-2 mt-0.5">
                <span>{skill.skill_name}</span>
                {skill.is_verified && <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-1">
                  SKILL DNA SCORE
                </span>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-black text-slate-900">{skill.overall_score}%</span>
                  <span className="text-xs text-slate-500 font-medium">
                    Evidence Count: <strong className="text-slate-900">{skill.evidence_count}</strong>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-bold">LAST PRACTICED</span>
                <span className="text-sm font-extrabold text-slate-800">{skill.last_practiced}</span>
                <div className="flex items-center justify-end space-x-1 mt-1 text-emerald-600 text-xs font-bold">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="capitalize">{skill.trend}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">Transparent 6-Factor Breakdown</h3>
                <span className="text-[11px] text-slate-400 font-medium">Configurable Weights</span>
              </div>
              <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4">
                {factors.map((f) => (
                  <div key={f.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">{f.label} <span className="text-slate-400 font-normal">({f.weight})</span></span>
                      <span className="font-bold text-slate-900">{Math.round(f.value)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full ${f.color} rounded-full`} style={{ width: `${Math.min(100, Math.max(0, f.value))}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-50/60 border border-brand-200 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-brand-700 text-xs font-bold uppercase tracking-wider mb-1.5">
                <img src="/ai-dna-icon.jpg" alt="AI Skill DNA" className="w-4 h-4 rounded-sm object-cover" />
                <span>AI Skill DNA Diagnosis</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {skill.why_explanation}
              </p>

              <div className="mt-4 pt-3 border-t border-brand-200/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">RECOMMENDED NEXT ACTION</span>
                  <span className="text-xs font-bold text-brand-900">{skill.recommended_action}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-1 rounded">
                  {skill.estimated_impact}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <Award className="w-4 h-4 text-slate-500" />
                <span>Verified Evidence Log ({skill.evidence_list?.length || 0})</span>
              </h3>
              {!skill.evidence_list || skill.evidence_list.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                  Not enough evidence logged yet. Complete a course or quiz to verify this skill.
                </div>
              ) : (
                <div className="space-y-2">
                  {skill.evidence_list.map((ev) => (
                    <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{ev.title}</span>
                          <span className="text-[10px] text-slate-400 capitalize">{ev.evidence_type} • {ev.created_at}</span>
                        </div>
                      </div>
                      {ev.score != null && (
                        <span className="font-bold text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded">
                          {Math.round(ev.score)}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center space-x-2">
                <History className="w-4 h-4 text-slate-500" />
                <span>Score History Audit Log</span>
              </h3>
              {skill.history_list && skill.history_list.length > 0 ? (
                <div className="space-y-2.5">
                  {skill.history_list.map((hist) => (
                    <div key={hist.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs">
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="text-slate-900">{hist.reason}</span>
                        <span className="text-slate-500 font-mono">{Math.round(hist.old_score)}% → <strong className="text-brand-600">{Math.round(hist.new_score)}%</strong></span>
                      </div>
                      <span className="text-[10px] text-slate-400">{hist.created_at}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 italic">
                  Initial baseline score established. Further improvements will be audited here.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onTakeAction) onTakeAction(skill.recommended_action);
            }}
            className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            Execute Recommended Action
          </button>
        </div>
      </div>
    </div>
  );
};
