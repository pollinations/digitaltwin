import { getSecrets } from '@/components/SecretInput';
import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to handle WebSocket connection for speech.
 * @param {string} agentId - The agent ID for the WebSocket connection.
 * @param {function} onAudioStream - Callback function to handle audio stream data.
 * @returns {function} sendAudioBlob - Function to send audio blobs over WebSocket.
 */
const useSpeechSocket = (agentId, onAudioStream) => {
    const wsRef = useRef(null);

    useEffect(() => {
        if (agentId) {
            const apiKey = getSecrets().PLAYAI_SECRET_KEY;
            const ws = new WebSocket(`wss://api.play.ai/v1/talk/${agentId}`);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket connected!");
                ws.send(JSON.stringify({
                    type: "setup",
                    apiKey,
                    inputEncoding: "media-container",
                    // inputSampleRate: 16000,
                    outputFormat: "mp3",
                }));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Received message:", message);
                if (message.type === "audioStream") {
                    const binaryData = Uint8Array.from(atob(message.data), c => c.charCodeAt(0));
                    const arrayBuffer = binaryData.buffer;
                    onAudioStream(arrayBuffer);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

            ws.onclose = () => {
                console.log("WebSocket connection closed");
            };

            return () => {
                ws.close();
            };
        }
    }, [agentId, onAudioStream]);

    const sendAudioBlob = useCallback(async (audioBlob) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            const base64Data = await blobToBase64(audioBlob);
            wsRef.current.send(JSON.stringify({ type: 'audioIn', data: base64Data }));
        }
    }, []);

    const blobToBase64 = (blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve) => {
            reader.onloadend = () => {
                resolve(reader.result.split(",")[1]);
            }
        });
    };

    return sendAudioBlob;
};

export default useSpeechSocket;