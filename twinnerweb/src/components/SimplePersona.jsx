import React, { useState } from "react";
import { useUrlState } from "../hooks/useUrlState";
import { createAgent } from "../api/playai";
import { createInstantVoiceClone } from "../api/playht";
import TwinView from "./TwinInterface";
import { useLocalStorage } from "usehooks-ts";

const SimplePersona = () => {
  const [personaDescription, setPersonaDescription] = useLocalStorage(
    "personaDescription",
    ""
  );
  const [agentId, setAgentId] = useUrlState("", "agentId");
  const [voiceId, setVoiceId] = useUrlState("", "voiceId");
  const [file, setFile] = useState(null);

  const handleSubmitPersonaDescription = async () => {
    console.log("Persona Description submitted:", personaDescription);
    try {
      const agent = await createAgent({
        displayName: "voicecapturebot",
        greeting: "Hello, I'm a voice capture bot. Please talk to me.",
        prompt: personaDescription,
        voice: voiceId,
        description: personaDescription,
      });
      setAgentId(agent.id);
    } catch (error) {
      console.error("Failed to create agent:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadVoice = async () => {
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64DataUrl = reader.result;
        const voiceClone = await createInstantVoiceClone(base64DataUrl, {
          voice_name: "UploadedVoice",
        });
        setVoiceId(voiceClone.id);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Failed to upload voice:", error);
    }
  };

  const isSubmitDisabled = !personaDescription || !voiceId;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="container mx-auto px-4">
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Upload Voice</h2>
          <div className="mb-4">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300"
            onClick={handleUploadVoice}
          >
            Upload
          </button>
          {voiceId && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700">
                Voice ID: {voiceId}
              </p>
            </div>
          )}
        </section>
        <section className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">Persona Description</h2>
          <div className="mb-4">
            <label
              htmlFor="personaDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Persona Description
            </label>
            <textarea
              id="personaDescription"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={personaDescription}
              onChange={(e) => setPersonaDescription(e.target.value)}
              placeholder="Describe your persona..."
            />
          </div>
          <button
            className={`bg-teal-500 text-white px-4 py-2 rounded-md transition duration-300 ${
              isSubmitDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-teal-600"
            }`}
            onClick={handleSubmitPersonaDescription}
            disabled={isSubmitDisabled}
          >
            Submit
          </button>
        </section>
        <TwinView agentId={agentId} />
      </main>
    </div>
  );
};

export default SimplePersona;
