import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Filter } from "lucide-react";

const FlightShowPredictionPie = () => {
  const [flightData, setFlightData] = useState({});
  const [selectedFlight, setSelectedFlight] = useState("");

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/FlightPrediction/show-percentage`,
          {
            method: "GET",
            headers: {
              "Session-Token": authToken,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const mappedData = {};
          result.data.forEach(({ flight, predictedShowPercentage }) => {
            const show = predictedShowPercentage;
            const noShow = 100 - predictedShowPercentage;
            mappedData[flight] = { show, noShow };
          });

          setFlightData(mappedData);

          // Set default flight selection
          if (result.data.length > 0) {
            setSelectedFlight(result.data[0].flight);
          }
        } else {
          console.error("Invalid response from API.");
        }
      } catch (error) {
        console.error("Error fetching flight data:", error);
      }
    };

    fetchFlightData();
  }, []);

  if (!selectedFlight || !flightData[selectedFlight]) return null;

  const { show, noShow } = flightData[selectedFlight];
  const total = show + noShow;
  const showRate = ((show / total) * 100).toFixed(0);

  const data = [
    { name: "Show", value: show },
    { name: "No Show", value: noShow },
  ];

  return (
    <div className="bg-gradient-to-br from-purple-200 via-purple-300 to-purple-400 rounded-2xl p-6 shadow-md">
      {/* Title and Flight Filter */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedFlight} Prediction
        </h2>
        <div className="flex items-center gap-2">
          <Filter className="text-gray-700" size={16} />
          <select
            value={selectedFlight}
            onChange={(e) => setSelectedFlight(e.target.value)}
            className="bg-white text-gray-800 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            {Object.keys(flightData).map((flight) => (
              <option key={flight} value={flight}>
                {flight}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pie Chart with Gradient Fills */}
      <div className="relative w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              {/* Purple gradient */}
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>

              {/* Pink gradient */}
              <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F9A8D4" />
              </linearGradient>
            </defs>

            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    index === 0 ? "url(#purpleGradient)" : "url(#pinkGradient)"
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Prediction Label */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{showRate}%</p>
            <p className="text-sm text-gray-600">Show Prediction</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: "linear-gradient(45deg, #7C3AED, #A78BFA)" }}
          ></span>
          Show
        </div>
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: "linear-gradient(45deg, #EC4899, #F9A8D4)" }}
          ></span>
          No Show
        </div>
      </div>
    </div>
  );
};

export default FlightShowPredictionPie;
