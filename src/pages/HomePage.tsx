
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

// Import the images
const logoImage = '/lovable-uploads/66be6198-c1bc-4653-bc07-c3e8608e6d17.png';
const collegeImage = '/lovable-uploads/39e66ef7-1021-4048-be50-2fe92fd82654.png';
const eventImage1 = '/lovable-uploads/095981ce-3e03-4d79-859c-4aace39640f6.png';
const eventImage2 = '/lovable-uploads/e6bbec0f-8c8b-4443-b1db-b228c7da1c86.png';
const eventImage3 = '/lovable-uploads/37f738d5-87cc-401f-b0af-092d14b33aef.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('home');

  const handleLogin = () => {
    navigate('/auth');
  };

  const renderHomeSection = () => (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center items-center bg-[#e84c15] text-white">
      <div className="container px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          EVENT MANAGEMENT SYSTEM
        </h1>
        <p className="text-xl mt-4 max-w-3xl mx-auto">
          A comprehensive platform for managing events, resources, and scheduling
        </p>
      </div>
    </div>
  );

  const renderEventsSection = () => (
    <div className="min-h-screen bg-gray-200 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-2">Events</h2>
        <p className="text-center mb-12">Here is the list of upcoming events which is to be held in upcoming days</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img src={collegeImage} alt="College Building" className="rounded-lg w-full h-auto object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-semibold mb-6">Our Events</h3>
            
            <div className="mb-8">
              <div className="flex items-start">
                <div className="bg-white rounded-lg shadow p-4 mr-4 text-center">
                  <span className="text-3xl font-bold block">22</span>
                  <span>Feb</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">EDGE+ 4.0</h4>
                  <span className="bg-black text-white text-sm px-2 py-1 rounded">CCF LAB</span>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-start">
                <div className="bg-white rounded-lg shadow p-4 mr-4 text-center">
                  <span className="text-3xl font-bold block">27</span>
                  <span>Mar</span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold">ARISE</h4>
                  <span className="bg-black text-white text-sm px-2 py-1 rounded">AUDITORIUM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResourcesSection = () => (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-2">RESOURCES</h2>
        <p className="text-center text-white mb-12">THE LIST OF AVAILABLE RESOURCES IN THE COLLEGE</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative group">
            <img src={eventImage1} alt="CCF Lab" className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">CCF LAB</h3>
            </div>
          </div>
          
          <div className="relative group">
            <img src={eventImage2} alt="Seminar Hall" className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">SEMINAR HALL</h3>
            </div>
          </div>
          
          <div className="relative group">
            <img src={eventImage3} alt="PES Field" className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">PES FIELD</h3>
            </div>
          </div>
          
          <div className="relative group">
            <img src={eventImage2} alt="Auditorium" className="w-full h-64 object-cover rounded-lg" />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4 rounded-b-lg">
              <h3 className="text-white text-xl font-semibold">AUDITORIUM</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="min-h-screen bg-black py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-white mb-12">Contact Us</h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form className="space-y-6">
              <div>
                <input 
                  type="text" 
                  placeholder="Your name..." 
                  className="w-full bg-black border border-gray-700 rounded-md p-4 text-white"
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email Address..." 
                  className="w-full bg-black border border-gray-700 rounded-md p-4 text-white"
                />
              </div>
              <div>
                <textarea 
                  placeholder="Message..." 
                  rows={6}
                  className="w-full bg-black border border-gray-700 rounded-md p-4 text-white"
                ></textarea>
              </div>
              <div className="text-right">
                <Button 
                  className="bg-[#e84c15] hover:bg-[#c13e10] text-white px-8"
                >
                  SEND
                </Button>
              </div>
            </form>
          </div>
          <div className="text-white">
            <h3 className="text-2xl font-semibold mb-6">Our Address</h3>
            <div className="space-y-2">
              <p className="font-bold">FISAT ENGINEERING COLLEGE</p>
              <p>HORMIS NAGAR</p>
              <p>MOOKKANNOOR</p>
              <p>ANGAMALY</p>
              <p>Tel: 0484-2725272</p>
            </div>
            
            <div className="mt-12 h-64 bg-gray-800 rounded-lg">
              {/* Map placeholder - in a real app, integrate Google Maps here */}
              <div className="w-full h-full flex items-center justify-center">
                <p>Map View</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <header className="bg-gray-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              {/* Logo placeholder */}
              <div className="mr-4">
                <div className="w-10 h-10 border-2 border-[#e84c15] flex items-center justify-center">
                  <span className="text-sm">E</span>
                </div>
              </div>
              <h1 className="text-2xl font-bold">EVENT HUB</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button 
                className={`font-medium ${activeSection === 'home' ? 'text-[#e84c15]' : 'text-white'}`}
                onClick={() => setActiveSection('home')}
              >
                HOME
              </button>
              <button 
                className={`font-medium ${activeSection === 'events' ? 'text-[#e84c15]' : 'text-white'}`}
                onClick={() => setActiveSection('events')}
              >
                EVENTS
              </button>
              <button 
                className={`font-medium ${activeSection === 'resources' ? 'text-[#e84c15]' : 'text-white'}`}
                onClick={() => setActiveSection('resources')}
              >
                RESOURCES
              </button>
              <button 
                className={`font-medium ${activeSection === 'contact' ? 'text-[#e84c15]' : 'text-white'}`}
                onClick={() => setActiveSection('contact')}
              >
                CONTACT
              </button>
            </nav>
            
            <Button
              onClick={handleLogin}
              className="bg-transparent hover:bg-[#e84c15] text-white border border-white hover:border-transparent"
            >
              LOGIN
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Conditional rendering based on active section */}
      {activeSection === 'home' && renderHomeSection()}
      {activeSection === 'events' && renderEventsSection()}
      {activeSection === 'resources' && renderResourcesSection()}
      {activeSection === 'contact' && renderContactSection()}
    </div>
  );
};

export default HomePage;
