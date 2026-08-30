import React, { useState } from 'react';
import { api } from '../../services/api';
import { X, Sparkles, Loader2, Info } from 'lucide-react';

interface AddCourseModalProps {
  onClose: () => void;
  onCourseAdded: () => void;
}

export const AddCourseModal: React.FC<AddCourseModalProps> = ({ onClose, onCourseAdded }) => {
  const [courseName, setCourseName] = useState('Deep Learning Specialization');
  const [provider, setProvider] = useState('Coursera');
  const [skillName, setSkillName] = useState('Deep Learning');
  const [completionDate, setCompletionDate] = useState('August 2026');
  const [durationHours, setDurationHours] = useState<number>(25.0);
  const [certificateUrl, setCertificateUrl] = useState('');
  const [description, setDescription] = useState('Completed 5-course sequence covering neural networks, hyperparameter tuning, and PyTorch.');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.addCompletedCourse({
        course_name: courseName,
        provider,
        skill_name: skillName,
        completion_date: completionDate,
        duration_hours: durationHours,
        certificate_url: certificateUrl || undefined,
        description
      });
      onCourseAdded();
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
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">ADD COMPLETED COURSE</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
            <input
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Provider / Platform</label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. Coursera, Udemy"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Skill Track</label>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Completion Date</label>
              <input
                type="text"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                placeholder="e.g. July 2026"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Hours)</label>
              <input
                type="number"
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value) || 10)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Certificate URL (Optional)</label>
            <input
              type="url"
              value={certificateUrl}
              onChange={(e) => setCertificateUrl(e.target.value)}
              placeholder="https://coursera.org/verify/..."
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description & Key Learnings</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2 text-[11px] text-slate-500 font-medium">
            <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
            <span>
              Adding a course logs <strong>Course Evidence</strong> in your Skill History. Note: Course completion alone does NOT mark a skill <strong>"Verified"</strong> until backed by practical project evaluation.
            </span>
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
              <span>Add Course</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
