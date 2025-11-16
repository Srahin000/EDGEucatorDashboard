'use client';

import React, { useState } from 'react';

export const ParentalControlsCard: React.FC = () => {
  const [dailyLimit, setDailyLimit] = useState('60');
  const [curfewStart, setCurfewStart] = useState('21:00');
  const [curfewEnd, setCurfewEnd] = useState('07:00');
  const [storeDetailed, setStoreDetailed] = useState(true);

  const handleApply = () => {
    // In a real app, this would save settings
    alert('Settings saved! (This is a demo - no actual settings are stored)');
  };

  return (
    <div className="bg-pastel-mint rounded-xl p-6 shadow-lg border-2 border-teal-200/50 hover:shadow-xl transition-all duration-200 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-accent-green/10 rounded-lg">
          <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Parental Controls</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Daily Usage Time Limit
          </label>
          <select
            value={dailyLimit}
            onChange={(e) => setDailyLimit(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            <option value="30">30 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
          </select>
          <p className="mt-2 text-xs text-gray-600">
            Maximum time the AI avatar can be used per day
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Usage Curfew
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Start (Bedtime)</label>
              <input
                type="time"
                value={curfewStart}
                onChange={(e) => setCurfewStart(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">End (Morning)</label>
              <input
                type="time"
                value={curfewEnd}
                onChange={(e) => setCurfewEnd(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-600">
            No avatar use allowed during this time period
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Store Detailed Conversation Summaries
              </label>
              <p className="text-xs text-gray-600">
                Save full conversation summaries for detailed insights
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={storeDetailed}
                onChange={(e) => setStoreDetailed(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Store Only Aggregated Trends
              </label>
              <p className="text-xs text-gray-600">
                Only save summary statistics, not individual conversation details
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                checked={!storeDetailed}
                onChange={(e) => setStoreDetailed(!e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <button
          onClick={handleApply}
          className="w-full px-6 py-3 bg-primary-blue text-white rounded-xl font-bold hover:bg-primary-blue/90 active:bg-primary-blue/80 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Apply Settings
        </button>
      </div>
    </div>
  );
};

