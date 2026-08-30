import React, { useState } from 'react';
import type { UserProfile } from '../../types';
import { useLearner } from '../../context/LearnerContext';
import { X, Upload, Trash2, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ profile, onClose, onProfileUpdated }) => {
  const { updateProfile, uploadAvatar, removeAvatar, addToast } = useLearner();

  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    location: profile.location || '',
    phone: profile.phone || '',
    linkedin_url: profile.linkedin_url || '',
    github_url: profile.github_url || '',
    portfolio_url: profile.portfolio_url || '',
    current_role: profile.current_role || '',
    target_role: profile.target_role || '',
    career_goal: profile.career_goal || '',
    experience_level: profile.experience_level || 'Intermediate',
    target_deadline: profile.target_deadline || '',
    daily_study_hours: profile.daily_study_hours || 2.0,
    preferred_format: profile.preferred_format || 'Interactive & Project-based',
    preferred_difficulty: profile.preferred_difficulty || 'Intermediate',
    weekly_availability: profile.weekly_availability || ''
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(profile.avatar_url || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('Error', 'File size exceeds 5MB limit', 'error');
      return;
    }

    setUploadingAvatar(true);
    try {
      await uploadAvatar(file);
      // Let the global context update it, but we can set preview here temporarily if needed
      // but actually, useLearner should update the profile and the prop will eventually change.
      setAvatarPreview(URL.createObjectURL(file));
      addToast('Success', 'Profile Photo Updated', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error', 'Failed to upload photo', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatar();
      setAvatarPreview(null);
      addToast('Success', 'Profile Photo Removed', 'success');
    } catch (err) {
      console.error(err);
      addToast('Error', 'Failed to remove photo', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus('idle');
    try {
      await updateProfile(formData);
      setSaveStatus('success');
      addToast('Success', 'Profile Updated Successfully', 'success');
      setTimeout(() => {
        onProfileUpdated({ ...profile, ...formData });
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">EDIT LEARNER PROFILE</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Avatar Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              PROFILE PHOTO
            </h3>
            <div className="flex items-center space-x-5 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-xs"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center border-2 border-slate-700">
                    {formData.name ? formData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'UI'}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                {avatarPreview ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> <span>Profile Photo Updated</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-500 block">No profile photo. Upload a professional profile image.</span>
                )}
                <div className="flex items-center space-x-3 mt-2">
                  <label className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg cursor-pointer flex items-center space-x-1.5 shadow-2xs transition-colors">
                    {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 text-brand-600" />}
                    <span>{uploadingAvatar ? 'Uploading...' : (avatarPreview ? 'Change Photo' : 'Upload Photo')}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold text-xs rounded-lg flex items-center space-x-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Photo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              PERSONAL INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder-slate-400"
                />
                <p className="text-[10px] text-slate-500 mt-1">This name will appear across your SKILLORA AI dashboard.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder-slate-400"
                />
                <p className="text-[10px] text-slate-500 mt-1">We'll use this email for important learning updates.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  placeholder="Enter your city and country"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Short Bio</label>
              <textarea
                placeholder="Tell us briefly about yourself, your background and your learning goals."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 font-medium placeholder-slate-400"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              SOCIAL & PROFESSIONAL LINKS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Portfolio URL</label>
                <input
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio_url}
                  onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Career Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              CAREER INFORMATION
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Developer"
                  value={formData.current_role}
                  onChange={(e) => setFormData({ ...formData, current_role: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Role / Career Goal</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Engineer"
                  value={formData.target_role}
                  onChange={(e) => setFormData({ ...formData, target_role: e.target.value, career_goal: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-900 placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
                <select
                  value={formData.experience_level}
                  onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  required
                  value={
                    formData.target_deadline && !formData.target_deadline.includes(' ')
                      ? formData.target_deadline 
                      : '2027-03-31'
                  }
                  onChange={(e) => setFormData({ ...formData, target_deadline: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Selected: {formData.target_deadline || 'March 31, 2027'}
                </p>
              </div>
            </div>
          </div>

          {/* Learning Preferences */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
              LEARNING PREFERENCES
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Daily Study Hours</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="e.g. 2"
                  value={formData.daily_study_hours}
                  onChange={(e) => setFormData({ ...formData, daily_study_hours: parseFloat(e.target.value) || 2.0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400"
                />
                <p className="text-[10px] text-slate-500 mt-1">How many hours can you realistically study each day?</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Weekly Availability</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 days per week"
                  value={formData.weekly_availability}
                  onChange={(e) => setFormData({ ...formData, weekly_availability: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400"
                />
                <p className="text-[10px] text-slate-500 mt-1">How many days per week can you dedicate to learning?</p>
              </div>
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Learning Format</label>
                <select
                  value={formData.preferred_format}
                  onChange={(e) => setFormData({ ...formData, preferred_format: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Interactive & Project-based">Interactive & Project-based</option>
                  <option value="Video-based">Video-based</option>
                  <option value="Reading-based">Reading-based</option>
                  <option value="Hands-on Practice">Hands-on Practice</option>
                  <option value="Mixed Learning">Mixed Learning</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Difficulty</label>
                <select
                  value={formData.preferred_difficulty}
                  onChange={(e) => setFormData({ ...formData, preferred_difficulty: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Adaptive">Adaptive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {saveStatus === 'error' && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200">
              Unable to update profile. Please try again.
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saveStatus === 'success'}
              className={`px-6 py-2.5 font-bold text-xs rounded-lg shadow-sm flex items-center space-x-2 transition-colors disabled:opacity-50 ${
                saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-brand-600 hover:bg-brand-700 text-white'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : saveStatus === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Profile Updated Successfully</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Update Details</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
