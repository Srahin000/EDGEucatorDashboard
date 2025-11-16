'use client';

import React from 'react';
import { Shield, Database, Lock } from 'lucide-react';

export const PrivacyCard: React.FC = () => {
  return (
    <div className="bg-pastel-blue rounded-xl p-6 shadow-lg border-2 border-blue-200/50 hover:shadow-xl transition-all duration-200 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary-blue/10 rounded-lg">
          <Shield className="w-6 h-6 text-primary-blue" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          Privacy & Data Safety
        </h2>
      </div>
      
      <div className="mb-6 p-5 bg-primary-blue/5 rounded-xl border-2 border-primary-blue/30">
        <div className="flex items-start gap-3">
          <div className="text-2xl">✅</div>
          <div>
            <p className="font-bold text-gray-900 mb-2 text-lg">
              All data is processed locally on your device
            </p>
            <p className="text-sm text-gray-700">
              No cloud transmission. No external servers. Your child's conversations stay private and secure.
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="p-5 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-blue-200 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Local-Only Data Storage</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                This system stores all data locally on this device. No conversation data is sent to the cloud.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-green-200 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-green-100 rounded-lg">
              <Database className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Long-Term Insights</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Local storage allows us to show long-term trends and insights over weeks and months 
                while respecting your child's privacy.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-purple-200 transition-colors">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-purple-100 rounded-lg">
              <Lock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">Your Child's Privacy</h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Your child's data never leaves this device. This dashboard only shows insights 
                derived from locally stored data.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4 mt-4 border-t-2 border-gray-200">
          <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <strong className="text-gray-900">Important:</strong> Parents can control what is stored and for how long. 
            All data management controls are available in the section below.
          </p>
        </div>
      </div>
    </div>
  );
};

