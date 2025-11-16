import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildContext } from '@/contexts/ChildContext';
import { DateRange } from '@/types';
import { Calendar, LogOut, User } from 'lucide-react';
import { ChalkText } from './ChalkText';

export const Header: React.FC = () => {
  const { selectedChild, setSelectedChild, dateRange, setDateRange, children } = useChildContext();
  const navigate = useNavigate();
  const [parentName, setParentName] = useState<string>('');

  useEffect(() => {
    // In development mode, check localStorage first
    if (import.meta.env.DEV) {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        try {
          const user = JSON.parse(currentUser);
          setParentName(user.name);
          return;
        } catch (e) {
          // Fall through to API call
        }
      }
    }

    // Fetch parent info from API
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.parent) {
          setParentName(data.parent.name);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      // In development mode, clear localStorage
      if (import.meta.env.DEV) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('currentUser');
        navigate('/login');
        return;
      }

      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear localStorage and redirect
      if (import.meta.env.DEV) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('currentUser');
      }
      navigate('/login');
    }
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const child = children.find(c => c.id === e.target.value);
    setSelectedChild(child || null);
  };

  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value as DateRange);
  };

  return (
    <header className="bg-blackboard-dark border-b-4 border-chalk-yellow/30 px-4 py-4 shadow-lg relative overflow-hidden"
      style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.03) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <img
            src="/images/Logo.png"
            alt="Child Insights Dashboard Logo"
            width={60}
            height={60}
            className="object-contain"
          />
          <div className="w-1 h-8 bg-gradient-to-b from-chalk-yellow to-chalk-pink rounded-full shadow-lg"></div>
          <h1 className="text-2xl font-bold">
            <ChalkText color="yellow" speed={25}>Child Insights Dashboard</ChalkText>
          </h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 md:items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="child-select" className="text-sm font-handwriting font-semibold text-chalk-white">
              Child:
            </label>
            <select
              id="child-select"
              value={selectedChild?.id || ''}
              onChange={handleChildChange}
              className="px-3 py-2 border-2 border-chalk-yellow/40 rounded-button bg-lightgreen text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-chalk-yellow focus:border-chalk-yellow transition-all shadow-md"
            >
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} (Age {child.age})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-chalk-yellow" />
            <label htmlFor="date-range-select" className="text-sm font-handwriting font-semibold text-chalk-white">
              Period:
            </label>
            <select
              id="date-range-select"
              value={dateRange}
              onChange={handleDateRangeChange}
              className="px-3 py-2 border-2 border-chalk-yellow/40 rounded-button bg-lightgreen text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-chalk-yellow focus:border-chalk-yellow transition-all shadow-md"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div className="flex items-center gap-3 border-l-2 border-chalk-yellow/30 pl-3">
            {parentName && (
              <div className="flex items-center gap-2 text-chalk-white">
                <User className="w-4 h-4" />
                <span className="text-sm font-handwriting">{parentName}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-chalk-red/20 hover:bg-chalk-red/30 text-chalk-white rounded-button transition-all border border-chalk-red/40"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-handwriting">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

