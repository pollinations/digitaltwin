import React, { useState } from "react";

const SimplePersona = () => {
  const [personaDescription, setPersonaDescription] = useState("");

  const handleSubmitPersonaDescription = () => {
    console.log("Persona Description submitted:", personaDescription);
    // Add submission logic here
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <main className="container mx-auto px-4">
        <section className="bg-white rounded-lg shadow-md p-6">
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
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition duration-300"
            onClick={handleSubmitPersonaDescription}
          >
            Submit
          </button>
        </section>
      </main>
    </div>
  );
};

export default SimplePersona;
