export interface ArtifactAnalysis {
  name: string;
  era: string;
  origin: string;
  material: string;
  description: string;
  significance: string;
  confidenceScore: number;
}

export type AppState = 'idle' | 'scanning' | 'analyzing' | 'result' | 'error';
