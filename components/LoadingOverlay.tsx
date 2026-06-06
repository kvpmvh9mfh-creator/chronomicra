import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

const loadingPhrases = [
  "Consulting the archives...",
  "Analyzing material composition...",
  "Cross-referencing historical databases...",
  "Carbon dating visual estimates...",
  "Translating ancient inscriptions...",
  "Identifying cultural markers..."
];

export const LoadingOverlay: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-stone-900 rounded-2xl border border-stone-800 shadow-2xl max-w-md mx-auto w-full">
      <div className="relative w-24 h-24 mb-8">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 border-4 border-stone-800 border-t-amber-500 rounded-full animate-spin"></div>
        {/* Inner pulsing icon */}
        <div className="absolute inset-0 flex items-center justify-center animate-pulse">
          <Search className="w-10 h-10 text-amber-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-serif font-semibold text-stone-200 mb-2">Analyzing Artifact</h3>
      <p className="text-stone-400 text-sm text-center h-6 transition-opacity duration-500">
        {loadingPhrases[phraseIndex]}
      </p>
    </div>
  );
};
