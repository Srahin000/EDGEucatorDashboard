import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In development mode, check localStorage first
        if (import.meta.env.DEV) {
          const sessionId = localStorage.getItem('sessionId');
          const currentUser = localStorage.getItem('currentUser');
          
          if (sessionId && currentUser) {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          }
        }

        // Add timeout to prevent infinite loading
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const response = await fetch('/api/auth/me', { 
          credentials: 'include',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Check if we're in development mode and API is not available
          // In dev, allow access if API fails (for Vite without backend)
          if (import.meta.env.DEV && (response.status === 404 || response.status === 0)) {
            console.warn('API not available, checking localStorage');
            const sessionId = localStorage.getItem('sessionId');
            if (sessionId) {
              setIsAuthenticated(true);
            } else {
              navigate('/login');
            }
          } else {
            navigate('/login');
          }
        }
      } catch (error: any) {
        // Network error or timeout - in dev mode, check localStorage
        if (import.meta.env.DEV) {
          const sessionId = localStorage.getItem('sessionId');
          if (sessionId) {
            setIsAuthenticated(true);
          } else {
            navigate('/login');
          }
        } else {
          navigate('/login');
        }
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

