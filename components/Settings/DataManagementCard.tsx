'use client';

import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export const DataManagementCard: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleClearData = (type: string) => {
    setShowConfirm(null);
    // In a real app, this would actually delete data
    showToast(`Cleared ${type} of data successfully! (This is a demo - no actual data was deleted)`, 'success');
  };

  const actions = [
    { id: 'day', label: 'Clear Last Day of Data', description: 'Remove all conversation data from the last 24 hours' },
    { id: 'week', label: 'Clear Last Week of Data', description: 'Remove all conversation data from the last 7 days' },
    { id: 'all', label: 'Clear All Data', description: 'Permanently delete all stored conversation data and insights', danger: true },
  ];

  return (
    <>
      <div className="bg-pastel-orange rounded-xl p-6 shadow-lg border-2 border-orange-200/50 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-accent-red/10 rounded-lg">
            <Trash2 className="w-6 h-6 text-accent-red" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Data Management</h2>
        </div>
        
        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="p-5 border-2 border-gray-200 rounded-xl bg-gray-50 hover:border-gray-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className={`font-bold mb-2 ${action.danger ? 'text-red-600' : 'text-gray-900'}`}>
                    {action.label}
                  </h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
                <button
                  onClick={() => setShowConfirm(action.id)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                    action.danger
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  <Trash2 className="w-4 h-4 inline mr-1.5" />
                  Clear
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-5 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-yellow-900 mb-2">Warning</h3>
              <p className="text-sm text-yellow-800 leading-relaxed">
                Clearing data is permanent and cannot be undone. This will remove all insights 
                and conversation history for the selected time period.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-accent-red/30">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Confirm Action</h3>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Are you sure you want to {actions.find(a => a.id === showConfirm)?.label.toLowerCase()}? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleClearData(showConfirm)}
                className="flex-1 px-4 py-3 bg-accent-red text-white rounded-xl font-semibold hover:bg-accent-red/90 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-4 py-3 rounded-lg shadow-lg ${
              toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            } animate-in slide-in-from-right`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
};

