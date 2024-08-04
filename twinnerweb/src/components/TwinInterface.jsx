import React, { useState } from "react";
import useAudioStreaming from "../hooks/useAudioStreaming"; // Adjust the import path as necessary
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TwinView = ({ agentId }) => {
  useAudioStreaming(agentId);

  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold">Twin View {agentId}</h2>
      </CardHeader>
      <CardContent>
        <p>Audio streaming is active for agent {agentId}.</p>
      </CardContent>
    </Card>
  );
};

const TwinInterface = ({ agentId }) => {
  const [isAudioContextAllowed, setIsAudioContextAllowed] = useState(false);

  const handleAllowAudioContext = () => {
    setIsAudioContextAllowed(true);
  };

  return (
    <div className="p-6">
      {isAudioContextAllowed ? (
        <TwinView agentId={agentId} />
      ) : (
        <Button onClick={handleAllowAudioContext}>Chat with voice</Button>
      )}
    </div>
  );
};

export default TwinInterface;
