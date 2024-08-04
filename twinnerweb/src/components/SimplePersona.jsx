import React, { useState, useEffect } from "react";
import { useUrlState } from "../hooks/useUrlState";
import { createAgent } from "../api/playai";
import TwinView from "./TwinInterface";
import { useLocalStorage } from "usehooks-ts";
import { useTwitterData } from "../hooks/useTwitterData";
import UploadVoiceSection from "./UploadVoiceSection";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const SimplePersona = () => {
  const [personaDescription, setPersonaDescription] = useLocalStorage(
    "personaDescription",
    ""
  );
  const [agentName, setAgentName] = useLocalStorage("agentName", "");
  const [agentId, setAgentId] = useUrlState("", "agentId");
  const [voiceId, setVoiceId] = useUrlState("", "voiceId");
  const [twitterUsername, setTwitterUsername] = useUrlState("", "twitter");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="container mx-auto px-4">
        <UploadVoiceSection setVoiceId={setVoiceId} voiceId={voiceId} />
        <TwitterUsernameSection
          twitterUsername={twitterUsername}
          setTwitterUsername={setTwitterUsername}
          setAgentName={setAgentName}
          setPersonaDescription={setPersonaDescription}
        />
        <PersonaDescriptionSection
          agentName={agentName}
          setAgentName={setAgentName}
          personaDescription={personaDescription}
          setPersonaDescription={setPersonaDescription}
          setAgentId={setAgentId}
          voiceId={voiceId}
          isSubmitDisabled={!personaDescription || !voiceId || !agentName}
        />
        {agentId && <TwinView agentId={agentId} />}
      </main>
    </div>
  );
};

const TwitterUsernameSection = ({
  twitterUsername,
  setTwitterUsername,
  setAgentName,
  setPersonaDescription,
}) => {
  const [submittedUsername, setSubmittedUsername] = useState("");
  const data = useTwitterData(submittedUsername);

  useEffect(() => {
    if (data) {
      setAgentName(data.user.name);
      setPersonaDescription(convertTwitterToPersona(data));
    }
  }, [data, setAgentName, setPersonaDescription]);

  const handleTwitterSubmit = () => {
    setSubmittedUsername(twitterUsername);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold mb-4">Twitter Username</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label
            htmlFor="twitterUsername"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Twitter Username
          </label>
          <Input
            id="twitterUsername"
            value={twitterUsername}
            onChange={(e) => setTwitterUsername(e.target.value)}
            placeholder="Enter Twitter username..."
          />
        </div>
        <Button onClick={handleTwitterSubmit}>Submit</Button>
      </CardContent>
    </Card>
  );
};

const PersonaDescriptionSection = ({
  agentName,
  setAgentName,
  personaDescription,
  setPersonaDescription,
  setAgentId,
  voiceId,
  isSubmitDisabled,
}) => {
  const handleSubmitPersonaDescription = async () => {
    console.log("Persona Description submitted:", personaDescription);
    try {
      const agent = await createAgent({
        displayName: agentName,
        greeting: `Hello I am ${agentName}. Let's chat.`,
        prompt: personaDescription,
        voice: voiceId,
        description: personaDescription.slice(0, 400),
      });
      setAgentId(agent.id);
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold mb-4">Persona Description</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label
            htmlFor="agentName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Agent Name
          </label>
          <Input
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter agent name..."
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="personaDescription"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Persona Description
          </label>
          <Textarea
            id="personaDescription"
            value={personaDescription}
            onChange={(e) => setPersonaDescription(e.target.value)}
            placeholder="Describe your persona..."
            rows="10"
          />
        </div>
        <Button
          onClick={handleSubmitPersonaDescription}
          disabled={isSubmitDisabled}
          className={isSubmitDisabled ? "opacity-50 cursor-not-allowed" : ""}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

export default SimplePersona;
/**
 * Converts Twitter data to a persona description in markdown format.
 * @param {Object} data - The Twitter data object.
 * @returns {string} - The persona description in markdown format.
 */
function convertTwitterToPersona(data) {
  const { user, tweets } = data;
  const tweetTexts = tweets.map((tweet) => `- ${tweet.text}`).join("\n");

  return `
You are a helpful and fun chatbot that is based on the following twitter profile.
Try to impersonate the user taking into account all the information provided. 
Be imaginative.
Try to keep the user engaged so follow up your responses with questions.

## Name
${user.name}
*${user.username}*

## Location
${user.location}

## Description
${user.description}

## Tweets
${tweetTexts}
  `;
}
