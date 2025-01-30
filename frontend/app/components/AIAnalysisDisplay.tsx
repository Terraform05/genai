import React from "react";

const AiAnalysisDisplay = ({ analysisResponse }: { analysisResponse: string }) => {
  if (!analysisResponse) return null; // Don't render if no response

  // Remove `---` and replace with a newline
  let cleanedText = analysisResponse.replace(/---/g, "\n\n");

  // Split into paragraphs based on single newlines (avoid extra newlines)
  const sections = cleanedText.split("\n").filter((section) => section.trim() !== "");

  return (
    <section className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 space-y-2">
      <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
        AI Analysis Report
      </h2>

      {/* Iterate through each section */}
      {sections.map((section, index) => {
        // Convert bold text (e.g., **text**) using a regex
        const formattedText = section.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

        // Convert bullet points (- item) into proper lists
        if (section.startsWith("- ")) {
          const bulletPoints = section.split("\n").map((item) => item.replace("- ", ""));
          return (
            <ul
              key={index}
              className="list-disc list-inside text-gray-600 dark:text-gray-400"
            >
              {bulletPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          );
        }

        // Render normal paragraphs with HTML support (dangerouslySetInnerHTML is safe for static AI text)
        return (
          <p
            key={index}
            className="text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
        );
      })}
    </section>
  );
};

export default AiAnalysisDisplay;
