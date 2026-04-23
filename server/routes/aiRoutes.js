import express from "express";

const router = express.Router();

const HF_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_FALLBACK_MODEL_URL =
  "https://api-inference.huggingface.co/models/google/flan-t5-base";

const fallbackKnowledge = {
  java:
    "Java is a high-level, object-oriented programming language used to build web apps, Android apps, desktop software, and backend systems. It is popular because it is portable, meaning Java code can run on many platforms using the Java Virtual Machine (JVM).",
  array:
    "An array is a data structure that stores multiple values in a single variable, usually in an ordered list. Each item is accessed by its index, which starts at 0 in many programming languages.",
  recursion:
    "Recursion is a programming technique where a function calls itself to solve smaller versions of the same problem. It usually needs a base case to stop the repeated calls.",
  "object oriented programming":
    "Object-oriented programming is a way of designing software using objects that contain data and behavior. Core ideas include classes, objects, inheritance, encapsulation, abstraction, and polymorphism.",
  normalization:
    "Database normalization is the process of organizing database tables to reduce redundancy and improve data integrity. It usually involves splitting data into related tables and defining proper relationships.",
  database:
    "A database is an organized collection of data that can be stored, managed, and retrieved efficiently. Database systems help applications handle large amounts of structured information.",
};

const normalizeQuestion = (question) =>
  question.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

const buildFallbackAnswer = (question) => {
  const normalized = normalizeQuestion(question);

  for (const [topic, answer] of Object.entries(fallbackKnowledge)) {
    if (normalized.includes(topic)) {
      return answer;
    }
  }

  if (normalized.startsWith("what is ")) {
    const topic = question.replace(/^what is\s+/i, "").replace(/\?+$/, "").trim();
    if (topic) {
      return `${topic} is a topic you asked about. I could not reach the external AI service right now, but a good way to study it is to learn its definition, understand its main purpose, review one or two examples, and compare it with related concepts. If you want, ask a more specific question about ${topic} and I can help break it down.`;
    }
  }

  if (normalized.includes("study tip") || normalized.includes("exam")) {
    return "For exam preparation, break the syllabus into small topics, study in short focused sessions, practice past papers, explain concepts in your own words, and revise weak areas first. Active recall and timed practice usually help more than rereading notes.";
  }

  return "I could not reach the AI provider right now, but I can still help with study support. Try asking a focused question like 'What is Java?', 'Explain recursion', or 'Give me exam study tips.'";
};

const tryParseJson = async (response) => {
  const rawBody = await response.text();

  try {
    return { data: JSON.parse(rawBody), rawBody };
  } catch {
    return { data: null, rawBody };
  }
};

router.post("/", async (req, res) => {
  const { question } = req.body;

  if (!question || !String(question).trim()) {
    return res.status(400).json({ error: "Question is required." });
  }

  const apiToken =
    process.env.HUGGINGFACE_API_TOKEN || process.env.HF_API_KEY || "";

  if (!apiToken) {
    return res.status(500).json({ error: "Missing Hugging Face API token." });
  }

  try {
    const systemPrompt =
      "You are a concise educational assistant for university students. Give accurate, simple, direct explanations. Keep answers short and helpful.";

    const chatResponse = await fetch(HF_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "Qwen/Qwen2.5-7B-Instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question.trim() },
        ],
        max_tokens: 220,
        temperature: 0.4,
      }),
    });

    const { data: chatData } = await tryParseJson(chatResponse);

    if (
      chatResponse.ok &&
      chatData?.choices?.[0]?.message?.content
    ) {
      return res.json({ answer: chatData.choices[0].message.content.trim() });
    }

    const fallbackModelResponse = await fetch(HF_FALLBACK_MODEL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `Answer this student question clearly and simply: ${question.trim()}`,
        parameters: {
          max_new_tokens: 180,
          temperature: 0.4,
          return_full_text: false,
        },
      }),
    });

    const { data: fallbackModelData } = await tryParseJson(fallbackModelResponse);

    if (
      fallbackModelResponse.ok &&
      Array.isArray(fallbackModelData) &&
      fallbackModelData[0]?.generated_text
    ) {
      return res.json({ answer: fallbackModelData[0].generated_text.trim() });
    }

    return res.json({ answer: buildFallbackAnswer(question) });
  } catch (err) {
    return res.json({ answer: buildFallbackAnswer(question) });
  }
});

export default router;
