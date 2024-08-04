import { Lock, Unlock } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { decryptSecrets } from "../api/decryptSecrets";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function getSecrets() {
  const encryptedPassword = localStorage.getItem("encryptionPassword") || "";
  const password = JSON.parse(encryptedPassword);
  console.log("password", password);
  return decryptSecrets(password);
}

export function SecretForm({ handleSubmit, error }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Encryption Password
        </label>
        <div className="relative">
          <Input
            type="password"
            id="password"
            name="password"
            className="w-full pr-10"
            placeholder="Enter password"
            required
          />
          <Lock className="absolute right-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      <Button
        type="submit"
        className="w-full bg-teal-500 text-white hover:bg-teal-600 transition duration-300 flex items-center justify-center"
      >
        <Unlock className="mr-2" size={20} />
        Unlock
      </Button>
    </form>
  );
}
