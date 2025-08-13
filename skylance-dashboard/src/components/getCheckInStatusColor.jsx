// Check-in Status Colors (different set from booking status)
const getCheckInStatusColor = (status) => {
  return status === "Checked In"
    ? "bg-green-200 text-green-900"
    : "bg-red-200 text-red-900";
};

export default getCheckInStatusColor;
