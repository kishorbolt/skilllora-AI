import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { UserProfile, LearnerSkillItem, CompletedCourse, InterestedResource, AuthUser } from '../types';
import { api, getStoredToken, getStoredUser } from '../services/api';
import { Toast } from '../components/common/Toast';
import type { ToastMessage } from '../components/common/Toast';

interface LearnerContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  skills: LearnerSkillItem[];
  courses: CompletedCourse[];
  interests: InterestedResource[];
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  dataRevision: number;
  login: (data: { username_or_email: string; password: string }) => Promise<void>;
  register: (data: { username: string; email: string; password: string; confirm_password?: string; name?: string }) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  refetchProfile: () => Promise<void>;
  refetchAll: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  addSkill: (data: { skill_name: string; category?: string; proficiency: number; level: string; is_self_reported: boolean }) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
  addCourse: (data: { course_name: string; provider: string; skill_name: string; completion_date: string; duration_hours: number; certificate_url?: string; description?: string }) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  addInterest: (data: { resource_id?: number; resource_name: string; skill_name: string; difficulty: string; duration_minutes: number; provider: string; notes?: string }) => Promise<void>;
  deleteInterest: (id: number) => Promise<void>;
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser());
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<LearnerSkillItem[]>([]);
  const [courses, setCourses] = useState<CompletedCourse[]>([]);
  const [interests, setInterests] = useState<InterestedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataRevision, setDataRevision] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllLearnerState = useCallback(() => {
    setProfile(null);
    setSkills([]);
    setCourses([]);
    setInterests([]);
    setError(null);
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getStoredToken();
      if (!token) {
        // Unauthenticated state
        setUser(null);
        setProfile(null);
        setSkills([]);
        setCourses([]);
        setInterests([]);
        setLoading(false);
        return;
      }

      const [profData, skList, crsList, intList] = await Promise.all([
        api.getUserProfile(),
        api.getUserSkills().catch(() => []),
        api.getCompletedCourses().catch(() => []),
        api.getInterestedResources().catch(() => [])
      ]);

      setProfile(profData);
      setSkills(skList || []);
      setCourses(crsList || []);
      setInterests(intList || []);
      setDataRevision(prev => prev + 1);
    } catch (e: any) {
      console.warn('Failed to load learner context:', e);
      // If 401 Unauthorized, clear stored token
      if (e?.message && (e.message.includes('401') || e.message.includes('validate credentials'))) {
        await api.logout();
        setUser(null);
        clearAllLearnerState();
      } else {
        setError(e?.message || 'Could not connect to SKILLORA AI backend.');
      }
    } finally {
      setLoading(false);
    }
  }, [clearAllLearnerState]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const login = async (credentials: { username_or_email: string; password: string }) => {
    try {
      setLoading(true);
      clearAllLearnerState();
      const res = await api.login(credentials);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      await fetchAllData();
      addToast('Welcome Back', `Logged in as ${res.user.name || res.user.username || 'Learner'}.`);
    } catch (e: any) {
      console.error('Login error:', e);
      const msg = e?.message || 'Invalid username/email or password.';
      addToast('Login Failed', msg, 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: { username: string; email: string; password: string; confirm_password?: string; name?: string }) => {
    try {
      setLoading(true);
      clearAllLearnerState();
      const res = await api.register(data);
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      await fetchAllData();
      addToast('Account Created', `Welcome to SKILLORA AI, ${res.user.name || res.user.username}!`);
    } catch (e: any) {
      console.error('Register error:', e);
      const msg = e?.message || 'Could not create account.';
      addToast('Registration Failed', msg, 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async () => {
    try {
      setLoading(true);
      clearAllLearnerState();
      const res = await api.loginDemo();
      setUser(res.user);
      if (res.profile) setProfile(res.profile);
      await fetchAllData();
      addToast('Demo Account Active', 'Logged in as KISHOR G (Demo Learner).');
    } catch (e: any) {
      console.error('Demo login error:', e);
      addToast('Demo Error', 'Could not load demo account.', 'error');
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignore
    } finally {
      setUser(null);
      clearAllLearnerState();
      setDataRevision(prev => prev + 1);
      addToast('Signed Out', 'You have been signed out of SKILLORA AI.');
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      const updated = await api.updateUserProfile(data);
      setProfile(updated);
      await fetchAllData();
      addToast('Profile Updated Successfully', 'Your profile and learning roadmaps have been updated in real time.');
    } catch (e) {
      console.error('Failed to update profile:', e);
      addToast('Update Failed', 'Could not save profile changes. Please try again.', 'error');
      throw e;
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      await api.uploadAvatar(file);
      await fetchAllData();
      addToast('Profile Photo Updated', 'Your profile photo is now active across SKILLORA AI.');
    } catch (e) {
      console.error('Failed to upload avatar:', e);
      addToast('Upload Failed', 'Could not upload photo. Max size is 5MB.', 'error');
      throw e;
    }
  };

  const removeAvatar = async () => {
    try {
      await api.removeAvatar();
      await fetchAllData();
      addToast('Profile Photo Removed', 'Your profile photo has been reset.');
    } catch (e) {
      console.error('Failed to remove avatar:', e);
      addToast('Error', 'Could not remove profile photo.', 'error');
    }
  };

  const addSkill = async (data: { skill_name: string; category?: string; proficiency: number; level: string; is_self_reported: boolean }) => {
    try {
      await api.addUserSkill(data);
      await fetchAllData();
      addToast('Skill Added', `Added ${data.skill_name} to your profile and Skill DNA analysis.`);
    } catch (e) {
      console.error('Failed to add skill:', e);
      addToast('Error', 'Could not add skill.', 'error');
      throw e;
    }
  };

  const deleteSkill = async (id: number) => {
    try {
      await api.deleteUserSkill(id);
      await fetchAllData();
      addToast('Skill Removed', 'Skill removed from your profile.');
    } catch (e) {
      console.error('Failed to delete skill:', e);
      addToast('Error', 'Could not delete skill.', 'error');
      throw e;
    }
  };

  const addCourse = async (data: { course_name: string; provider: string; skill_name: string; completion_date: string; duration_hours: number; certificate_url?: string; description?: string }) => {
    try {
      await api.addCompletedCourse(data);
      await fetchAllData();
      addToast('Course Logged', `Logged "${data.course_name}" into your digital twin evidence history.`);
    } catch (e) {
      console.error('Failed to add course:', e);
      addToast('Error', 'Could not add course.', 'error');
      throw e;
    }
  };

  const deleteCourse = async (id: number) => {
    try {
      await api.deleteCompletedCourse(id);
      await fetchAllData();
      addToast('Course Removed', 'Completed course removed from your history.');
    } catch (e) {
      console.error('Failed to delete course:', e);
      addToast('Error', 'Could not delete course.', 'error');
      throw e;
    }
  };

  const addInterest = async (data: { resource_id?: number; resource_name: string; skill_name: string; difficulty: string; duration_minutes: number; provider: string; notes?: string }) => {
    try {
      await api.addInterestedResource(data);
      await fetchAllData();
      addToast('Course Bookmarked', `Saved "${data.resource_name}" to your interested resources.`);
    } catch (e) {
      console.error('Failed to add interest:', e);
      addToast('Error', 'Could not save bookmark.', 'error');
      throw e;
    }
  };

  const deleteInterest = async (id: number) => {
    try {
      await api.deleteInterestedResource(id);
      await fetchAllData();
      addToast('Bookmark Removed', 'Resource removed from bookmarks.');
    } catch (e) {
      console.error('Failed to delete interest:', e);
      addToast('Error', 'Could not delete bookmark.', 'error');
      throw e;
    }
  };

  return (
    <LearnerContext.Provider
      value={{
        user,
        profile,
        skills,
        courses,
        interests,
        loading,
        error,
        isAuthenticated: !!user || !!getStoredToken(),
        dataRevision,
        login,
        register,
        loginDemo,
        logout,
        refetchProfile: fetchAllData,
        refetchAll: fetchAllData,
        updateProfile,
        uploadAvatar,
        removeAvatar,
        addSkill,
        deleteSkill,
        addCourse,
        deleteCourse,
        addInterest,
        deleteInterest,
        addToast
      }}
    >
      {children}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </LearnerContext.Provider>
  );
};

export const useLearner = () => {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
};
