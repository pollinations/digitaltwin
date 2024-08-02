import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Lock, Unlock } from "lucide-react";
import "./App.css";
import SimplePersona from "./components/SimplePersona";
import { decryptSecrets } from "./api/decryptSecrets";

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

export function useSecrets() {
  const [password, setPassword] = useLocalStorage("encryptionPassword", "");
  return decryptSecrets(password);
}

function SecretForm({ handleSubmit, error }) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
      <h1 className="text-3xl font-bold text-center text-navy-900 mb-6">
        Secure Access
      </h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Encryption Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              placeholder="Enter password"
              required
            />
            <Lock
              className="absolute right-3 top-2.5 text-gray-400"
              size={20}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-600 transition duration-300 flex items-center justify-center"
        >
          <Unlock className="mr-2" size={20} />
          Unlock
        </button>
      </form>
    </div>
  );
}

export default App;
