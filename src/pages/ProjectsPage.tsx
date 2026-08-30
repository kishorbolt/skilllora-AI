import React, { useState } from 'react';
import { api } from '../services/api';
import type { ProjectSpec, ProjectEvaluation } from '../types';
import {
  FolderGit2, Sparkles, Award, Loader2, Code2, CheckCircle2,
  ArrowRight, ShieldCheck, Globe
} from 'lucide-react';

interface ProjectsPageProps {
  onProjectEvaluated: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onProjectEvaluated }) => {
  const [selectedSkill, setSelectedSkill] = useState('Deep Learning');
  const [loading, setLoading] = useState(false);
  const [projectSpec, setProjectSpec] = useState<ProjectSpec | null>(null);
  const [codeSnippet, setCodeSnippet] = useState(
    `import torch\nimport torch.nn as nn\n\nclass PyTorchClassifier(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = nn.Linear(10, 64)\n        self.relu = nn.ReLU()\n        self.dropout = nn.Dropout(0.2)\n        self.fc2 = nn.Linear(64, 2)\n        \n    def forward(self, x):\n        return self.fc2(self.dropout(self.relu(self.fc1(x))))`
  );
  const [reflection, setReflection] = useState(
    'Implemented a PyTorch modular neural network with Dropout regularization to prevent overfitting on validation folds. Trained with Adam optimizer over 50 epochs.'
  );
  const [githubUrl, setGithubUrl] = useState('https://github.com/alexmorgan/pytorch-classifier');
  const [evaluation, setEvaluation] = useState<ProjectEvaluation | null>(null);

  const sampleTemplates = [
    {
      skill: 'Deep Learning',
      title: 'PyTorch Neural Network Classifier',
      difficulty: 'Intermediate',
      hours: 4,
      desc: 'Build a modular MLP classifier with dropout regularization and cross-entropy loss.'
    },
    {
      skill: 'Machine Learning',
      title: 'End-to-End Scikit-Learn Pipeline',
      difficulty: 'Intermediate',
      hours: 3,
      desc: 'Construct a data preprocessing and hyperparameter search pipeline with cross-validation.'
    },
    {
      skill: 'MLOps',
      title: 'FastAPI Model Inference Microservice',
      difficulty: 'Advanced',
      hours: 5,
      desc: 'Package an ONNX model into a production async REST API with Docker containerization.'
    }
  ];

  const handleGenerate = async (skillToUse?: string) => {
    setLoading(true);
    setEvaluation(null);
    const skill = skillToUse || selectedSkill;
    setSelectedSkill(skill);
    try {
      const res = await api.generateProject(skill);
      setProjectSpec(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEvaluation = async () => {
    if (!projectSpec) return;
    setLoading(true);
    try {
      const res = await api.evaluateProject(projectSpec.id, codeSnippet, reflection, githubUrl);
      setEvaluation(res);
      onProjectEvaluated();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">AI Project Generator & Evaluator</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded">
                Proof of Skill Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Hands-on practical proof of skill. Code submissions and architectural reflections directly verify practical application in your Skill DNA.
            </p>
          </div>
        </div>
      </div>

      {/* 2. INITIAL STATE: GENERATION STUDIO & TEMPLATES PREVIEW */}
      {!projectSpec && (
        <div className="space-y-6">
          {/* Generator Launcher Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Generate Practice Project Specification</h3>
              <span className="text-xs text-slate-400 font-medium">Custom tailored to your skill gaps</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="w-full sm:w-auto">
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full sm:w-64 p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  {['Deep Learning', 'Machine Learning', 'Python', 'MLOps', 'SQL', 'Statistics', 'React', 'FastAPI'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={loading}
                className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center justify-center space-x-2 transition-all cursor-pointer w-full sm:w-auto"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Generate Project Spec</span>
              </button>
            </div>
          </div>

          {/* Project Templates Gallery */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Code2 className="w-4 h-4 text-brand-600" />
              <span>Recommended Practice Project Blueprints</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleTemplates.map((tpl, i) => (
                <div key={i} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs card-hover flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded">
                        {tpl.skill}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{tpl.hours}h est.</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900">{tpl.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{tpl.desc}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerate(tpl.skill)}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Start This Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Proof Verification Explainer */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-1 text-xs text-slate-600">
              <h4 className="font-extrabold text-slate-900 text-sm">How Project Evaluation Verifies Your Skill DNA</h4>
              <p className="leading-relaxed font-medium">
                SKILLORA AI evaluates your code submissions across 4 pillars: <strong>Correctness (30%)</strong>, <strong>Practical Application (30%)</strong>, <strong>Completeness (20%)</strong>, and <strong>Complexity (20%)</strong>. A score &gt; 70% automatically upgrades your Skill DNA status to <strong>"Verified"</strong> with immutable digital twin proof.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE PROJECT SPEC & SUBMISSION FORM */}
      {projectSpec && !evaluation && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-0.5 rounded uppercase">
                {projectSpec.skill_name} • {projectSpec.difficulty} • {projectSpec.estimated_hours}h estimated
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{projectSpec.title}</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">{projectSpec.objective}</p>
            </div>

            <button
              type="button"
              onClick={() => setProjectSpec(null)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold shrink-0 cursor-pointer"
            >
              Cancel / Choose Another
            </button>
          </div>

          {/* Requirements & Criteria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-extrabold text-slate-900 block">Technical Requirements:</span>
              <ul className="space-y-1 text-slate-600 font-medium">
                {(projectSpec.requirements || [
                  'Implement a multi-layer neural network with PyTorch',
                  'Include Dropout layer to prevent overfitting',
                  'Implement forward pass and loss computation'
                ]).map((req, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <span className="font-extrabold text-slate-900 block">Evaluation Rubric:</span>
              <ul className="space-y-1 text-slate-600 font-medium">
                {(projectSpec.evaluation_criteria || [
                  'Correct PyTorch nn.Module class hierarchy',
                  'Valid tensor dimension transformation',
                  'Clear trade-off reflection and reasoning'
                ]).map((crit, idx) => (
                  <li key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>{crit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Submission Fields */}
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span>GitHub Repository URL (Optional)</span>
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username/project"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-brand-600" />
                <span>Code Submission Snippet</span>
              </label>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                rows={7}
                className="w-full p-4 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl leading-relaxed focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Learner Architecture Reflection & Trade-Off Analysis
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={3}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleSubmitEvaluation}
              disabled={loading}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />}
              <span>Submit & Evaluate for Proof of Skill</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. EVALUATION RESULTS SCORECARD */}
      {evaluation && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6 animate-in fade-in-50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                PROOF OF SKILL VERIFIED
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{evaluation.project_title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold block uppercase">Overall Evaluation</span>
              <span className="text-3xl font-black text-emerald-600 block">{evaluation.overall_score}%</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
            {evaluation.feedback_text}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-center">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">CORRECTNESS</span>
              <span className="font-black text-slate-900 text-lg">{evaluation.correctness_score}%</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">APPLICATION</span>
              <span className="font-black text-slate-900 text-lg">{evaluation.application_score}%</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">COMPLETENESS</span>
              <span className="font-black text-slate-900 text-lg">{evaluation.completeness_score}%</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">COMPLEXITY</span>
              <span className="font-black text-slate-900 text-lg">{evaluation.complexity_score}%</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>Practical Application score updated: <strong className="text-emerald-700">{evaluation.practical_application_updated}%</strong></span>
            <span>New Skill DNA Score: <strong className="text-brand-700">{evaluation.new_skill_score}%</strong></span>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => { setEvaluation(null); setProjectSpec(null); }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Generate Another Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
