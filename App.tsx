import React, { useState } from 'react';
import { CameraScanner } from './components/CameraScanner';
import { ArtifactDetails } from './components/ArtifactDetails';
import { LoadingOverlay } from './components/LoadingOverlay';
import { analyzeArtifact } from './services/geminiService';
import { AppState, ArtifactAnalysis } from './types';
import { Compass, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('idle');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ArtifactAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCapture = async (base64Image: string, mimeType: string) => {
    setCapturedImage(base64Image);
    setAppState('analyzing');
    setErrorMessage(null);

    try {
      const result = await analyzeArtifact(base64Image, mimeType);
      setAnalysisResult(result);
      setAppState('result');
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setAppState('idle');
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-900 selection:text-amber-100">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="bg-amber-600 p-1.5 rounded-lg">
              <Compass className="w-6 h-6 text-stone-950" />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-wide text-stone-100">
              Chrono<span className="text-amber-500">Micra</span>
            </h1>
          </div>
          <div className="text-xs font-medium text-stone-500 uppercase tracking-widest hidden sm:block">
            Vertex AI Scanner
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Intro Text (Only in idle state) */}
        {appState === 'idle' && (
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-stone-100">
              Uncover the Past
            </h2>
            <p className="text-stone-400 text-lg">
              Point your camera at an artifact or upload an image to instantly identify its origin, era, and historical significance using advanced AI analysis.
            </p>
          </div>
        )}

        {/* Dynamic Content Area */}
        <div className="flex justify-center items-center min-h-[60vh]">
          {appState === 'idle' && (
            <CameraScanner onCapture={handleCapture} />
          )}

          {appState === 'analyzing' && (
            <LoadingOverlay />
          )}

          {appState === 'result' && analysisResult && capturedImage && (
            <ArtifactDetails 
              analysis={analysisResult} 
              imageUrl={capturedImage} 
              onReset={handleReset} 
            />
          )}

          {appState === 'error' && (
            <div className="bg-stone-900 border border-red-900/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-stone-200 mb-2">Analysis Failed</h3>
              <p className="text-stone-400 mb-6">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
