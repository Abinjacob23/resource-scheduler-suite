
import { mockEventRequests, mockResourceRequests } from '@/utils/mock-data';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RequestStatus = () => {
  const [activeTab, setActiveTab] = useState("events");

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Status of Requests</h1>
      
      <div className="dashboard-card">
        <Tabs defaultValue="events" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="events">Event Requests</TabsTrigger>
            <TabsTrigger value="resources">Resource Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left p-3 font-medium text-muted-foreground">Association</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Event Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockEventRequests.map((event, index) => (
                    <tr key={index} className="border-b border-muted/30 hover:bg-muted/10 transition-colors">
                      <td className="p-3">{event.association}</td>
                      <td className="p-3">{event.eventName}</td>
                      <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'approved' ? 'bg-green-100 text-green-800' :
                          event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left p-3 font-medium text-muted-foreground">Event Name</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Resources</th>
                    <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockResourceRequests.map((request, index) => (
                    <tr key={index} className="border-b border-muted/30 hover:bg-muted/10 transition-colors">
                      <td className="p-3">{request.eventName}</td>
                      <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {request.resources.map((resource, rIndex) => (
                            <span key={rIndex} className="inline-block px-2 py-1 bg-muted rounded-full text-xs">
                              {resource.replace('-', ' ')}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RequestStatus;
