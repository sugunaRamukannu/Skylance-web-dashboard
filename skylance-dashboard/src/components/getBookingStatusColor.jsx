const getBookingStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-indigo-100 text-indigo-800";
    case "CheckedIn":
      return "bg-cyan-100 text-cyan-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    case "Rebooked":
      return "bg-orange-100 text-orange-800";
    case "NoShow":
      return "bg-fuchsia-100 text-fuchsia-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default getBookingStatusColor;
