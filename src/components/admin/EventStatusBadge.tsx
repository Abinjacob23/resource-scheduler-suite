
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
      return <Badge className="bg-green-800/30 text-green-400 hover:bg-green-800/30">Approved</Badge>;
    case 'rejected':
      return <Badge className="bg-red-800/30 text-red-400 hover:bg-red-800/30">Rejected</Badge>;
    default:
      return <Badge className="bg-amber-800/30 text-amber-400 hover:bg-amber-800/30">Pending</Badge>;
  }
};

export default EventStatusBadge;
