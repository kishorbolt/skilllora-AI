import React from 'react';
import type { SkillNode } from '../types';
import { GitMerge, Lock, Unlock, ArrowDown, ShieldCheck } from 'lucide-react';

interface SkillGraphPageProps {
  nodes: SkillNode[];
}

export const SkillGraphPage: React.FC<SkillGraphPageProps> = ({ nodes }) => {
  const graphSequence = [
    { title: 'Foundations', skills: ['Python', 'Statistics', 'SQL'] },
    { title: 'Core Machine Learning', skills: ['Machine Learning', 'Data Structures'] },
    { title: 'Advanced Deep Learning', skills: ['Deep Learning', 'Data Visualization'] },
    { title: 'Specializations', skills: ['NLP', 'Computer Vision', 'System Design'] },
    { title: 'Production Engineering & MLOps', skills: ['MLOps', 'Cloud'] }
  ];

  const nodeMap = new Map(nodes.map(n => [n.name, n]));

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Prerequisite Skill Graph</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Interactive prerequisite hierarchy mapping unlocked competencies and dependencies toward your target role.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-8">
        {graphSequence.map((layer, idx) => (
          <div key={layer.title} className="relative space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-0.5 rounded uppercase tracking-wider">
                STAGE 0{idx + 1}
              </span>
              <span className="text-xs font-bold text-slate-900">{layer.title}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {layer.skills.map((sname) => {
                const node = nodeMap.get(sname);
                const isUnlocked = node ? node.is_unlocked : true;
                const prof = node ? Math.round(node.proficiency) : (sname === 'Python' ? 90 : sname === 'Machine Learning' ? 75 : 45);
                const prereqs = node?.prerequisites || [];

                return (
                  <div
                    key={sname}
                    className={`p-4 rounded-2xl border transition-all card-hover ${
                      isUnlocked
                        ? 'bg-slate-50/80 border-slate-200 hover:border-brand-300 hover:bg-white'
                        : 'bg-slate-100/60 border-slate-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm flex items-center space-x-1.5">
                        <span>{sname}</span>
                        {prof >= 70 && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </span>
                      {isUnlocked ? (
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          <span>Unlocked</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-baseline justify-between text-xs">
                      <span className="text-slate-500 font-medium">Proficiency</span>
                      <span className="font-black text-slate-900">{prof}%</span>
                    </div>

                    <div className="w-full bg-slate-200/80 h-2 rounded-full overflow-hidden mt-1.5">
                      <div className="h-full bg-brand-600 rounded-full transition-all duration-500" style={{ width: `${prof}%` }} />
                    </div>

                    {prereqs.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-medium block mt-2">
                        Prerequisites: <strong className="text-slate-600">{prereqs.join(', ')}</strong>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {idx < graphSequence.length - 1 && (
              <div className="flex justify-center pt-2">
                <ArrowDown className="w-5 h-5 text-slate-300 animate-bounce" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
