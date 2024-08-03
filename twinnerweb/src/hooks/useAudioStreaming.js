import { useRef, useEffect, useCallback, useState } from 'react';
import useSpeechSocket from './useSpeechSocket'; // Adjust the import path as necessary

/**
 * Custom hook to handle audio streaming for a given agent.
 * @param {string} agentId - The ID of the agent.
 */
function useAudioStreaming(agentId) {
    const audioContextRef = useRef(null);
    const mediaSourceRef = useRef(null);
    const sourceBufferRef = useRef(null);
    const audioElementRef = useRef(null);
    const arrayBufferListRef = useRef([]);

    const handleAudioStream = useCallback((arrayBuffer) => {
        // Push the received arrayBuffer to the list
        arrayBufferListRef.current.push(arrayBuffer);
    }, []);

    const sendAudioBlob = useSpeechSocket(agentId, handleAudioStream);

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext ||
            window.webkitAudioContext)();
        mediaSourceRef.current = new MediaSource();
        mediaSourceRef.current.addEventListener("sourceopen", () => {
            const sourceBuffer = mediaSourceRef.current.addSourceBuffer("audio/mpeg");
            sourceBufferRef.current = sourceBuffer;
        });

        const audioElement = document.createElement("audio");
        audioElement.src = URL.createObjectURL(mediaSourceRef.current);
        audioElementRef.current = audioElement;
        const sourceNode =
            audioContextRef.current.createMediaElementSource(audioElement);
        sourceNode.connect(audioContextRef.current.destination);
        audioElement.play();
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (sourceBufferRef.current && !sourceBufferRef.current.updating) {
                const arrayBuffer = arrayBufferListRef.current.shift();
                if (arrayBuffer) {
                    sourceBufferRef.current.appendBuffer(arrayBuffer);
                }
            }
        }, 5); // Check every 5ms

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const setupMediaRecorder = async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    channelCount: 1,
                    echoCancellation: true,
                    autoGainControl: true,
                    noiseSuppression: true,
                },
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = async (event) => {
                if (event.data.size > 0) {
                    console.log("sending data", event.data.size);
                    await sendAudioBlob(event.data);
                }
            };
            mediaRecorder.start(500); // Collect 100ms chunks of audio
        };

        setupMediaRecorder();
    }, [sendAudioBlob]);
}

export default useAudioStreaming;
