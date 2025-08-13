const getMembershipColor = (tier) => {
  switch (tier) {
    case "Regular":
      return "text-blue-800";
    case "Bronze":
      return "text-yellow-800";
    case "Silver":
      return "text-gray-800";
    case "Gold":
      return "text-amber-800";
    case "Platinum":
      return "text-blue-800";
    default:
      return "text-orange-800";
  }
};
export default getMembershipColor;
