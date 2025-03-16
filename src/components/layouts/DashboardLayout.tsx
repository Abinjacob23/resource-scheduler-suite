
import { useState } from 'react';
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

type DashboardLayoutProps = {
  isAdmin?: boolean;
};

const DashboardLayout = ({ isAdmin = false }: DashboardLayoutProps) => {
  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin-dashboard' : 'dashboard');

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
  };

  const renderContent = () => {
    if (isAdmin) {
      switch (activeTab) {
        case 'admin-dashboard':
          return <AdminEventSchedule />;
        case 'event-request':
          return <AdminEventRequests />;
        case 'resource-request':
          return <AdminResourceRequests />;
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
      <Sidebar activeItem={activeTab} onMenuItemClick={handleMenuItemClick} isAdmin={isAdmin} />
      <Header />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;
