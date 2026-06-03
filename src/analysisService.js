import { getAuth } from "firebase/auth";

/**
 * Sends data to the scan-processor Cloud Function for Vertex AI analysis.
 * @param {Object} data - The data or image reference you want to analyze.
 */
export const analyzeArtifact = async (data) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("User not authenticated");
    return { error: "Please log in to perform analysis." };
  }

  // Your specific Google Cloud Function URL
  const FUNCTION_URL = "https://scan-processor-k73qbrtqaa-ue.a.run.app";

  try {
    // Get fresh ID token from Firebase to verify identity
    const token = await user.getIdToken();

    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        payload: data,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Cloud Function Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
