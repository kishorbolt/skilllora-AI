import React, { useState, useRef } from 'react';
import type { UserProfile } from '../../types';
import { api, BACKEND_URL } from '../../services/api';
import { FileText, Upload, Loader2, Sparkles, Trash2, CheckCircle2, AlertCircle, Eye, RefreshCw } from 'lucide-react';

interface ResumeUploadCardProps {
  profile: UserProfile;
  onProfileUpdated: () => void;
}

export const ResumeUploadCard: React.FC<ResumeUploadCardProps> = ({ profile, onProfileUpdated }) => {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File exceeds 10MB limit. Please upload a smaller PDF, DOC or DOCX file.');
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !['pdf', 'doc', 'docx'].includes(ext)) {
      setError('Invalid file format. Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await api.uploadResume(file);
      setSuccessMsg('✓ Resume uploaded successfully');
      setTimeout(() => setSuccessMsg(null), 4000);
      onProfileUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    // Reset file input so same file can be re-selected if needed
    if (e.target) e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError(null);
    setSuccessMsg(null);
    try {
      await api.analyzeResume();
      setSuccessMsg('✓ Resume Analysis Complete');
      setTimeout(() => setSuccessMsg(null), 4000);
      onProfileUpdated();
    } catch (err: any) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to remove your resume?')) return;
    try {
      await api.removeResume();
      setSuccessMsg('Resume removed successfully');
      setTimeout(() => setSuccessMsg(null), 3000);
      onProfileUpdated();
    } catch (err: any) {
      setError(err.message || 'Failed to remove resume');
    }
  };

  const defaultFilename = `${profile.name.replace(/\s+/g, '_')}_Resume.${(profile.resume_filetype || 'PDF').toLowerCase()}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Resume & Career Document Intelligence</span>
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700">✕</button>
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold border border-emerald-200 flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {!profile.resume_url ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl transition-all ${
            isDragOver ? 'border-brand-500 bg-brand-50/50' : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100/70'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-slate-900 mb-1">No Resume Uploaded Yet</p>
          <p className="text-xs text-slate-500 mb-4 text-center max-w-sm">
            Drag & drop your resume (.PDF, .DOC, or .DOCX up to 10MB) or browse to enable AI skill extraction.
          </p>
          <label className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center space-x-2 transition-colors shadow-xs">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{uploading ? 'Uploading Resume...' : 'Upload Resume'}</span>
            <input
              ref={fileInputRef}
              aria-label="Upload Resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={uploading}
            />
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 shrink-0 bg-brand-100 text-brand-700 rounded-lg flex items-center justify-center font-bold text-xs uppercase">
                {profile.resume_filetype || 'PDF'}
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-slate-900 truncate" title={profile.resume_filename || defaultFilename}>
                  {profile.resume_filename || defaultFilename}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {profile.resume_filetype || 'PDF'} • {profile.resume_filesize || '1.2 MB'} • Uploaded {profile.resume_uploaded_at || 'Recently'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 shrink-0 flex-wrap gap-y-2">
              <a 
                href={profile.resume_url.startsWith('http') || profile.resume_url.startsWith('blob:') || profile.resume_url.startsWith('data:') ? profile.resume_url : `${BACKEND_URL}${profile.resume_url}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg transition-colors flex items-center space-x-1.5 text-xs shadow-2xs"
                title="View Resume"
              >
                <Eye className="w-3.5 h-3.5 text-brand-600" />
                <span>View Resume</span>
              </a>
              <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg cursor-pointer transition-colors flex items-center space-x-1.5 text-xs shadow-2xs">
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${uploading ? 'animate-spin' : ''}`} />
                <span>{uploading ? 'Replacing...' : 'Replace Resume'}</span>
                <input
                  aria-label="Replace Resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileInputChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors flex items-center space-x-1.5 text-xs"
                title="Remove Resume"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span className="text-xs font-bold text-slate-900">AI Resume Extraction</span>
              </div>
              
              {profile.resume_analysis_status === 'analyzed' ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>✓ Resume Analysis Complete</span>
                </span>
              ) : (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-extrabold px-2.5 py-0.5 rounded-full">
                  Pending Analysis
                </span>
              )}
            </div>

            {profile.resume_analysis_status === 'analyzed' && profile.resume_insights ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Extracted <strong className="text-slate-900">{profile.resume_insights.detected_skills?.length || 0} candidate skills</strong>, <strong className="text-slate-900">{profile.resume_insights.detected_roles?.length || 0} potential roles</strong>, and <strong className="text-slate-900">{profile.resume_insights.detected_projects || 0} projects</strong>.
                </p>
                {profile.resume_insights.detected_skills && profile.resume_insights.detected_skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {profile.resume_insights.detected_skills.map((s: any, idx: number) => (
                      <span key={idx} className="text-[10px] font-extrabold bg-brand-50 border border-brand-200 text-brand-700 px-2.5 py-1 rounded-lg">
                        {s.name} ({s.level || 'Intermediate'})
                      </span>
                    ))}
                  </div>
                )}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium italic">
                    Note: Resume extraction informs recommendations and must be verified with assessments/projects for Skill DNA verification.
                  </span>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${analyzing ? 'animate-spin' : ''}`} />
                    <span>Re-Analyze</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {analyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>{analyzing ? 'Analyzing Resume with AI...' : 'Analyze Resume with AI'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
