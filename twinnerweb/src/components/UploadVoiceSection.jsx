import React, { useState } from "react";
import { createInstantVoiceClone } from "../api/playht";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * UploadVoiceSection component handles the voice upload functionality.
 * @param {Object} props - The component props.
 * @param {Function} props.setVoiceId - Function to set the voice ID.
 * @param {string} props.voiceId - The current voice ID.
 */
const UploadVoiceSection = ({ setVoiceId, voiceId }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadVoice = async () => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64DataUrl = reader.result;
        const voiceClone = await createInstantVoiceClone(base64DataUrl, {
          voice_name: "UploadedVoice",
        });
        setVoiceId(voiceClone.id);
      } catch (error) {
        console.error("Failed to upload voice:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <h2 className="text-2xl font-semibold mb-4">Upload Voice</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label
            htmlFor="voiceUpload"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Limitation: MP3 and less than 4MB
          </label>
          <Input
            id="voiceUpload"
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <Button onClick={handleUploadVoice}>Upload</Button>
        {voiceId && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">
              Voice ID: {voiceId}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UploadVoiceSection;
