'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries, getConversationsForChild } from '@/data/mockData';
import { CheckCircle2, AlertCircle, Info, Heart, Brain, Users, TrendingUp } from 'lucide-react';

export type HealthStatus = 'healthy' | 'normal' | 'concern';

interface HealthStatusCardProps {
  status: HealthStatus;
  title: string;
  description: string;
  icon: typeof CheckCircle2;
  color: string;
  bgColor: string;
}

const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ status, title, description, icon: Icon, color, bgColor }) => {
  return (
    <div 
      className="rounded-xl p-6 shadow-lg border-2 transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
      style={{ 
        backgroundColor: bgColor,
        borderColor: color,
      }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: color + '20' }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-700">{description}</p>
        </div>
      </div>
    </div>
  );
};

export const OverallHealthSummary: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const conversations = getConversationsForChild(selectedChild.id, dateRange);
  const latestSummary = summaries[0];

  if (!latestSummary || conversations.length === 0) {
    return (
      <div className="bg-pastel-blue rounded-xl p-8 shadow-lg border-2 border-blue-200/50">
        <div className="text-center">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No interaction data available yet.</p>
        </div>
      </div>
    );
  }

  // Calculate overall health status
  const calculateHealthStatus = (): HealthStatus => {
    let concernScore = 0;
    let healthyScore = 0;

    // Check stress level
    if (latestSummary.stressLevel === 'high') concernScore += 3;
    else if (latestSummary.stressLevel === 'medium') concernScore += 1;
    else healthyScore += 2;

    // Check resilience
    if (latestSummary.resilienceLevel === 'high') healthyScore += 2;
    else if (latestSummary.resilienceLevel === 'low') concernScore += 2;

    // Check curiosity
    if (latestSummary.curiosityLevel === 'low') concernScore += 1;
    else if (latestSummary.curiosityLevel === 'high') healthyScore += 1;

    // Check conversations for warning signals
    conversations.forEach(conv => {
      if (conv.flags.needsAttention) concernScore += 2;
      if (conv.wellbeingInsight.warningSignals.length > 0) concernScore += 1;
      if (conv.flags.breakthrough) healthyScore += 1;
      if (conv.wellbeingInsight.resilienceSignals.length > 0) healthyScore += 1;
    });

    // Determine status
    if (concernScore >= 4) return 'concern';
    if (healthyScore >= 3 && concernScore === 0) return 'healthy';
    return 'normal';
  };

  const healthStatus = calculateHealthStatus();

  const statusConfig = {
    healthy: {
      title: 'Healthy',
      description: 'Your child is showing positive engagement, good emotional regulation, and healthy curiosity levels.',
      icon: CheckCircle2,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    normal: {
      title: 'Normal',
      description: 'Your child\'s interactions are within normal ranges. Continue monitoring and supporting their growth.',
      icon: Info,
      color: '#3B82F6',
      bgColor: '#DBEAFE',
    },
    concern: {
      title: 'Concern',
      description: 'Some patterns may need attention. Consider checking in with your child about their feelings and experiences.',
      icon: AlertCircle,
      color: '#EF4444',
      bgColor: '#FEE2E2',
    },
  };

  const config = statusConfig[healthStatus];
  const StatusIcon = config.icon;

  // Calculate metrics
  const totalConversations = conversations.length;
  const avgSentiment = latestSummary.avgSentiment;
  const totalMinutes = latestSummary.totalMinutes;
  const breakthroughCount = conversations.filter(c => c.flags.breakthrough).length;

  return (
    <div className="space-y-6">
      {/* Overall Health Status Card */}
      <div 
        className="rounded-xl p-8 shadow-xl border-2 transition-all duration-200"
        style={{ 
          backgroundColor: config.bgColor,
          borderColor: config.color,
        }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="p-4 rounded-xl"
            style={{ backgroundColor: config.color + '30' }}
          >
            <StatusIcon className="w-8 h-8" style={{ color: config.color }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Overall Status: {config.title}</h2>
            <p className="text-gray-700">{config.description}</p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <MessageSquare className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalConversations}</p>
            <p className="text-xs text-gray-600">Conversations</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <Heart className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{Math.round(avgSentiment)}</p>
            <p className="text-xs text-gray-600">Sentiment</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <TrendingUp className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{breakthroughCount}</p>
            <p className="text-xs text-gray-600">Breakthroughs</p>
          </div>
          <div className="bg-white/60 rounded-lg p-4 text-center">
            <Brain className="w-5 h-5 text-gray-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{totalMinutes}</p>
            <p className="text-xs text-gray-600">Minutes</p>
          </div>
        </div>
      </div>

      {/* Detailed Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthStatusCard
          status={latestSummary.stressLevel === 'low' ? 'healthy' : latestSummary.stressLevel === 'high' ? 'concern' : 'normal'}
          title="Stress Level"
          description={latestSummary.stressLevel === 'low' 
            ? 'Low stress - your child seems relaxed and comfortable.'
            : latestSummary.stressLevel === 'high'
            ? 'High stress detected - consider checking in with your child.'
            : 'Moderate stress levels - normal for their age.'}
          icon={AlertCircle}
          color={latestSummary.stressLevel === 'low' ? '#10B981' : latestSummary.stressLevel === 'high' ? '#EF4444' : '#FBBF24'}
          bgColor={latestSummary.stressLevel === 'low' ? '#D1FAE5' : latestSummary.stressLevel === 'high' ? '#FEE2E2' : '#FEF3C7'}
        />

        <HealthStatusCard
          status={latestSummary.resilienceLevel === 'high' ? 'healthy' : latestSummary.resilienceLevel === 'low' ? 'concern' : 'normal'}
          title="Resilience"
          description={latestSummary.resilienceLevel === 'high'
            ? 'Strong resilience - your child shows good coping skills.'
            : latestSummary.resilienceLevel === 'low'
            ? 'Lower resilience - may need extra support.'
            : 'Normal resilience levels.'}
          icon={Heart}
          color={latestSummary.resilienceLevel === 'high' ? '#10B981' : latestSummary.resilienceLevel === 'low' ? '#EF4444' : '#3B82F6'}
          bgColor={latestSummary.resilienceLevel === 'high' ? '#D1FAE5' : latestSummary.resilienceLevel === 'low' ? '#FEE2E2' : '#DBEAFE'}
        />

        <HealthStatusCard
          status={latestSummary.curiosityLevel === 'high' ? 'healthy' : latestSummary.curiosityLevel === 'low' ? 'concern' : 'normal'}
          title="Curiosity"
          description={latestSummary.curiosityLevel === 'high'
            ? 'High curiosity - your child is actively exploring and learning.'
            : latestSummary.curiosityLevel === 'low'
            ? 'Lower curiosity - may need encouragement to explore.'
            : 'Normal curiosity levels.'}
          icon={Brain}
          color={latestSummary.curiosityLevel === 'high' ? '#10B981' : latestSummary.curiosityLevel === 'low' ? '#EF4444' : '#3B82F6'}
          bgColor={latestSummary.curiosityLevel === 'high' ? '#D1FAE5' : latestSummary.curiosityLevel === 'low' ? '#FEE2E2' : '#DBEAFE'}
        />
      </div>
    </div>
  );
};

