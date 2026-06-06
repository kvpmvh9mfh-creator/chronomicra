import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Camera, Upload, SwitchCamera, Image as ImageIcon } from 'lucide-react';

interface CameraScannerProps {
  onCapture: (base64Image: string, mimeType: string) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setIsCameraActive(true);
      setCameraError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Unable to access camera. Please ensure permissions are granted or use file upload.");
      setIsCameraActive(false);
    }
  }, [facingMode, stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]); // Only re-run when facingMode changes

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Image = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(base64Image, 'image/jpeg');
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        onCapture(base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800">
      {/* Viewfinder Area */}
      <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
        {isCameraActive ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-stone-500 p-6 text-center">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p>{cameraError || "Camera initializing..."}</p>
          </div>
        )}

        {/* Scanner Overlay UI */}
        {isCameraActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-amber-500/50 rounded-lg">
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 rounded-br-lg"></div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-stone-850 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors w-full sm:w-auto"
        >
          <Upload className="w-5 h-5" />
          <span>Upload Image</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />

        <button
          onClick={handleCapture}
          disabled={!isCameraActive}
          className="relative group flex items-center justify-center w-20 h-20 rounded-full bg-stone-800 border-4 border-stone-700 hover:border-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-2 rounded-full bg-amber-600 group-hover:bg-amber-500 transition-colors flex items-center justify-center">
            <Camera className="w-8 h-8 text-stone-950" />
          </div>
        </button>

        <button
          onClick={toggleCamera}
          disabled={!isCameraActive}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors w-full sm:w-auto disabled:opacity-50"
        >
          <SwitchCamera className="w-5 h-5" />
          <span>Switch</span>
        </button>
      </div>

      {/* Hidden canvas for capturing frame */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
