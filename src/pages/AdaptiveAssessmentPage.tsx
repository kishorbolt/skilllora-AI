import React, { useState } from 'react';
import {
  FileCheck2, CheckCircle2, XCircle, HelpCircle, ArrowRight, ArrowLeft,
  RotateCcw, Clock, BookOpen, Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { SkeletonCard } from '../components/common/SkeletonLoader';

interface Question {
  id: number;
  question_text: string;
  options: string[];
  correct_answer_index: number;
  explanation: string;
  concept: string;
  difficulty: string;
}

interface AssessmentResult {
  score: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  total_questions: number;
  performance_tag: string;
  technology: string;
  topic_performance: Record<string, number>;
  weak_topics: string[];
  strong_topics: string[];
  mistake_list: Array<{
    question_id: number;
    question_text: string;
    user_answer: string;
    correct_answer: string;
    explanation: string;
    topic: string;
    recommended_review: string;
  }>;
  full_review_list: Array<{
    question_id: number;
    question_text: string;
    options: string[];
    user_answer_index: number | null;
    correct_answer_index: number;
    explanation: string;
    topic: string;
    status: string;
  }>;
  roadmap_updated: boolean;
  adaptation_summary: string | null;
}

interface AdaptiveAssessmentPageProps {
  onAssessmentComplete?: () => void;
}

export const AdaptiveAssessmentPage: React.FC<AdaptiveAssessmentPageProps> = ({ onAssessmentComplete }) => {
  const [selectedTech, setSelectedTech] = useState<string>('Python');
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showMistakesModal, setShowMistakesModal] = useState<boolean>(false);
  const [showFullReviewModal, setShowFullReviewModal] = useState<boolean>(false);

  const technologies = [
    'Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'FastAPI',
    'React', 'TypeScript', 'SQL', 'MLOps', 'Node.js', 'Statistics', 'System Design'
  ];

  const handleStartAssessment = async (tech: string) => {
    try {
      setLoading(true);
      setSelectedTech(tech);
      const pkg = await api.startTechAssessment(tech);
      setQuestions(pkg.questions || []);
      setCurrentIndex(0);
      setUserAnswers({});
      setResult(null);
      setInProgress(true);
    } catch (e) {
      console.error('Failed to start assessment:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitAssessment = async () => {
    try {
      setShowSubmitModal(false);
      setLoading(true);
      const formattedAnswers = Object.entries(userAnswers).map(([qid, optIdx]) => ({
        question_id: Number(qid),
        selected_option_index: optIdx
      }));

      const res = await api.submitTechAssessment({
        technology: selectedTech,
        questions: questions,
        answers: formattedAnswers,
        duration_seconds: 1200
      });

      setResult(res);
      setInProgress(false);
      if (onAssessmentComplete) onAssessmentComplete();
    } catch (e) {
      console.error('Failed to submit assessment:', e);
    } finally {
      setLoading(false);
    }
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;
  const progressPct = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>30-MCQ Technology Skill Assessment Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Adaptive Diagnostic Assessments</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed font-medium">
            Select any technology to take an exact 30-question diagnostic evaluation (10 Easy, 12 Medium, 8 Hard) with 10-point MCQ validation and mistake review analysis.
          </p>
        </div>

        {!inProgress && !result && (
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs">
              18+ Tech Banks Ready
            </span>
          </div>
        )}
      </div>

      {loading && !inProgress && (
        <div className="space-y-4">
          <SkeletonCard rows={3} />
          <SkeletonCard rows={4} />
        </div>
      )}

      {/* 2. BEFORE STARTING: TECH SELECTION & PREVIEW CARDS */}
      {!inProgress && !result && !loading && (
        <div className="space-y-6">
          {/* Active Selected Tech Info Card */}
          <div className="bg-gradient-to-r from-brand-600 to-indigo-700 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-white/15 px-3 py-1 rounded-md text-xs font-extrabold border border-white/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SELECTED ASSESSMENT</span>
              </div>
              <h3 className="text-2xl font-black tracking-tight uppercase">
                {selectedTech} SKILL ASSESSMENT
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 pt-1">
                <span className="bg-white/15 px-2.5 py-1 rounded-md font-bold">30 Questions</span>
                <span>•</span>
                <span>10 Easy</span>
                <span>•</span>
                <span>12 Medium</span>
                <span>•</span>
                <span>8 Hard</span>
                <span>•</span>
                <span>Est. 25 minutes</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartAssessment(selectedTech)}
              className="px-8 py-3.5 bg-white text-brand-700 hover:bg-slate-50 font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Technology Selector Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Choose Technology Assessment
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {technologies.map(tech => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTech(tech)}
                  className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-3 transition-all card-hover cursor-pointer ${
                    selectedTech === tech
                      ? 'border-brand-500 bg-brand-50/50 ring-2 ring-brand-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-2xs">
                    {tech.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{tech}</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">30 MCQs • 25 Mins</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. DURING ASSESSMENT: RUNNER UI */}
      {inProgress && currentQ && (
        <div className="space-y-6">
          {/* Runner Header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-brand-600 block uppercase tracking-wider">
                {selectedTech} Diagnostic Assessment
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Question {currentIndex + 1} of {questions.length}
              </h3>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Answered: {answeredCount} / {questions.length} ({progressPct}%)</span>
              </div>

              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Submit Assessment
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Box (3 cols) */}
            <div className="lg:col-span-3 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                  Topic: {currentQ.concept}
                </span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-md ${
                  currentQ.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                  currentQ.difficulty === 'Medium' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-800'
                }`}>
                  {currentQ.difficulty}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                {currentQ.question_text}
              </h4>

              {/* 4 Options */}
              <div className="space-y-3 pt-2">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = userAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full p-4 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50 text-brand-900 ring-2 ring-brand-200 shadow-2xs'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className={`w-6 h-6 rounded-full font-extrabold text-xs flex items-center justify-center ${
                          isSelected ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center space-x-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(true)}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Finish & Submit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Question Navigator (1 to 30 Grid) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-3">
                Question Navigator
              </h4>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-9 rounded-lg font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'ring-2 ring-brand-500 bg-slate-900 text-white'
                          : isAnswered
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. AFTER ASSESSMENT: RESULTS VIEW */}
      {result && (
        <div className="space-y-8 animate-in fade-in-50 duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ASSESSMENT COMPLETE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{result.technology} Skill Assessment Result</h2>
              <p className="text-xs text-slate-500 font-medium">
                Evaluation completed across 30 validated questions. Skill DNA and Skill Gap analysis updated.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-2xl min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Score</span>
                <span className="text-3xl font-black text-brand-600">{result.score}%</span>
              </div>
              <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-2xl min-w-[120px]">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Performance</span>
                <span className="text-sm font-extrabold text-slate-900 block mt-1">{result.performance_tag}</span>
              </div>
            </div>
          </div>

          {/* Correct / Incorrect / Unanswered Breakdown Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Correct Answers</span>
                <span className="text-2xl font-black text-emerald-600">{result.correct_count} / 30</span>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Incorrect Mistakes</span>
                <span className="text-2xl font-black text-rose-600">{result.incorrect_count}</span>
              </div>
            </div>

            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-2xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Unanswered</span>
                <span className="text-2xl font-black text-slate-700">{result.unanswered_count}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setShowMistakesModal(true)}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>See What I Got Wrong ({result.incorrect_count} Mistakes)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFullReviewModal(true)}
              className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold text-xs rounded-xl shadow-2xs flex items-center space-x-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Review All 30 Questions</span>
            </button>

            <button
              type="button"
              onClick={() => handleStartAssessment(result.technology)}
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-2 ml-auto cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Assessment</span>
            </button>
          </div>

          {/* Topic-Wise Performance Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Topic-Wise Performance Breakdown
            </h3>

            <div className="space-y-3">
              {Object.entries(result.topic_performance).map(([topic, topScore]) => (
                <div key={topic} className="space-y-1 text-xs">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-800">{topic}</span>
                    <span className={topScore >= 70 ? 'text-emerald-600' : 'text-rose-600'}>{topScore}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${topScore >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                      style={{ width: `${topScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900">Submit Assessment?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You have answered {answeredCount} of {questions.length} questions. Submitting will calculate your diagnostic score and update your Skill DNA evidence.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAssessment}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MISTAKES REVIEW MODAL ("See What I Got Wrong") */}
      {showMistakesModal && result && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>Review Mistakes ({result.mistake_list.length} Questions)</span>
                </h3>
                <p className="text-xs text-slate-500">Detailed concept explanations for incorrect answers.</p>
              </div>
              <button type="button" onClick={() => setShowMistakesModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {result.mistake_list.map((m, i) => (
                <div key={i} className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">Question {i + 1}</span>
                    <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      Topic: {m.topic}
                    </span>
                  </div>

                  <p className="font-bold text-slate-800">{m.question_text}</p>

                  <div className="space-y-1.5 pt-1">
                    <div className="p-2.5 bg-rose-100/70 text-rose-900 rounded-lg font-medium flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span><strong>Your Answer:</strong> {m.user_answer}</span>
                    </div>

                    <div className="p-2.5 bg-emerald-100/70 text-emerald-900 rounded-lg font-medium flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Correct Answer:</strong> {m.correct_answer}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1 text-slate-700">
                    <span className="font-bold block text-slate-900">Why:</span>
                    <p className="leading-relaxed">{m.explanation}</p>
                  </div>

                  <div className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded inline-block">
                    Recommended Review: {m.recommended_review}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 text-right bg-slate-50">
              <button
                type="button"
                onClick={() => setShowMistakesModal(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL REVIEW MODAL (All 30 Questions) */}
      {showFullReviewModal && result && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">All 30 Questions Review</h3>
                <p className="text-xs text-slate-500">Full breakdown of all answers provided.</p>
              </div>
              <button type="button" onClick={() => setShowFullReviewModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <XCircle className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {result.full_review_list.map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border text-xs space-y-2 ${
                  item.status === 'correct' ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Q{i + 1}. {item.question_text}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      item.status === 'correct' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-slate-600"><strong>Explanation:</strong> {item.explanation}</p>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 text-right bg-slate-50">
              <button
                type="button"
                onClick={() => setShowFullReviewModal(false)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
