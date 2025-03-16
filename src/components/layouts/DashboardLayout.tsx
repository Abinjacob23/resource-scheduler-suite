
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

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleMenuItemClick = (itemId: string) => {
    setActiveTab(itemId);
  };

  const renderContent = () => {
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
  };

  return (
    <div className="dashboard-container">
      <Sidebar activeItem={activeTab} onMenuItemClick={handleMenuItemClick} />
      <Header />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardLayout;
