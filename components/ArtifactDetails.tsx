import React from 'react';
import { ArtifactAnalysis } from '../types';
import { MapPin, Clock, Box, Info, ShieldCheck, RefreshCw } from 'lucide-react';

interface ArtifactDetailsProps {
  analysis: ArtifactAnalysis;
  imageUrl: string;
  onReset: () => void;
}

export const ArtifactDetails: React.FC<ArtifactDetailsProps> = ({ analysis, imageUrl, onReset }) => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 flex flex-col md:flex-row">
      
      {/* Image Section */}
      <div className="w-full md:w-2/5 bg-black relative">
        <img 
          src={imageUrl} 
          alt={analysis.name} 
          className="w-full h-64 md:h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent md:bg-gradient-to-r"></div>
        
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div className="bg-stone-950/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-stone-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-medium text-stone-300">
              Confidence: <span className="text-amber-500">{analysis.confidenceScore}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-stone-100 mb-2">{analysis.name}</h2>
            <div className="flex flex-wrap gap-3 text-sm text-stone-400">
              <span className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1 rounded-md">
                <Clock className="w-4 h-4 text-amber-600" />
                {analysis.era}
              </span>
              <span className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1 rounded-md">
                <MapPin className="w-4 h-4 text-amber-600" />
                {analysis.origin}
              </span>
              <span className="flex items-center gap-1.5 bg-stone-800 px-2.5 py-1 rounded-md">
                <Box className="w-4 h-4 text-amber-600" />
                {analysis.material}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex-grow">
          <section>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" /> Description
            </h3>
            <p className="text-stone-300 leading-relaxed text-sm md:text-base">
              {analysis.description}
            </p>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Historical Significance
            </h3>
            <p className="text-stone-300 leading-relaxed text-sm md:text-base">
              {analysis.significance}
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Scan Another Artifact
          </button>
        </div>
      </div>
    </div>
  );
};
