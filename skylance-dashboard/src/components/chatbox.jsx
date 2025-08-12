import React, { useState } from "react";
import { FaComments } from "react-icons/fa";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([]);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState("");

  const fetchFlights = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/Oversales/available-flights`
    );
    const result = await res.json();

    setFlights(result.data);
  };

  // console.log("as" + code);

  // const calculateOversales = async (code) => {
  //   // console.log("code" + code);
  //   const res = await fetch(
  //     `${import.meta.env.VITE_API_BASE_URL}/Oversales/calculate/${code}`
  //   );
  //   const data = await res.json();
  //   console.log(data);
  //   setMessages((prev) => [...prev, { sender: "bot", text: }]);
  //   console.log("messages", messages);
  // };
  const calculateOversales = async (code) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/Oversales/calculate/${code}`
    );

    if (!res.ok) {
      const text = await res.text();
      setMessages((prev) => [...prev, { sender: "bot", text }]);
      setStep(1);
      return;
    }

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: (
          <div>
            <strong style={{ color: "#007bff" }}>
              Flight {data.flightNumber}
            </strong>
            <div style={{ marginTop: "4px" }}>
              <span style={{ fontWeight: "bold", color: "#28a745" }}>
                Show probability:
              </span>{" "}
              {data.showPercentage.toFixed(2)}%
            </div>
            <div>
              <span style={{ fontWeight: "bold", color: "#dc3545" }}>
                Recommend oversale:
              </span>{" "}
              {data.recommendOversale} tickets
            </div>
            <div>
              <span style={{ fontWeight: "bold", color: "#6f42c1" }}>
                Reason:
              </span>{" "}
              {data.rationale}
            </div>
          </div>
        ),
      },
      {
        sender: "bot",
        text: "You can now start again by selecting a new option below.",
      },
    ]);

    setStep(1);
  };

  const handleOptionSelect = (option) => {
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
    setSelectedFlight(flightId);
    const selected = flights.find((f) => f.id === Number(flightId));
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
      {/* Floating Message Icon */}
      <div
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-cyan-500 p-4 rounded-full text-white cursor-pointer shadow-xl hover:from-blue-600 hover:to-cyan-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaComments size={24} />
      </div>

      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white border rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 font-semibold">
            Chat Assistant
          </div>

          {/* Chat Messages */}
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

          {/* Input Options */}
          <div className="border-t p-3">
            {step === 1 && (
              <select
                className="w-full border rounded p-2"
                onChange={(e) => handleOptionSelect(e.target.value)}
              >
                <option value="">Select an option</option>
                <option value="Calculate Oversales Ticket">
                  Calculate Oversales Ticket
                </option>
              </select>
            )}

            {step === 2 && (
              <select
                className="w-full border rounded p-2"
                onChange={(e) => handleFlightSelect(e.target.value)}
              >
                <option value="">Select Flight</option>
                {flights.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code} - {f.seatCapacity} seats
                  </option>
                ))}
              </select>
            )}

            {step === 3 && (
              <div className="text-sm text-gray-500">
                Calculating oversales for {selectedFlight}...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
