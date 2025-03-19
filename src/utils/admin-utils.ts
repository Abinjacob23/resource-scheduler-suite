
import { User } from '@supabase/supabase-js';

/**
 * Checks if a user is an admin based on their email
 * @param email User email to check
 * @returns Boolean indicating if the user is an admin
 */
export const isAdmin = (email?: string | null): boolean => {
  if (!email) return checkLocalAdmin();
  // List of admin emails
  const adminEmails = ['admin@example.com', 'test@example.com', 'admin@gmail.com'];
  return adminEmails.includes(email);
};

/**
 * Checks if there's an admin session in localStorage
 * @returns Boolean indicating if a valid admin session exists
 */
export const checkLocalAdmin = (): boolean => {
  const adminSession = localStorage.getItem('adminSession');
  return adminSession === 'admin@example.com' || adminSession === 'admin@gmail.com';
};

/**
 * Checks if a user has admin access either via email or localStorage
 * @param user Current user object
 * @returns Boolean indicating if the user has admin access
 */
export const hasAdminAccess = (user: User | null): boolean => {
  if (!user) return checkLocalAdmin();
  return isAdmin(user.email);
};

