import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Sparkles, Loader2, Info } from 'lucide-react';

interface ManageSkillModalProps {
  onClose: () => void;
  onSkillAdded: () => void;
}

export const ManageSkillModal: React.FC<ManageSkillModalProps> = ({ onClose, onSkillAdded }) => {
  const [skillName, setSkillName] = useState('Deep Learning');
  const [category, setCategory] = useState('AI Core');
  const [proficiency, setProficiency] = useState<number>(70);
  const [level, setLevel] = useState<string>('Intermediate');
  const [isSelfReported, setIsSelfReported] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const predefinedSkills = [
    'Python', 'Machine Learning', 'Deep Learning', 'React', 'SQL', 'Statistics',
    'NLP', 'Computer Vision', 'MLOps', 'Data Structures', 'System Design', 'Cloud', 'Data Visualization'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addUserSkill({
        skill_name: skillName,
        category,
        proficiency,
        level,
        is_self_reported: isSelfReported
      });
      onSkillAdded();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">MANAGE SKILL PROFICIENCY</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select or Enter Skill Name</label>
            <div className="flex space-x-2 mb-2">
              <select
                value={predefinedSkills.includes(skillName) ? skillName : 'Custom'}
                onChange={(e) => {
                  if (e.target.value !== 'Custom') setSkillName(e.target.value);
                }}
                className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                {predefinedSkills.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="Custom">Custom Skill...</option>
              </select>

              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Skill name"
                className="w-1/2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Proficiency Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Self-Reported Proficiency %</label>
              <span className="text-sm font-extrabold text-brand-600">{proficiency}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <label className="flex items-center space-x-2 font-semibold text-slate-900 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelfReported}
                onChange={(e) => setIsSelfReported(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600"
              />
              <span>Mark as Self-Reported Skill</span>
            </label>

            <div className="flex items-start space-x-2 text-[11px] text-slate-500 font-medium">
              <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <span>
                Self-reported skills will display a <strong>"Self-Reported"</strong> badge and will NOT automatically mark Skill DNA as <strong>"Verified"</strong> until backed by diagnostic assessment or project evaluation evidence.
              </span>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm flex items-center space-x-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Save Skill</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
