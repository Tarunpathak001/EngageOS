import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { agentsApi } from "@/api/agents";
import { AgentWorkflow } from "@/components/ai/AgentWorkflow";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";
import type { AgentExecuteResponse } from "@/types";

type WorkflowStep =
  | "idle"
  | "parsing"
  | "audience"
  | "campaign"
  | "sending"
  | "complete";

export function AICampaignStudio() {
  const [goal, setGoal] = useState("");
  const [currentStep, setCurrentStep] = useState<WorkflowStep>("idle");
  const [result, setResult] = useState<AgentExecuteResponse | null>(null);

  const executeMutation = useMutation({
    mutationFn: () => agentsApi.execute({ goal }),
    onMutate: () => {
      setResult(null);
      setCurrentStep("parsing");
      const steps: WorkflowStep[] = [
        "parsing",
        "audience",
        "campaign",
        "sending",
      ];
      steps.forEach((step, i) => {
        setTimeout(() => setCurrentStep(step), (i + 1) * 1500);
      });
    },
    onSuccess: (res) => {
      setCurrentStep("complete");
      setResult(res.data);
      toast({
        title: "Campaign executed",
        description: res.data.message,
        variant: "success",
      });
    },
    onError: (err) => {
      setCurrentStep("idle");
      toast({
        title: "Agent failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Campaign Studio"
        description="Describe your marketing goal and let the AI agent handle everything"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marketing Goal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder='e.g. "Send a weekend discount offer to all VIP customers living in Delhi"'
            rows={4}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button
            onClick={() => executeMutation.mutate()}
            disabled={executeMutation.isPending || !goal.trim()}
          >
            {executeMutation.isPending ? "Running AI Agent..." : "Execute AI Agent"}
          </Button>
        </CardContent>
      </Card>

      {executeMutation.error && (
        <ErrorAlert message={getErrorMessage(executeMutation.error)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Workflow Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentWorkflow currentStep={currentStep} result={result} />
        </CardContent>
      </Card>
    </div>
  );
}