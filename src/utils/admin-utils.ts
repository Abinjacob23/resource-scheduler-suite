
import { User } from '@supabase/supabase-js';

/**
 * Checks if a user is a faculty member based on their email
 * @param email User email to check
 * @returns Boolean indicating if the user is a faculty member
 */
export const isFaculty = (email?: string | null): boolean => {
  if (!email) return checkLocalFaculty();
  // Faculty emails start with 'hod@'
  return email.startsWith('hod@');
};

/**
 * Checks if a user is an admin based on their email
 * @param email User email to check
 * @returns Boolean indicating if the user is an admin
 */
export const isAdmin = (email?: string | null): boolean => {
  if (!email) return checkLocalAdmin();
  // Admin emails start with 'admin@'
  return email.startsWith('admin@');
};

/**
 * Checks if there's a faculty session in localStorage
 * @returns Boolean indicating if a valid faculty session exists
 */
export const checkLocalFaculty = (): boolean => {
  const facultySession = localStorage.getItem('facultySession');
  return !!facultySession && facultySession.startsWith('hod@');
};

/**
 * Checks if there's an admin session in localStorage
 * @returns Boolean indicating if a valid admin session exists
 */
export const checkLocalAdmin = (): boolean => {
  const adminSession = localStorage.getItem('adminSession');
  return !!adminSession && adminSession.startsWith('admin@');
};

/**
 * Checks if a user has faculty access either via email or localStorage
 * @param user Current user object
 * @returns Boolean indicating if the user has faculty access
 */
export const hasFacultyAccess = (user: User | null): boolean => {
  if (!user) return checkLocalFaculty();
  return isFaculty(user.email);
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
