import React, { useState } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../types';
import { Sparkles, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [naturalInput, setNaturalInput] = useState<string>(
    'I want to become an AI Engineer by March 2027. I know Python and basic Machine Learning, but I need deep learning and MLOps skills. I can study 2 hours per day.'
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    career_goal: 'AI Engineer',
    learning_objective: 'Master required competencies and verified Skill DNA.',
    experience_level: 'Intermediate',
    existing_skills: ['Python'],
    completed_courses: [],
    interests: ['Machine Learning', 'Deep Learning'],
    daily_study_hours: 2.0,
    preferred_format: 'Interactive & Project-based',
    target_deadline: 'March 2027',
    confidence_level: 70
  });

  const handleParseNaturalInput = async () => {
    setLoading(true);
    try {
      const res = await api.parseGoal(naturalInput);
      setFormData(prev => ({
        ...prev,
        career_goal: res.parsed_goal || prev.career_goal,
        learning_objective: res.learning_objective || prev.learning_objective,
        experience_level: res.experience_level || prev.experience_level,
        existing_skills: res.existing_skills || prev.existing_skills,
        daily_study_hours: res.daily_study_hours || prev.daily_study_hours,
        target_deadline: res.target_deadline || prev.target_deadline,
        confidence_level: res.confidence_level || prev.confidence_level
      }));
      setStep(3);
    } catch (e) {
      console.error(e);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFinal = async () => {
    setLoading(true);
    try {
      const profile = await api.submitOnboarding({
        ...formData,
        raw_input: naturalInput
      });
      onComplete(profile);
    } catch (e) {
      console.error(e);
      onComplete({
        id: 1,
        name: formData.name,
        email: formData.email,
        career_goal: formData.career_goal,
        learning_objective: formData.learning_objective,
        experience_level: formData.experience_level,
        daily_study_hours: formData.daily_study_hours,
        target_deadline: formData.target_deadline,
        preferred_format: formData.preferred_format,
        preferred_difficulty: 'Intermediate',
        weekly_availability: '14 Hours / Week',
        confidence_level: formData.confidence_level,
        readiness_score: 72,
        total_skills_count: 12,
        verified_skills_count: 2
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-8 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">SKILLORA AI ONBOARDING WIZARD</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Step {step} of 3</span>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">What is your learning goal?</h2>
                <p className="text-xs text-slate-600 mt-1">
                  Describe your target role, existing skills, available daily time, and timeline in plain English. SKILLORA AI will parse it into a Digital Twin profile.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Natural Language Prompt</label>
                <textarea
                  value={naturalInput}
                  onChange={(e) => setNaturalInput(e.target.value)}
                  rows={4}
                  className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-hidden leading-relaxed"
                  placeholder="e.g. I want to become an AI Engineer by March 2027..."
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-slate-500 hover:text-slate-900 font-semibold"
                >
                  Skip to Structured Form
                </button>
                <button
                  onClick={handleParseNaturalInput}
                  disabled={loading || !naturalInput.trim()}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Parse Goal with AI</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Fine-tune Learner Parameters</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={formData.career_goal}
                    onChange={(e) => setFormData({ ...formData, career_goal: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Daily Study Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.daily_study_hours}
                    onChange={(e) => setFormData({ ...formData, daily_study_hours: parseFloat(e.target.value) || 2 })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Deadline</label>
                  <input
                    type="text"
                    value={formData.target_deadline}
                    onChange={(e) => setFormData({ ...formData, target_deadline: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center space-x-1">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button onClick={() => setStep(3)} className="px-5 py-2 bg-brand-600 text-white font-bold text-xs rounded-lg">
                  Next: Confirm Profile
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PROFILE READY</span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Review Learner Digital Twin</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Learner Name:</span>
                  <span className="font-bold text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Target Career Goal:</span>
                  <span className="font-bold text-slate-900">{formData.career_goal}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Daily Study Allocation:</span>
                  <span className="font-bold text-slate-900">{formData.daily_study_hours} Hours/Day</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-2">
                  <span className="text-slate-500 font-semibold">Target Timeline:</span>
                  <span className="font-bold text-slate-900">{formData.target_deadline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Existing Skills Identified:</span>
                  <span className="font-bold text-brand-600">{formData.existing_skills.join(', ')}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-slate-800 font-semibold">
                  Edit Prompt
                </button>
                <button
                  onClick={handleSubmitFinal}
                  disabled={loading}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>Generate My Personalized Path</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
