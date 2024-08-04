import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import "./App.css";
import SimplePersona from "./components/SimplePersona";
import { decryptSecrets } from "./api/decryptSecrets";
import { SecretForm } from "./components/SecretInput";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * App component handles the main application logic and UI.
 */
function App() {
  const [password, setPassword] = useLocalStorage("encryptionPassword", "");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <Card className="w-full max-w-md">
          <CardHeader>
            <h2 className="text-2xl font-semibold mb-4">Enter Password</h2>
          </CardHeader>
          <CardContent>
            <SecretForm handleSubmit={handleSubmit} error={error} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="bg-gray-800 rounded-none">
        <CardHeader className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Twinner.me
          </h1>
          <p className="text-xl text-white opacity-90">Your AI twin</p>
        </CardHeader>
      </Card>
      <SimplePersona />
    </div>
  );
}

export default App;
