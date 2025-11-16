import React, { useState, useEffect } from 'react';
import { OnboardingFlow } from './OnboardingFlow';
import { Child } from '@/types';
import { useChildContext } from '@/contexts/ChildContext';

export const OnboardingWrapper: React.FC = () => {
  const { children, setSelectedChild, refreshChildren, isLoading: contextLoading } = useChildContext();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if profiles exist after context loads
    if (!contextLoading) {
      const checkProfiles = async () => {
        try {
          // Add timeout for API calls
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          // First check if user is authenticated
          const authResponse = await fetch('/api/auth/me', { 
            signal: controller.signal,
            credentials: 'include'
          });
          
          clearTimeout(timeoutId);
          
          if (!authResponse.ok) {
            // In dev mode, if API is not available, skip onboarding check
            if (import.meta.env.DEV && (authResponse.status === 404 || authResponse.status === 0)) {
              setIsChecking(false);
              return;
            }
            setIsChecking(false);
            return; // Not authenticated, AuthGuard will handle redirect
          }

          const responseController = new AbortController();
          const responseTimeout = setTimeout(() => responseController.abort(), 3000);
          
          const response = await fetch('/api/profiles', {
            signal: responseController.signal,
            credentials: 'include'
          });
          
          clearTimeout(responseTimeout);
          
          if (response.ok) {
            const data = await response.json();
            // Only show onboarding if no children exist
            if (!data.children || data.children.length === 0) {
              setShowOnboarding(true);
            }
          } else {
            // If API fails, don't show onboarding (use mock data)
            setIsChecking(false);
          }
        } catch (error) {
          console.error('Error checking profiles:', error);
          // If API fails in dev mode, don't show onboarding (use mock data)
          setIsChecking(false);
        } finally {
          setIsChecking(false);
        }
      };

      checkProfiles();
    }
  }, [contextLoading]);

  const handleOnboardingComplete = async (child: Child) => {
    setShowOnboarding(false);
    await refreshChildren();
    setSelectedChild(child);
  };

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  if (isChecking || contextLoading) {
    return null; // Or a loading spinner
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} onSkip={handleSkip} />;
  }

  return null;
};

