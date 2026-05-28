import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What is TASSA about?",
  "How do I register my school?",
  "When is the next exam?",
  "How do I view results?",
];

export function TassaAI() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm TASSA AI 👋 — ask me anything about our exams, results, registration, schools or the Hall of Excellence.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("tassa-ai-chat", {
        body: { messages: next.map((m) => ({ role: m.role, content: m.content })) },
      });
      if (error) throw error;
      const reply = (data as { reply?: string })?.reply ?? "Sorry, I couldn't answer that.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm having trouble reaching the AI service. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ask TASSA AI"
        className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full px-4 py-3 shadow-xl",
          "bg-[image:var(--gradient-hero)] text-primary-foreground border border-primary-foreground/10",
          "hover:scale-105 active:scale-95 transition-transform"
        )}
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-warning/40 animate-ping" />
          <Sparkles className="relative h-4 w-4 text-warning" />
        </span>
        <span className="text-sm font-semibold">Ask TASSA AI</span>
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="TASSA AI chat"
          className="fixed bottom-20 right-4 left-4 sm:left-auto sm:w-[380px] z-50 rounded-2xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-fade-in"
          style={{ maxHeight: "min(70vh, 560px)" }}
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 bg-[image:var(--gradient-hero)] text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/15">
                <Bot className="h-4 w-4" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">TASSA AI</p>
                <p className="text-[11px] opacity-70">Your study & org assistant</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-full p-1 hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-background">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed",
                  m.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground rounded-br-sm"
                    : "mr-auto bg-secondary text-secondary-foreground rounded-bl-sm"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto inline-flex items-center gap-2 rounded-2xl bg-secondary px-3 py-2 text-sm text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </div>
            )}
            {messages.length <= 1 && !loading && (
              <div className="pt-2 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs rounded-full border border-border bg-card px-3 py-1.5 hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border p-2 bg-card"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about TASSA…"
              disabled={loading}
              className="h-9"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="h-9 w-9 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

export default TassaAI;