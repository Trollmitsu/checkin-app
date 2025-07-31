// src/components/CheckinCamera.jsx
import React, { useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import axios from "axios";

const CheckinCamera = () => {
  const videoRef = useRef();
  const knownDescriptors = useRef([]); // lagrade ansiktsdata

  useEffect(() => {
    const init = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");

      startVideo();
      loadKnownFaces();
    };

    init();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: {} })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((err) => console.error("Kamerafel:", err));
  };

  const loadKnownFaces = async () => {
    // TODO: Hämta lagrade ansikten (ersätt med riktig logik)
    const dummyDescriptor = new Float32Array(128); // för demo
    knownDescriptors.current = [
      new faceapi.LabeledFaceDescriptors("Anna Larsson", [dummyDescriptor])
    ];
  };

  const handleFaceDetection = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (!detections.length) return;

    const faceMatcher = new faceapi.FaceMatcher(knownDescriptors.current, 0.6);

    detections.forEach(async (det) => {
      const match = faceMatcher.findBestMatch(det.descriptor);
      if (match.label !== "unknown") {
        console.log("Incheckad:", match.label);
        await axios.post("http://localhost:8000/api/checkin", {
          name: match.label,
          timestamp: new Date().toISOString(),
        });
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleFaceDetection();
    }, 3000); // checka var 3:e sekund

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <video ref={videoRef} autoPlay muted width="400" height="300" />
    </div>
  );
};

export default CheckinCamera;
