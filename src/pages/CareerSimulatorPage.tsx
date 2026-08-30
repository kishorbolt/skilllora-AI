import React, { useState } from 'react';
import { api } from '../services/api';
import type { SimulationResult } from '../types';
import { SlidersHorizontal, Sparkles, Loader2, Zap } from 'lucide-react';
import { useLearner } from '../context/LearnerContext';

export const CareerSimulatorPage: React.FC = () => {
  const { profile } = useLearner();
  const [targetRole, setTargetRole] = useState(profile?.target_role || 'MLOps Engineer');
  const [dailyHours, setDailyHours] = useState(3.0);
  const [knownSkills] = useState<string[]>(['Python', 'SQL']);
  const [deadline, setDeadline] = useState('4 months');
  const [loading, setLoading] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResult | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await api.simulateCareer(targetRole, dailyHours, knownSkills, deadline);
      setSimulation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const applyPreset = (role: string, hours: number, dline: string) => {
    setTargetRole(role);
    setDailyHours(hours);
    setDeadline(dline);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Career & Schedule "What-If" Simulator
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Simulate alternative goal outcomes, daily study pacing, or career goal pivots in real time.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SIMULATION CONTROLS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Simulate Alternative Scenario</h3>
          <span className="text-xs text-slate-400 font-medium">Instant AI Recalculation</span>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 mr-1">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('AI Engineer', 3.0, '4 months')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            ⚡ AI Engineer (3h/day)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('MLOps Engineer', 4.0, '3 months')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            🚀 MLOps Sprint (4h/day)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('Data Scientist', 2.0, '6 months')}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            📊 Data Scientist (2h/day)
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Career Goal</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            >
              {['AI Engineer', 'MLOps Engineer', 'Data Scientist', 'Full Stack AI Developer'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Daily Available Hours</label>
            <select
              value={dailyHours}
              onChange={(e) => setDailyHours(parseFloat(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            >
              <option value={1.0}>1.0 Hour / Day (Steady)</option>
              <option value={2.0}>2.0 Hours / Day (Standard)</option>
              <option value={3.0}>3.0 Hours / Day (Accelerated)</option>
              <option value={4.0}>4.0 Hours / Day (Bootcamp Intensity)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Target Deadline</label>
            <select
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
            >
              <option value="3 months">3 Months</option>
              <option value="4 months">4 Months</option>
              <option value="6 months">6 Months</option>
              <option value="9 months">9 Months</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="button"
            onClick={handleSimulate}
            disabled={loading}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Calculate Simulated Path</span>
          </button>
        </div>
      </div>

      {/* 3. SIMULATION COMPARISON RESULTS */}
      {simulation ? (
        <div className="space-y-6 animate-in fade-in-50">
          <div className="p-4 bg-brand-50 border border-brand-200 rounded-2xl text-xs font-bold text-brand-950 flex items-center space-x-3 shadow-2xs">
            <Sparkles className="w-5 h-5 text-brand-600 shrink-0" />
            <span className="leading-relaxed">{simulation.differences.summary}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Baseline Path */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                CURRENT BASELINE PATH
              </span>
              <h3 className="text-xl font-black text-slate-900">{simulation.current_path.role}</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Daily Study Schedule:</span>
                  <span className="font-bold text-slate-900">{simulation.current_path.daily_hours}h / day</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Total Path Duration:</span>
                  <span className="font-bold text-slate-900">{simulation.current_path.duration_weeks} Weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Current Readiness:</span>
                  <span className="font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {simulation.current_path.readiness_score}%
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Path */}
            <div className="bg-white border-2 border-brand-500 rounded-2xl p-6 shadow-md space-y-4 relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  SIMULATED ALTERNATIVE PATH
                </span>
                {simulation.differences.duration_delta_weeks < 0 && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    {Math.abs(simulation.differences.duration_delta_weeks)} Weeks Faster!
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900">{simulation.simulated_path.role}</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">New Daily Schedule:</span>
                  <span className="font-bold text-slate-900">{simulation.simulated_path.daily_hours}h / day</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Simulated Path Duration:</span>
                  <span className="font-black text-slate-900">{simulation.simulated_path.duration_weeks} Weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Target Career Readiness:</span>
                  <span className="font-black text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                    {simulation.simulated_path.readiness_score}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Pre-Simulation Informational Card */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3 text-xs">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">BASELINE ACTIVE PATH</span>
            <h4 className="text-base font-extrabold text-slate-900">{profile?.target_role || 'AI Engineer'}</h4>
            <div className="space-y-1.5 text-slate-600 font-medium">
              <div className="flex justify-between">
                <span>Daily Study Allocation:</span>
                <strong className="text-slate-900">{profile?.daily_study_hours || 2.0}h/day</strong>
              </div>
              <div className="flex justify-between">
                <span>Target Deadline:</span>
                <strong className="text-slate-900">{profile?.target_deadline || 'March 31, 2027'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Current Readiness:</span>
                <strong className="text-brand-700">{profile?.readiness_score || 72}%</strong>
              </div>
            </div>
          </div>

          <div className="p-6 bg-brand-50/50 border border-dashed border-brand-300 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 text-xs">
            <div className="w-10 h-10 rounded-xl bg-white border border-brand-200 text-brand-600 flex items-center justify-center shadow-2xs">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-slate-900 text-sm">Ready to Test Scenarios</h4>
            <p className="text-slate-500 max-w-xs font-medium">
              Click <strong>"Calculate Simulated Path"</strong> above to test how increased study hours or new prerequisites compress your timeline.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
