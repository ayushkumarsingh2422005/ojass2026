// Simple auth context/utilities
export const isAuthenticated = (): boolean => {
  if (typeof document === 'undefined') return false;
  // Check if admin_token cookie exists
  return document.cookie.split(';').some(c => c.trim().startsWith('admin_token='));
};

export const clearAuth = () => {
  if (typeof document !== 'undefined') {
    // Clear the admin_token cookie
    document.cookie = 'admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

