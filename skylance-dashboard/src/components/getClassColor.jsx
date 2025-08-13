const getClassColor = (cls) => {
  switch (cls) {
    case "Economy":
      return "text-green-800";
    case "PremiumEconomy":
      return "text-violet-800";
    case "First":
      return "text-pink-800";
    default:
      return "text-gray-800";
  }
};

export default getClassColor;
