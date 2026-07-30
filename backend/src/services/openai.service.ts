import OpenAI from "openai";
import { toFile } from "openai/uploads";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-5";

// Basic text prompt
export async function basicPrompt(prompt: string): Promise<string> {
  console.log("[OpenAI] Starting text request...");
  console.time("OpenAI");

  try {
    const response = await client.responses.create({
      model: MODEL,
      input: prompt,
    });

    console.timeEnd("OpenAI");

    console.log("[OpenAI] Request completed", {
      model: response.model,
      promptLength: prompt.length,
      outputLength: response.output_text.length,
      usage: response.usage,
    });

    return response.output_text;
  } catch (error) {
    console.timeEnd("OpenAI");
    console.error("[OpenAI] Request failed", error);
    throw error;
  }
}

// Analyse an uploaded PDF
export async function analysePDF(
  fileId: string,
  prompt: string
): Promise<string> {
  console.log("[OpenAI] Analysing PDF...");
  console.time("PDF Analysis");

  try {
    const response = await client.responses.create({
      model: MODEL,
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_file",
              file_id: fileId,
            },
            {
              type: "input_text",
              text: prompt,
            },
          ],
        },
      ],
    });

    console.timeEnd("PDF Analysis");

    console.log("[OpenAI] Analysis complete", {
      model: response.model,
      outputLength: response.output_text.length,
      usage: response.usage,
    });

    return response.output_text;
  } catch (error) {
    console.timeEnd("PDF Analysis");
    console.error("[OpenAI] Analysis failed", error);
    throw error;
  }
}

// Upload a PDF
export async function uploadPDF(pdf: Buffer): Promise<string> {
  console.log("[OpenAI] Uploading PDF...");
  console.time("PDF Upload");

  try {
    const file = await client.files.create({
      file: await toFile(pdf, "financial-report.pdf", {
        type: "application/pdf",
      }),
      purpose: "user_data",
    });

    console.timeEnd("PDF Upload");

    console.log("[OpenAI] Upload complete", {
      id: file.id,
      filename: file.filename,
      bytes: file.bytes,
    });

    return file.id;
  } catch (error) {
    console.timeEnd("PDF Upload");
    console.error("[OpenAI] Upload failed", error);
    throw error;
  }
}