import React, { useState } from 'react';
import { analyzeArtifact } from './analysisService';

function AnalysisComponent() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartAnalysis = async () => {
    setLoading(true);
    try {
      // Example data to send
      const dataToAnalyze = { type: "image_scan", ref: "artifact_001" };
      
      const response = await analyzeArtifact(dataToAnalyze);
      setResult(response.message || "Analysis Complete!");
      console.log("Vertex AI Feedback:", response);
    } catch (err) {
      alert("Failed to reach analysis service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleStartAnalysis} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze with Vertex AI"}
      </button>
      {result && <div className="result-box">{result}</div>}
    </div>
  );
}

export default AnalysisComponent;
