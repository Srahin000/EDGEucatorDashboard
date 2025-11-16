'use client';

import React, { useState } from 'react';
import { AuthGuard } from '@/components/Auth/AuthGuard';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Section } from '@/components/Layout/Sidebar';
import { OverviewSection } from '@/components/Sections/OverviewSection';
import { InteractionsSection } from '@/components/Sections/InteractionsSection';
import { GrowthSection } from '@/components/Sections/GrowthSection';
import { GoalsSection } from '@/components/Sections/GoalsSection';
import { EngagementSection } from '@/components/Sections/EngagementSection';
import { SettingsSection } from '@/components/Sections/SettingsSection';

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('overview');

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

