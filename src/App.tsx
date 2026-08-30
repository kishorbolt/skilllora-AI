import { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import type {
  OverallSkillDNA, SkillNode, Recommendation,
  Roadmap, SkillDNA, AnalyticsData
} from './types';
import { LearnerProvider, useLearner } from './context/LearnerContext';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { SkillDetailDrawer } from './components/drawers/SkillDetailDrawer';
import { WhyRecommendedDrawer } from './components/drawers/WhyRecommendedDrawer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingWizard } from './pages/OnboardingWizard';
import { DashboardOverview } from './pages/DashboardOverview';
import { SkillDNADashboard } from './pages/SkillDNADashboard';
import { SkillGraphPage } from './pages/SkillGraphPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AdaptiveAssessmentPage } from './pages/AdaptiveAssessmentPage';
import { AIMentorPage } from './pages/AIMentorPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CareerSimulatorPage } from './pages/CareerSimulatorPage';
import { ProgressAnalyticsPage } from './pages/ProgressAnalyticsPage';
import { LearnerProfilePage } from './pages/LearnerProfilePage';

export function AppContent() {
  const { profile, dataRevision, refetchAll } = useLearner();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showLanding, setShowLanding] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Core Intelligence Data State
  const [skillDNA, setSkillDNA] = useState<OverallSkillDNA | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [skillNodes, setSkillNodes] = useState<SkillNode[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Drawers
  const [selectedSkillDrawer, setSelectedSkillDrawer] = useState<SkillDNA | null>(null);
  const [selectedRecWhyDrawer, setSelectedRecWhyDrawer] = useState<Recommendation | null>(null);

  const loadIntelligenceData = useCallback(async () => {
    try {
      const [dna, rm, recs, graph, ana] = await Promise.all([
        api.getSkillDNA().catch(() => null),
        api.getRoadmap().catch(() => null),
        api.getRecommendations().catch(() => []),
        api.getSkillGraph().catch(() => ({ nodes: [] })),
        api.getAnalytics().catch(() => null)
      ]);

      if (dna) setSkillDNA(dna);
      if (rm) setRoadmap(rm);
      if (recs) setRecommendations(recs);
      if (graph) setSkillNodes(graph.nodes);
      if (ana) setAnalytics(ana);
    } catch (e) {
      console.warn("Backend loading notice. Please check the backend connection.", e);
    }
  }, []);

  useEffect(() => {
    loadIntelligenceData();
  }, [loadIntelligenceData, dataRevision]);

  const handleToggleRoadmapItem = async (itemId: number) => {
    try {
      await api.toggleRoadmapItem(itemId);
      loadIntelligenceData();
      refetchAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleFullDataRefresh = async () => {
    await Promise.all([
      loadIntelligenceData(),
      refetchAll()
    ]);
  };

  const handleTabChange = (t: string) => {
    if (t === 'landing') {
      setShowLanding(true);
    } else {
      setActiveTab(t);
    }
  };

  if (showLanding) {
    return (
      <LandingPage
        onStartOnboarding={() => { setShowLanding(false); setShowOnboarding(true); }}
        onExploreDemo={() => { setShowLanding(false); setActiveTab('overview'); handleFullDataRefresh(); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header profile={profile} activeTab={activeTab} setActiveTab={handleTabChange} />


        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && (
            <DashboardOverview onNavigate={setActiveTab} />
          )}

          {activeTab === 'skill-dna' && (
            <SkillDNADashboard
              skillDNA={skillDNA}
              onOpenSkillDrawer={(s) => setSelectedSkillDrawer(s)}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'skill-gaps' && (
            <div>
              <SkillGapPage onNavigate={setActiveTab} />
              <div className="mt-8">
                <SkillGraphPage nodes={skillNodes} />
              </div>
            </div>
          )}

          {activeTab === 'roadmap' && (
            <RoadmapPage
              roadmap={roadmap}
              onToggleItem={handleToggleRoadmapItem}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPage
              recommendations={recommendations}
              onOpenWhyDrawer={(r) => setSelectedRecWhyDrawer(r)}
              onRefresh={handleFullDataRefresh}
            />
          )}

          {activeTab === 'assessments' && (
            <AdaptiveAssessmentPage onAssessmentComplete={handleFullDataRefresh} />
          )}

          {activeTab === 'projects' && (
            <ProjectsPage
              onProjectEvaluated={handleFullDataRefresh}
            />
          )}

          {activeTab === 'career-simulator' && (
            <CareerSimulatorPage />
          )}

          {activeTab === 'mentor' && (
            <AIMentorPage />
          )}

          {activeTab === 'progress' && (
            <ProgressAnalyticsPage analytics={analytics} />
          )}

          {activeTab === 'profile' && (
            <LearnerProfilePage profile={profile} onProfileUpdated={handleFullDataRefresh} />
          )}
        </main>
      </div>

      {/* Flagship Skill DNA Detail Drawer */}
      {selectedSkillDrawer && (
        <SkillDetailDrawer
          skill={selectedSkillDrawer}
          onClose={() => setSelectedSkillDrawer(null)}
          onTakeAction={() => {
            setSelectedSkillDrawer(null);
            setActiveTab('assessments');
          }}
        />
      )}

      {/* Recommendation Explainability Drawer */}
      {selectedRecWhyDrawer && (
        <WhyRecommendedDrawer
          recommendation={selectedRecWhyDrawer}
          onClose={() => setSelectedRecWhyDrawer(null)}
        />
      )}

      {/* Onboarding Wizard Modal */}
      {showOnboarding && (
        <OnboardingWizard
          onComplete={async () => {
            setShowOnboarding(false);
            setActiveTab('overview');
            await handleFullDataRefresh();
          }}
          onCancel={() => setShowOnboarding(false)}
        />
      )}
    </div>
  );
}

export function App() {
  return (
    <LearnerProvider>
      <AppContent />
    </LearnerProvider>
  );
}

export default App;
