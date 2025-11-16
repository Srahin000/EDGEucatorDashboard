import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // In development mode without backend, use localStorage
      if (import.meta.env.DEV) {
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = existingUsers.find((u: any) => u.email === formData.email);
        
        if (!user) {
          setError('Invalid email or password');
          setIsLoading(false);
          return;
        }

        // Create mock session
        const sessionId = `session-${Date.now()}`;
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to dashboard
        navigate('/');
        return;
      }

      // Try API call (for production or when backend is available)
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Redirect to dashboard
      navigate('/');
    } catch (error: any) {
      // If API fails and we're in dev mode, try localStorage fallback
      if (import.meta.env.DEV) {
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = existingUsers.find((u: any) => u.email === formData.email);
        
        if (!user) {
          setError('Invalid email or password');
          setIsLoading(false);
          return;
        }

        const sessionId = `session-${Date.now()}`;
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('currentUser', JSON.stringify(user));

        navigate('/');
        return;
      }

      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 border-l-4 border-primary-blue">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-primary-blue text-white rounded-button font-semibold hover:bg-primary-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-card hover:shadow-card-hover flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-blue font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

