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

  return <SimplePersona />;
}

export default App;
