import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./App.css";
import SimplePersona from "./components/SimplePersona";
import { decryptSecrets } from "./api/decryptSecrets";
import { SecretForm } from "./components/SecretInput";

function App() {
  const [password, setPassword] = useLocalStorage("encryptionPassword", "");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    setPassword(e.target.password.value);
  };

  useEffect(() => {
    if (password) {
      try {
        decryptSecrets(password);
        setError(null);
      } catch (err) {
        setError("Invalid password. Please try again.");
      }
    }
  }, [password]);

  if (!password || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SecretForm handleSubmit={handleSubmit} error={error} />
      </div>
    );
  }

  return (
    <div>
      <header className="bg-teal-500 text-white text-center py-4">
        <h1 className="text-3xl font-bold">Welcome to Twinner.me</h1>
        <p className="text-lg">Create your personalized AI agent</p>
      </header>
      <SimplePersona />
    </div>
  );
}

export default App;
