import { useMemo, useState } from "react";
import axios from "axios";
import { Bot, Loader2, SendHorizonal, Sparkles, UserRound } from "lucide-react";
import aiVisual from "../assets/learnwith ai.jpg";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const starters = [
  "Explain recursion in simple terms",
  "Help me understand object oriented programming",
  "Give me study tips for finals",
  "Summarize database normalization",
];

export default function AiChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! Ask me about study topics, coding concepts, exam prep, or learning strategies.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canSend = useMemo(
    () => !isLoading && question.trim().length > 0,
    [isLoading, question]
  );

  const sendQuestion = async (nextQuestion) => {
    const prompt = nextQuestion.trim();
    if (!prompt) return;

    setError("");
    setIsLoading(true);
    setMessages((current) => [...current, { role: "user", content: prompt }]);
    setQuestion("");

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/ai`, {
        question: prompt,
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer || "I could not generate an answer.",
        },
      ]);
    } catch (err) {
      const message =
        err.response?.data?.error ||
        "The AI service could not answer right now. Please try again.";
      setError(message);
      setMessages((current) => [
        ...current,
        { role: "assistant", content: message },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendQuestion(question);
  };

  return (
    <section className="min-h-[70vh] p-4 sm:p-6">
      <div className="mx-auto grid max-w-6xl gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative h-[260px] overflow-hidden sm:h-[320px]">
            <img src={aiVisual} alt="Learn with AI" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/35 via-blue-950/20 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-50">Learn with AI</p>
              <h1 className="mt-2 max-w-md text-3xl font-extrabold leading-tight">
                Ask study questions and get instant explanations
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/95">
                Use the assistant for course concepts, programming topics, revision help, and quick explanations.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100 p-6">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-500">
              Quick Starters
            </p>
            <div className="flex flex-wrap gap-3">
              {starters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => sendQuestion(starter)}
                  className="help-chip-btn"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-[620px] flex-col rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">AI Chat</h2>
              <p className="text-sm text-slate-500">Connected to your backend `/api/ai` route</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-violet-700">
              <Sparkles size={14} />
              Live
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[88%] rounded-3xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-800"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest opacity-80">
                    {message.role === "user" ? <UserRound size={14} /> : <Bot size={14} />}
                    {message.role === "user" ? "You" : "AI"}
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
                  <Loader2 size={18} className="animate-spin" />
                  Generating response...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-slate-100 p-4 sm:p-6">
            {error && (
              <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about your studies..."
                className="min-h-[92px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="help-btn help-btn-primary min-w-[150px]"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <SendHorizonal size={18} />}
                {isLoading ? "Sending..." : "Ask AI"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
