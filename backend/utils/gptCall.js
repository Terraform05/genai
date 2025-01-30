import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// Initialize OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API key is loaded from environment variables
});

export async function gptCall(prompt) {
  try {
    // Validate prompt
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Invalid prompt: Must be a non-empty string.");
    }

    // Define the model configuration
    const params = {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini", // Default to 'gpt-4o-mini'
      messages: [
        {
          role: "system",
          content:
            "You are an assistant specialized in financial analysis, evaluating corporate financial filings and providing detailed insights on bear and bull signals for both stock equity and credit.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000, // Adjust as needed
      temperature: 0.2,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    // Send request to OpenAI API
    const chatCompletion = await client.chat.completions.create(params);

    // Validate response and extract text
    if (
      chatCompletion &&
      chatCompletion.choices &&
      chatCompletion.choices.length > 0 &&
      chatCompletion.choices[0].message &&
      typeof chatCompletion.choices[0].message.content === "string"
    ) {
      return chatCompletion.choices[0].message.content.trim();
    } else {
      console.error("Invalid response structure from OpenAI:", chatCompletion);
      return "Error: Received invalid response from OpenAI.";
    }
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error("API Error:", {
        status: error.status,
        message: error.message,
        code: error.code,
        type: error.type,
      });
      return `GPT API error: ${error.message}`;
    } else {
      console.error("Unexpected Error:", error);
      return "An unexpected error occurred. Please try again.";
    }
  }
}
