'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp,
  Target,
  Sparkles,
  Shield,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';

export type Section = 
  | 'overview' 
  | 'interactions'
  | 'growth' 
  | 'goals' 
  | 'engagement' 
  | 'privacy';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const sections: Array<{ id: Section; label: string; icon: typeof LayoutDashboard; color: string }> = [
  { id: 'overview', label: 'Insights Overview', icon: LayoutDashboard, color: '#2563EB' },
  { id: 'interactions', label: 'Interactions', icon: MessageSquare, color: '#8B5CF6' },
  { id: 'growth', label: 'Learning & Growth', icon: TrendingUp, color: '#8B5CF6' },
  { id: 'goals', label: 'Parent Goals', icon: Target, color: '#F97316' },
  { id: 'engagement', label: 'Engagement Tools', icon: Sparkles, color: '#FBBF24' },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield, color: '#10B981' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSectionChange,
  isMobileOpen,
  onMobileToggle,
}) => {
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={onMobileToggle}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blackboard-dark rounded-lg shadow-lg border-2 border-chalk-yellow/30 text-chalk-white"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static
          top-0 left-0
          h-full md:h-auto
          w-64 md:w-64
          bg-blackboard-dark border-r-2 border-chalk-yellow/20
          z-40
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          pt-16 md:pt-0
          shadow-2xl
        `}
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      >
        <nav className="p-4">
          <ul className="space-y-2">
            {sections.map(({ id, label, icon: Icon, color }) => (
              <li key={id}>
                <button
                  onClick={() => {
                    onSectionChange(id);
                    onMobileToggle(); // Close mobile menu on selection
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-button
                    transition-all duration-200 font-handwriting text-lg
                    ${
                      activeSection === id
                        ? 'shadow-lg border-l-4 bg-black/20'
                        : 'hover:bg-black/10 hover:shadow-md border-l-4 border-transparent hover:border-chalk-yellow/30'
                    }
                  `}
                  style={activeSection === id ? {
                    color: '#FFF9C4',
                    borderLeftColor: '#FFF9C4',
                    textShadow: '0 0 8px rgba(255, 249, 196, 0.3)',
                  } : {
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: activeSection === id ? '#FFF9C4' : 'rgba(255, 255, 255, 0.6)' }} />
                  <span>{label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onMobileToggle}
        />
      )}
    </>
  );
};

