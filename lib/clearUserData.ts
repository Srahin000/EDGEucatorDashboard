/**
 * Utility function to clear all user data from localStorage
 * This removes all users, children, sessions, and related data
 */
export function clearAllUserData(): void {
  const itemsToClear = [
    'mockUsers',
    'mockChildren',
    'sessionId',
    'currentUser',
    'childDataSchemas',
    'parentGoals',
    'parents',
    'profiles',
    'sessions'
  ];

  itemsToClear.forEach(item => {
    try {
      localStorage.removeItem(item);
    } catch (error) {
      console.error(`Error clearing ${item}:`, error);
    }
  });

  console.log('All user data cleared');
}


