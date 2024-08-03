import React, { useState } from "react";
import useAudioStreaming from "../hooks/useAudioStreaming"; // Adjust the import path as necessary

const TwinView = ({ agentId }) => {
  useAudioStreaming(agentId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      Twin View {agentId}
    </div>
  );
};

const TwinInterface = ({ agentId }) => {
  const [isAudioContextAllowed, setIsAudioContextAllowed] = useState(false);

  const handleAllowAudioContext = () => {
    setIsAudioContextAllowed(true);
  };

  return (
    <div>
      <br />
      <br />
      {isAudioContextAllowed ? (
        <TwinView agentId={agentId} />
      ) : (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          onClick={handleAllowAudioContext}
        >
          Chat with voice.
        </button>
      )}
    </div>
  );
};

export default TwinInterface;
