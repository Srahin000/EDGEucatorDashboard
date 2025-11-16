'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar, Section } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-blackboard-dark">
      <Header />
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-lightgreen min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

