import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChildProvider } from '@/contexts/ChildContext';
import { OnboardingWrapper } from '@/components/Onboarding/OnboardingWrapper';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Section } from '@/components/Layout/Sidebar';
import { OverviewSection } from '@/components/Sections/OverviewSection';
import { InteractionsSection } from '@/components/Sections/InteractionsSection';
import { GrowthSection } from '@/components/Sections/GrowthSection';
import { GoalsSection } from '@/components/Sections/GoalsSection';
import { EngagementSection } from '@/components/Sections/EngagementSection';
import { SettingsSection } from '@/components/Sections/SettingsSection';
import { LoginForm } from '@/components/Auth/LoginForm';
import { SignupForm } from '@/components/Auth/SignupForm';
import '@/app/globals.css';

function Home() {
  const [activeSection, setActiveSection] = React.useState<Section>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'interactions':
        return <InteractionsSection />;
      case 'growth':
        return <GrowthSection />;
      case 'goals':
        return <GoalsSection />;
      case 'engagement':
        return <EngagementSection />;
      case 'privacy':
        return <SettingsSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <AuthGuard>
      <MainLayout
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderSection()}
      </MainLayout>
    </AuthGuard>
  );
}

function App() {
  return (
    <ChildProvider>
      <OnboardingWrapper />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChildProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

