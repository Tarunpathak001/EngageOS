import { Bot, Send, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { CampaignRecommendation } from "@/types";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendation?: CampaignRecommendation;
}

interface AnalyticsChatProps {
  onAsk: (question: string) => Promise<CampaignRecommendation>;
  isLoading: boolean;
}

const suggestions = [
  "Which campaigns performed best?",
  "What channel should I use next?",
  "How can I improve open rates?",
  "Who should I target this week?",
];

export function AnalyticsChat({ onAsk, isLoading }: AnalyticsChatProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async (q?: string) => {
    const text = (q ?? question).trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");

    try {
      const recommendation = await onAsk(text);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          recommendation.reason ??
          "No recommendation available.",
        recommendation,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I couldn't analyze your data. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(s)}
            disabled={isLoading}
          >
            {s}
          </Button>
        ))}
      </div>

      <Card className="flex flex-1 flex-col overflow-hidden">
        <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <Bot className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium">Ask anything about your campaigns</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Get AI-powered insights on performance, channels, and audiences
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 text-sm ${msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                    }`}
                >
                  <p>{msg.content}</p>
                  {msg.recommendation && (
                    <div className="mt-3 space-y-2 border-t border-border/50 pt-3 text-xs">
                      <p>
                        <span className="font-medium">Channel:</span>{" "}
                        {msg.recommendation.bestChannel}
                      </p>
                      <p>
                        <span className="font-medium">Audience:</span>{" "}
                        {msg.recommendation.recommendedAudience}
                      </p>
                      <p>
                        <span className="font-medium">Expected Open Rate:</span>{" "}
                        {msg.recommendation.expectedOpenRate}
                      </p>
                    </div>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 animate-pulse text-primary" />
              </div>
              <div className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
                Analyzing your data...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Textarea
          placeholder="Ask about campaign performance, audiences, or strategy..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          rows={2}
          className="resize-none"
        />
        <Button
          onClick={() => handleSubmit()}
          disabled={isLoading || !question.trim()}
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}