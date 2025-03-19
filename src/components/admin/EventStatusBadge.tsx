
import { Badge } from "@/components/ui/badge";

type EventStatusBadgeProps = {
  status: string;
};

/**
 * Component to display the event status with appropriate styling
 */
const EventStatusBadge = ({ status }: EventStatusBadgeProps) => {
  switch(status) {
    case 'approved':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    default:
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
  }
};

export default EventStatusBadge;
