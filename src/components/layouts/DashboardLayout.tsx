
import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../dashboard/Dashboard';
import EventRequest from '../dashboard/EventRequest';
import ResourceRequest from '../dashboard/ResourceRequest';
import FundAnalysis from '../dashboard/FundAnalysis';
import RequestStatus from '../dashboard/RequestStatus';
import Report from '../dashboard/Report';
import Collaboration from '../dashboard/Collaboration';
import ChangePassword from '../dashboard/ChangePassword';
import ResourceAvailability from '../dashboard/ResourceAvailability';
import CancelEvent from '../dashboard/CancelEvent';
import AdminEventRequests from '../admin/AdminEventRequests';
import AdminResourceRequests from '../admin/AdminResourceRequests';
import AdminEventSchedule from '../admin/AdminEventSchedule';
import AdminChangePassword from '../admin/AdminChangePassword';
import AdminCancelEvents from '../admin/AdminCancelEvents';
import AdminFundRequests from '../admin/AdminFundRequests';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin as checkIsAdmin, isFaculty as checkIsFaculty, checkLocalAdmin, checkLocalFaculty } from '@/utils/admin-utils';

// Lazy load UserManagement component
const UserManagement = lazy(() => import('../admin/UserManagement'));

type DashboardLayoutProps = {
  isAdminView?: boolean;
  isFacultyView?: boolean;
};

const DashboardLayout = ({ isAdminView = false, isFacultyView = false }: DashboardLayoutProps) => {
  const { tab } = useParams<{ tab: string }>();
  const [activeTab, setActiveTab] = useState(
    isAdminView ? 'admin-dashboard' : 
    isFacultyView ? 'faculty-dashboard' : 
    'dashboard'
  );
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'faculty' | 'user'>('user');

  useEffect(() => {
    if (user) {
      if (checkIsAdmin(user.email)) {
        setUserRole('admin');
      } else if (checkIsFaculty(user.email)) {
        setUserRole('faculty');
      } else {
        setUserRole('user');
      }
    } else {
      if (checkLocalAdmin()) {
        setUserRole('admin');
      } else if (checkLocalFaculty()) {
        setUserRole('faculty');
      } else {
        setUserRole('user');
      }
    }
  }, [user]);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
  };

  const renderContent = () => {
    if (isAdminView) {
      if (userRole === 'admin') {
        switch (activeTab) {
          case 'admin-dashboard':
            return <AdminEventSchedule />;
          case 'resource-request':
            return <AdminResourceRequests />;
          case 'change-password':
            return <AdminChangePassword />;
          case 'cancel-event':
            return <AdminCancelEvents />;
          case 'user-management':
            return (
              <Suspense fallback={<div className="p-4">Loading user management...</div>}>
                <UserManagement />
              </Suspense>
            );
          default:
            return <AdminEventSchedule />;
        }
      } else {
        return <Dashboard />;
      }
    } else if (isFacultyView) {
      switch (activeTab) {
        case 'faculty-dashboard':
          return <AdminEventSchedule />;
        case 'event-request':
          return <AdminEventRequests />;
        case 'fund-request':
          return <AdminFundRequests />;
        case 'change-password':
          return <AdminChangePassword />;
        case 'cancel-event':
          return <AdminCancelEvents />;
        default:
          return <AdminEventSchedule />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard':
          return <Dashboard />;
        case 'event-request':
          return <EventRequest />;
        case 'resource-request':
          return <ResourceRequest />;
        case 'fund-analysis':
          return <FundAnalysis />;
        case 'request-status':
          return <RequestStatus />;
        case 'report':
          return <Report />;
        case 'collaboration':
          return <Collaboration />;
        case 'change-password':
          return <ChangePassword />;
        case 'resource-availability':
          return <ResourceAvailability />;
        case 'cancel-event':
          return <CancelEvent />;
        default:
          return <Dashboard />;
      }
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeItem={activeTab} 
        onMenuItemClick={handleMenuItemClick} 
        isAdminView={isAdminView}
        isFacultyView={isFacultyView}
      />
      <Header />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;
