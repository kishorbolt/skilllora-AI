import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { useLearner } from '../context/LearnerContext';
import { EditProfileModal } from '../components/modals/EditProfileModal';
import { ManageSkillModal } from '../components/modals/ManageSkillModal';
import { AddCourseModal } from '../components/modals/AddCourseModal';
import { AddInterestModal } from '../components/modals/AddInterestModal';
import { ResumeUploadCard } from '../components/profile/ResumeUploadCard';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/SkeletonLoader';
import { BACKEND_URL } from '../services/api';
import {
  User, ShieldCheck, Sparkles, Bookmark, BookOpen, ExternalLink,
  Plus, Trash2, MapPin, Mail, Phone, Globe, Briefcase, Award,
  Clock, Sliders
} from 'lucide-react';

interface LearnerProfilePageProps {
  profile: UserProfile | null;
  onProfileUpdated: () => void;
}

export const LearnerProfilePage: React.FC<LearnerProfilePageProps> = ({ profile: propProfile, onProfileUpdated }) => {
  const {
    profile: contextProfile,
    skills,
    courses,
    interests,
    loading,
    deleteSkill,
    deleteCourse,
    deleteInterest
  } = useLearner();

  const profile = contextProfile || propProfile;

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showManageSkill, setShowManageSkill] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [showAddInterest, setShowAddInterest] = useState(false);

  const getInitials = (name: string) => {
    return (name || 'Learner')
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  if (loading && !profile) {
    return (
      <div className="space-y-6 pb-12">
        <SkeletonCard rows={3} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonCard rows={4} />
          <div className="lg:col-span-2 space-y-6">
            <SkeletonCard rows={3} />
            <SkeletonCard rows={3} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* 1. HEADER BANNER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="relative shrink-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url.startsWith('http') || profile.avatar_url.startsWith('blob:') || profile.avatar_url.startsWith('data:') ? profile.avatar_url : `${BACKEND_URL}${profile.avatar_url}`}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-brand-500 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-black text-2xl flex items-center justify-center border-2 border-slate-700 shadow-sm">
                {getInitials(profile?.name || 'Learner')}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{profile?.name || 'Learner'}</h2>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Verified Digital Twin</span>
              </span>
            </div>

            <p className="text-xs font-bold text-brand-600">
              {profile?.target_role || profile?.career_goal || 'AI Engineer'}
            </p>

            <p className="text-xs text-slate-600 max-w-xl leading-relaxed font-medium">
              {profile?.bio || 'Building hands-on domain competencies and verified Skill DNA.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEditProfile(true)}
          className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-2 transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Information, Career Goals, Learning Preferences */}
        <div className="space-y-6">
          {/* PERSONAL INFORMATION CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Personal Information</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditProfile(true)}
                className="text-[11px] font-bold text-brand-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center space-x-2.5 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-900 truncate">{profile?.email || 'learner@skillora.ai'}</span>
              </div>

              <div className="flex items-center space-x-2.5 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-800">{profile?.location || 'India (Remote)'}</span>
              </div>

              {profile?.phone && (
                <div className="flex items-center space-x-2.5 text-slate-600">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{profile.phone}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
                {profile?.linkedin_url ? (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 flex items-center space-x-1.5 font-semibold text-[11px] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-brand-600" />
                    <span>LinkedIn</span>
                  </a>
                ) : null}

                {profile?.github_url ? (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 flex items-center space-x-1.5 font-semibold text-[11px] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-900" />
                    <span>GitHub</span>
                  </a>
                ) : null}

                {profile?.portfolio_url ? (
                  <a
                    href={profile.portfolio_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 flex items-center space-x-1.5 font-semibold text-[11px] transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Portfolio</span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          {/* RESUME & CAREER DOCUMENT */}
          {profile && <ResumeUploadCard profile={profile} onProfileUpdated={onProfileUpdated} />}

          {/* CAREER GOALS CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Career Objectives</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditProfile(true)}
                className="text-[11px] font-bold text-brand-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {profile?.career_goal || profile?.target_role ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Current Role:</span>
                  <span className="font-bold text-slate-900">{profile?.current_role || 'Student'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Target Career:</span>
                  <span className="font-extrabold text-brand-600">{profile?.target_role || profile?.career_goal || 'AI Engineer'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Target Date:</span>
                  <span className="font-bold text-slate-900">{profile?.target_deadline || 'March 31, 2027'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Experience Level:</span>
                  <span className="font-bold text-slate-900">{profile?.experience_level || 'Intermediate'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Readiness Score:</span>
                  <span className="font-black text-brand-700 bg-brand-50 border border-brand-200 px-2 py-0.5 rounded">
                    {profile?.readiness_score || 72}%
                  </span>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No Target Career Yet"
                description="Set a target career so SKILLORA AI can build your career skill profile and personalized roadmap."
                actionText="Set Career Goal"
                onAction={() => setShowEditProfile(true)}
                variant="compact"
              />
            )}
          </div>

          {/* LEARNING PREFERENCES CARD */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-slate-500" />
                <span>Learning Preferences</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditProfile(true)}
                className="text-[11px] font-bold text-brand-600 hover:underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {profile?.daily_study_hours ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Daily Study:</span>
                  </span>
                  <span className="font-bold text-slate-900">{profile.daily_study_hours} hours/day</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Format:</span>
                  <span className="font-bold text-slate-900">{profile.preferred_format || 'Projects + Video'}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Difficulty:</span>
                  <span className="font-bold text-slate-900">{profile.preferred_difficulty || 'Intermediate'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Weekly Availability:</span>
                  <span className="font-bold text-brand-700">{profile.weekly_availability || '14 Hours / Week'}</span>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Sliders}
                title="No Learning Preferences Yet"
                description="Tell SKILLORA AI how and when you prefer to learn."
                actionText="Set Preferences"
                onAction={() => setShowEditProfile(true)}
                variant="compact"
              />
            )}
          </div>
        </div>

        {/* Right Column: Skills, Completed Courses, Interested Courses */}
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION: MY SKILLS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>My Skills & Evidence Status</span>
                </h3>
                <p className="text-[11px] text-slate-500">Distinguishes self-reported claims from verified practical evidence.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowManageSkill(true)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manage Skills</span>
              </button>
            </div>

            {skills && skills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((sk) => (
                  <div key={sk.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-brand-200 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900">{sk.skill_name}</span>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          sk.is_verified ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {sk.is_verified ? 'Verified Evidence' : 'Self-Reported'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {sk.category} • {sk.level}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900 text-sm">{Math.round(sk.proficiency)}%</span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Remove skill ${sk.skill_name}?`)) {
                            await deleteSkill(sk.id);
                            onProfileUpdated();
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Award}
                title="No Skills Added Yet"
                description="Add your skills so SKILLORA AI can understand your current capabilities and identify skill gaps."
                actionText="+ Add Skill"
                onAction={() => setShowManageSkill(true)}
              />
            )}
          </div>

          {/* SECTION: COMPLETED COURSES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Completed Courses</span>
                </h3>
                <p className="text-[11px] text-slate-500">Logs course completion evidence into your digital twin timeline.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddCourse(true)}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Course</span>
              </button>
            </div>

            {courses && courses.length > 0 ? (
              <div className="space-y-3">
                {courses.map((crs) => (
                  <div key={crs.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-brand-200 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-sm">{crs.course_name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-bold px-2 py-0.5 rounded">
                          {crs.provider}
                        </span>
                      </div>
                      {crs.description && <p className="text-slate-600 text-[11px] mt-0.5">{crs.description}</p>}
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Completed: {crs.completion_date} • {crs.duration_hours}h duration • Skill: {crs.skill_name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 ml-3">
                      {crs.certificate_url && (
                        <a
                          href={crs.certificate_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 text-brand-600 hover:text-brand-700"
                          title="View Certificate"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Remove completed course "${crs.course_name}"?`)) {
                            await deleteCourse(crs.id);
                            onProfileUpdated();
                          }
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="No Completed Courses Yet"
                description="Add your completed courses to strengthen your learning history."
                actionText="+ Add Course"
                onAction={() => setShowAddCourse(true)}
              />
            )}
          </div>

          {/* SECTION: INTERESTED COURSES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Bookmark className="w-4 h-4 text-brand-600" />
                  <span>Interested Courses & Bookmarks</span>
                </h3>
                <p className="text-[11px] text-slate-500">Bookmarking resources increases AI recommendation relevance by +15%.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddInterest(true)}
                className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Bookmark Course</span>
              </button>
            </div>

            {interests && interests.length > 0 ? (
              <div className="space-y-3">
                {interests.map((int) => (
                  <div key={int.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs hover:border-brand-200 transition-colors">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-slate-900 text-sm">{int.resource_name}</span>
                        <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-0.5 rounded">
                          {int.skill_name} • {int.difficulty}
                        </span>
                      </div>
                      {int.notes && <p className="text-slate-600 text-[11px] mt-0.5">{int.notes}</p>}
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Provider: {int.provider} • Saved: {int.saved_at} • {int.duration_minutes} mins
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={async () => {
                        await deleteInterest(int.id);
                        onProfileUpdated();
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer shrink-0 ml-3"
                      title="Delete bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bookmark}
                title="No Interested Courses Yet"
                description="Save courses and resources you want to learn later."
                actionText="+ Add Interested Course"
                onAction={() => setShowAddInterest(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ATTRIBUTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <img
            src="/piyrowarelogo.jpeg"
            alt="Piyroware Logo"
            className="w-7 h-7 rounded object-cover border border-slate-200 shadow-2xs"
          />
          <div>
            <span className="font-extrabold text-slate-900 block">Designed by Team Piyroware</span>
            <span className="text-[11px] text-slate-400 font-medium">SKILLORA AI — Adaptive Intelligence for Personalized Learning</span>
          </div>
        </div>

        <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2.5 py-1 rounded">
          Enterprise SaaS Production Ready
        </span>
      </div>

      {/* MODALS */}
      {showEditProfile && profile && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onProfileUpdated={() => onProfileUpdated()}
        />
      )}

      {showManageSkill && (
        <ManageSkillModal
          onClose={() => setShowManageSkill(false)}
          onSkillAdded={() => onProfileUpdated()}
        />
      )}

      {showAddCourse && (
        <AddCourseModal
          onClose={() => setShowAddCourse(false)}
          onCourseAdded={() => onProfileUpdated()}
        />
      )}

      {showAddInterest && (
        <AddInterestModal
          onClose={() => setShowAddInterest(false)}
          onInterestAdded={() => onProfileUpdated()}
        />
      )}
    </div>
  );
};
