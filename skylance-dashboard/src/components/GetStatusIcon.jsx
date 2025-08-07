import { CheckCircle, XCircle, Clock } from "lucide-react";

const getStatusIcon = (status) => {
  switch (status) {
    case "Confirmed":
      return <CheckCircle className="w-4 h-4" />;
    case "Pending":
      return <Clock className="w-4 h-4" />;
    case "Cancelled":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

export default getStatusIcon;
