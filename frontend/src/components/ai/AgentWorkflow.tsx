import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AgentExecuteResponse } from "@/types";

type WorkflowStep = "idle" | "parsing" | "audience" | "campaign" | "sending" | "complete";

interface AgentWorkflowProps {
  currentStep: WorkflowStep;
  result?: AgentExecuteResponse | null;
}

const steps = [
  { id: "parsing", label: "Parse Goal", icon: Sparkles },
  { id: "audience", label: "Match Audience", icon: Users },
  { id: "campaign", label: "Generate Campaign", icon: Target },
  { id: "sending", label: "Send Campaign", icon: ArrowRight },
] as const;

function stepIndex(step: WorkflowStep) {
  const order: WorkflowStep[] = [
    "idle",
    "parsing",
    "audience",
    "campaign",
    "sending",
    "complete",
  ];
  return order.indexOf(step);
}

export function AgentWorkflow({ currentStep, result }: AgentWorkflowProps) {
  const activeIndex = stepIndex(currentStep);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isComplete = activeIndex > stepNum || currentStep === "complete";
          const isActive =
            activeIndex === stepNum &&
            currentStep !== "idle" &&
            currentStep !== "complete";
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isComplete && "border-emerald-500 bg-emerald-50 text-emerald-600",
                    isActive && "border-primary bg-primary/10 text-primary",
                    !isComplete && !isActive && "border-border text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : isActive ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <p
                  className={cn(
                    "text-xs font-medium",
                    (isComplete || isActive) && "text-foreground",
                    !isComplete && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1",
                    isComplete ? "bg-emerald-500" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      {result && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Audience Matched
              </p>
              <p className="mt-1 text-2xl font-semibold">
                {result.matchedCustomers}
              </p>
              {result.audience && (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {result.audience.city && <p>City: {result.audience.city}</p>}
                  {result.audience.segment && (
                    <p>Segment: {result.audience.segment}</p>
                  )}
                  {result.audience.minSpend && (
                    <p>Min Spend: ₹{result.audience.minSpend}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Campaign
              </p>
              <p className="mt-1 font-semibold">{result.campaign.name}</p>
              <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">
                {result.campaign.message}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Recommendation
              </p>
              <p className="mt-1 font-semibold">
                {result.recommendation.bestChannel}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {result.recommendation.reason}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === "idle" && !result && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
          <Circle className="mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Enter a marketing goal to start the AI workflow
          </p>
        </div>
      )}
    </div>
  );
}