import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, Plus, X } from 'lucide-react';
import { Child } from '@/types';

export const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [children, setChildren] = useState<Array<{ name: string; age: string }>>([
    { name: '', age: '' }
  ]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Validate children
    const validChildren = children.filter(child => child.name.trim() && child.age.trim());
    if (validChildren.length === 0) {
      setError('Please add at least one child');
      return;
    }

    // Validate child ages
    for (const child of validChildren) {
      const age = parseInt(child.age);
      if (isNaN(age) || age < 0 || age > 18) {
        setError(`Invalid age for ${child.name || 'child'}. Age must be between 0 and 18.`);
        return;
      }
    }

    setIsLoading(true);

    try {
      // In development mode without backend, use localStorage
      if (import.meta.env.DEV) {
        // Check if user already exists in localStorage
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const userExists = existingUsers.find((u: any) => u.email === formData.email);
        
        if (userExists) {
          setError('Email already registered');
          setIsLoading(false);
          return;
        }

        // Create children
        const childIds: string[] = [];
        const createdChildren: Child[] = validChildren.map((child, index) => {
          const childId = `child-${Date.now()}-${index}`;
          childIds.push(childId);
          return {
            id: childId,
            name: child.name.trim(),
            age: parseInt(child.age),
            avatarColor: ['#3B82F6', '#EC4899', '#10B981', '#FBBF24', '#8B5CF6', '#F97316'][index % 6],
          };
        });

        // Create mock user with children
        const mockUser = {
          id: `parent-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          children: childIds,
        };

        // Save to localStorage
        existingUsers.push(mockUser);
        localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
        
        // Save children to localStorage
        const existingChildren = JSON.parse(localStorage.getItem('mockChildren') || '[]');
        existingChildren.push(...createdChildren);
        localStorage.setItem('mockChildren', JSON.stringify(existingChildren));
        
        // Initialize data schemas for each child
        const { initializeChildrenData } = await import('@/lib/childDataStorage');
        initializeChildrenData(childIds);
        
        // Create mock session
        const sessionId = `session-${Date.now()}`;
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Redirect to dashboard
        navigate('/');
        return;
      }

      // Try API call (for production or when backend is available)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      // Redirect to dashboard
      navigate('/');
    } catch (error: any) {
      // If API fails and we're in dev mode, try localStorage fallback
      if (import.meta.env.DEV) {
        const existingUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const userExists = existingUsers.find((u: any) => u.email === formData.email);
        
        if (userExists) {
          setError('Email already registered');
          setIsLoading(false);
          return;
        }

        // Create children
        const childIds: string[] = [];
        const createdChildren: Child[] = validChildren.map((child, index) => {
          const childId = `child-${Date.now()}-${index}`;
          childIds.push(childId);
          return {
            id: childId,
            name: child.name.trim(),
            age: parseInt(child.age),
            avatarColor: ['#3B82F6', '#EC4899', '#10B981', '#FBBF24', '#8B5CF6', '#F97316'][index % 6],
          };
        });

        const mockUser = {
          id: `parent-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          createdAt: new Date().toISOString(),
          children: childIds,
        };

        existingUsers.push(mockUser);
        localStorage.setItem('mockUsers', JSON.stringify(existingUsers));
        
        // Save children
        const existingChildren = JSON.parse(localStorage.getItem('mockChildren') || '[]');
        existingChildren.push(...createdChildren);
        localStorage.setItem('mockChildren', JSON.stringify(existingChildren));
        
        // Initialize data schemas for each child
        const { initializeChildrenData } = await import('@/lib/childDataStorage');
        initializeChildrenData(childIds);
        
        const sessionId = `session-${Date.now()}`;
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));

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
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 border-l-4 border-accent-green max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to get started with Child Insights</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                placeholder="Your name"
              />
            </div>
          </div>

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
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          {/* Children Registration Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">
                Add Children
              </label>
              <button
                type="button"
                onClick={() => setChildren([...children, { name: '', age: '' }])}
                className="flex items-center gap-1 text-sm text-accent-green hover:text-accent-green/80 font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Child
              </button>
            </div>
            
            <div className="space-y-3">
              {children.map((child, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Child's name"
                      value={child.name}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].name = e.target.value;
                        setChildren(newChildren);
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      placeholder="Age"
                      min="0"
                      max="18"
                      value={child.age}
                      onChange={(e) => {
                        const newChildren = [...children];
                        newChildren[index].age = e.target.value;
                        setChildren(newChildren);
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all text-black"
                    />
                  </div>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newChildren = children.filter((_, i) => i !== index);
                        setChildren(newChildren);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-button transition-all"
                      title="Remove child"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Add at least one child to get started. You can add more later.
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-accent-green text-white rounded-button font-semibold hover:bg-accent-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-card hover:shadow-card-hover flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-blue font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

