import React, { useState } from "react";
import { Mic, Upload, ChevronRight, Send } from "lucide-react";

const TwinnerApp = () => {
  const [twitterUsername, setTwitterUsername] = useState("");
  const [personaDescription, setPersonaDescription] = useState("");
  const [voiceOption, setVoiceOption] = useState("");
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const handleGenerate = () => {
    console.log("Generating AI Twin...");
    // Add generation logic here
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setConversation([...conversation, { type: "user", text: message }]);
      // Here you would typically send the message to your AI backend
      // and get a response. For now, we'll just echo the message.
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          { type: "ai", text: `You said: ${message}` },
        ]);
      }, 1000);
      setMessage("");
    }
  };

  const handleSubmitTwitterUsername = () => {
    console.log("Twitter Username submitted:", twitterUsername);
    // Add submission logic here
  };

  const handleSubmitPersonaDescription = () => {
    console.log("Persona Description submitted:", personaDescription);
    // Add submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-navy-900 mb-2">Twinner</h1>
        <p className="text-xl text-gray-600">
          Create an AI twin based on your Twitter personality and voice
        </p>
      </header>

      <main className="container mx-auto px-4">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How it works:</h2>
          <div className="flex justify-between items-center text-teal-600">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                1
              </div>
              <p>Enter username</p>
            </div>
            <ChevronRight className="text-gray-400" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                2
              </div>
              <p>Persona description</p>
            </div>
            <ChevronRight className="text-gray-400" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                3
              </div>
              <p>Voice sample</p>
            </div>
            <ChevronRight className="text-gray-400" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                4
              </div>
              <p>Interact with twin</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              1. Twitter Information
            </h2>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Twitter Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={twitterUsername}
                onChange={(e) => setTwitterUsername(e.target.value)}
                placeholder="@yourusername"
              />
            </div>
            <button
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300"
              onClick={handleSubmitTwitterUsername}
            >
              Submit
            </button>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              2. Persona Description
            </h2>
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
              className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300"
              onClick={handleSubmitPersonaDescription}
            >
              Submit
            </button>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">3. Voice Sample</h2>
            <p className="mb-4">Choose one option:</p>
            <div className="flex flex-col space-y-4">
              <button
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  voiceOption === "record"
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setVoiceOption("record")}
              >
                <Mic className="mr-2" size={20} />
                Record Voice
              </button>
              <button
                className={`flex items-center justify-center px-4 py-2 border rounded-md ${
                  voiceOption === "upload"
                    ? "bg-teal-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setVoiceOption("upload")}
              >
                <Upload className="mr-2" size={20} />
                Upload Voice File
              </button>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">
              4. Interact with Your Twin
            </h2>
            <div className="h-64 overflow-y-auto mb-4 border border-gray-200 rounded p-2">
              {conversation.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 ${
                    msg.type === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      msg.type === "user" ? "bg-teal-100" : "bg-gray-200"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
              />
              <button
                className="bg-teal-500 text-white px-4 py-2 rounded-r-md hover:bg-teal-600 transition duration-300"
                onClick={handleSendMessage}
              >
                <Send size={20} />
              </button>
            </div>
          </section>
        </div>

        <button
          className="w-full bg-coral-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-coral-600 transition duration-300 mb-10"
          onClick={handleGenerate}
        >
          Generate My AI Twin
        </button>
      </main>

      <footer className="text-center py-4 text-sm text-gray-600">
        © 2024 Twinner - Create Your AI Twin
      </footer>
    </div>
  );
};

export default TwinnerApp;
