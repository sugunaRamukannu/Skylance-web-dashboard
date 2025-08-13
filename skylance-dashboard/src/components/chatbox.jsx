import { useState } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState("");
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingOversales, setLoadingOversales] = useState(false);

  const authToken = localStorage.getItem("authToken");

  const fetchFlights = async () => {
    setLoadingFlights(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Oversales/available-flights`,
        {
          method: "GET",
          headers: {
            "Session-Token": authToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error(await res.text());

      const result = await res.json();
      const flightData = result?.data || [];

      setFlights(flightData);

      if (flightData.length === 0) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "No flights available at the moment." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error fetching flights: ${err.message}` },
      ]);
    } finally {
      setLoadingFlights(false);
    }
  };

  const calculateOversales = async (code) => {
    setLoadingOversales(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Oversales/calculate/${code}`,
        {
          method: "GET",
          headers: {
            "Session-Token": authToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();

      if (!data) throw new Error("No data returned from server.");

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: (
            <div>
              <strong style={{ color: "#007bff" }}>
                Flight {data.flightNumber || "N/A"}
              </strong>
              <div style={{ marginTop: "4px" }}>
                <span style={{ fontWeight: "bold", color: "#28a745" }}>
                  Show probability:
                </span>{" "}
                {data.showPercentage != null
                  ? data.showPercentage.toFixed(2)
                  : "N/A"}
                %
              </div>
              <div>
                <span style={{ fontWeight: "bold", color: "#dc3545" }}>
                  Recommend oversale:
                </span>{" "}
                {data.recommendOversale ?? "N/A"} tickets
              </div>
              <div>
                <span style={{ fontWeight: "bold", color: "#6f42c1" }}>
                  Reason:
                </span>{" "}
                {data.rationale || "N/A"}
              </div>
            </div>
          ),
        },
        {
          sender: "bot",
          text: "You can now start again by selecting a new option below.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `Error calculating oversales: ${err.message}` },
      ]);
    } finally {
      setStep(1);
      setLoadingOversales(false);
    }
  };

  const handleOptionSelect = (option) => {
    if (!option) return;

    setMessages((prev) => [...prev, { sender: "user", text: option }]);

    if (option === "Calculate Oversales Ticket") {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Fetching available flights..." },
      ]);
      fetchFlights();
      setStep(2);
    }
  };

  const handleFlightSelect = (flightId) => {
    if (!flightId) return;

    setSelectedFlight(flightId);
    const selected = flights.find((f) => f.id === Number(flightId));

    if (!selected) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Selected flight not found." },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: `Flight ${selected.code} - ${selected.seatCapacity} seats`,
      },
    ]);

    setStep(3);
    calculateOversales(selected.code);
  };

  return (
    <div>
      <div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full text-white cursor-pointer shadow-xl hover:from-blue-600 hover:to-cyan-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments size={24} />
      </div>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 font-semibold">
            Chat Assistant
          </div>

          <div className="flex-1 p-4 overflow-y-auto h-80">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white ml-auto"
                    : "bg-gray-200 text-black mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="border-t p-3">
            {step === 1 && (
              <select
                className="w-full border rounded p-2"
                onChange={(e) => handleOptionSelect(e.target.value)}
                value=""
              >
                <option value="">Select an option</option>
                <option value="Calculate Oversales Ticket">
                  Calculate Oversales Ticket
                </option>
              </select>
            )}

            {step === 2 && (
              <>
                {loadingFlights ? (
                  <div className="text-sm text-gray-500">
                    Loading available flights...
                  </div>
                ) : flights.length > 0 ? (
                  <select
                    className="w-full border rounded p-2"
                    onChange={(e) => handleFlightSelect(e.target.value)}
                    value=""
                  >
                    <option value="">Select Flight</option>
                    {flights.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.code} - {f.seatCapacity} seats
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-500">
                    No flights available.
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <div className="text-sm text-gray-500">
                {loadingOversales
                  ? `Calculating oversales for ${selectedFlight}...`
                  : "Processing completed."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
