"use client";

import { useState, useEffect } from "react";

interface AnalyzeDocumentsProps {
  onAnalyze: () => Promise<void>;
  loading: boolean;
}

const AnalyzeDocuments: React.FC<AnalyzeDocumentsProps> = ({
  onAnalyze,
  loading,
}) => {
  const [loadingText, setLoadingText] = useState("Retrieving filings...");

  useEffect(() => {
    if (loading) {
      let secondsElapsed = 0;
      const interval = setInterval(() => {
        secondsElapsed += 1;

        if (secondsElapsed <= 2) {
          setLoadingText("Retrieving filings...");
        } else if (secondsElapsed <= 7) {
          setLoadingText("Processing filings...");
        } else {
          setLoadingText("Analyzing filings...");
        }

        if (secondsElapsed >= 15) clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
      <button
        onClick={onAnalyze}
        disabled={loading}
        className={`w-full text-white py-3 px-4 rounded-lg shadow flex items-center justify-center transition-all ${
          loading
            ? "bg-blue-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? (
          <>
            <div className="mr-2 w-5 h-5 border-4 border-t-white border-blue-500 rounded-full animate-spin"></div>
            <span className="animate-pulse">{loadingText}</span>
          </>
        ) : (
          "Analyze Documents"
        )}
      </button>
    </section>
  );
};

export default AnalyzeDocuments;
