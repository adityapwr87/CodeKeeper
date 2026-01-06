import React, { useState, useRef, useEffect } from "react";

const AudioRecorder = ({ currentAudioUrl, onAudioStop }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(currentAudioUrl); // Show existing URL if editing
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Timer Logic (Max 60s)
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const localUrl = URL.createObjectURL(audioBlob);
        setPreviewUrl(localUrl);

        // PASS DATA TO PARENT (Add/Edit Form)
        onAudioStop(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setPreviewUrl(null); // Clear old audio when starting new
    } catch (err) {
      console.error("Mic Error:", err);
      alert("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleDelete = () => {
    setPreviewUrl(null);
    onAudioStop(null); // Tell parent to remove the file
  };

  return (
    <div className="mt-2">
      {/* 1. Preview Mode (If audio exists) */}
      {previewUrl ? (
        <div className="flex items-center gap-3 bg-gray-800 p-2 rounded text-white">
          <audio controls src={previewUrl} className="h-8 w-60" />
          <button
            type="button"
            onClick={handleDelete}
            style={{ color: "#ff6b6b", fontWeight: "bold", marginLeft: "10px" }}
          >
            ❌ Remove
          </button>
        </div>
      ) : (
        /* 2. Record Mode */
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className="btn-gradient"
            style={{
              background: isRecording ? "red" : "",
              minWidth: "140px",
            }}
          >
            {isRecording ? `Stop (${60 - timer}s)` : "🎤 Record Voice"}
          </button>
          <span className="text-gray-400 text-xs">Max 60 sec</span>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
