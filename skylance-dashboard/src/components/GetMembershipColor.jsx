const getMembershipColor = (tier) => {
  switch (tier) {
    case "Platinum":
      return "text-purple-600 font-bold";
    case "Gold":
      return "text-yellow-600 font-bold";
    case "Silver":
      return "text-gray-500 font-bold";
    case "Bronze":
      return "text-orange-600 font-bold";
    default:
      return "text-gray-400";
  }
};

export default getMembershipColor;
