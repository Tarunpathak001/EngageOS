import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { campaignsApi } from "@/api/campaigns";
import { CampaignForm } from "@/components/campaigns/CampaignForm";
import { CampaignTable } from "@/components/campaigns/CampaignTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/utils";

export function Campaigns() {
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState("");
  const [aiResult, setAiResult] = useState<{
    name: string;
    message: string;
  } | null>(null);

  const campaignsQuery = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => (await campaignsApi.getAll()).data,
  });

  const createMutation = useMutation({
    mutationFn: campaignsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setCreateOpen(false);
      toast({
        title: "Campaign created",
        variant: "success",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to create campaign",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  const aiGenerateMutation = useMutation({
    mutationFn: () => campaignsApi.aiGenerate({ goal: aiGoal }),
    onSuccess: (res) => setAiResult(res.data),
    onError: (err) => {
      toast({
        title: "AI generation failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (id: number) => campaignsApi.send(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({
        title: "Campaign sent",
        description: `Sent to ${res.data.audienceSize} customers.`,
        variant: "success",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to send",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => campaignsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      toast({ title: "Campaign deleted", variant: "success" });
    },
    onError: (err) => {
      toast({
        title: "Failed to delete",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  const handleUseAiResult = () => {
    if (!aiResult) return;
    createMutation.mutate({
      name: aiResult.name,
      message: aiResult.message,
      channel: "EMAIL",
    });
    setAiOpen(false);
    setAiResult(null);
    setAiGoal("");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Campaigns"
        description="Create, manage, and track your marketing campaigns"
        action={
          <div className="flex gap-2">
            <Dialog open={aiOpen} onOpenChange={setAiOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Sparkles className="h-4 w-4" />
                  AI Generate
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>AI Campaign Generator</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Campaign Goal</Label>
                    <Textarea
                      placeholder="e.g. Weekend sale for high-spending Mumbai customers"
                      value={aiGoal}
                      onChange={(e) => setAiGoal(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={() => aiGenerateMutation.mutate()}
                    disabled={aiGenerateMutation.isPending || !aiGoal.trim()}
                  >
                    {aiGenerateMutation.isPending ? "Generating..." : "Generate"}
                  </Button>
                  {aiResult && (
                    <div className="space-y-3 rounded-lg border p-4">
                      <p className="font-semibold">{aiResult.name}</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {aiResult.message}
                      </p>
                      <Button onClick={handleUseAiResult} size="sm">
                        Use as Draft Campaign
                      </Button>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Campaign</DialogTitle>
                </DialogHeader>
                <CampaignForm
                  onSubmit={(data) =>
                    createMutation.mutate({
                      ...data,
                      scheduledAt: data.scheduledAt || undefined,
                    })
                  }
                  isLoading={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      {campaignsQuery.isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner label="Loading campaigns..." />
        </div>
      ) : campaignsQuery.error ? (
        <ErrorAlert message={getErrorMessage(campaignsQuery.error)} />
      ) : !campaignsQuery.data?.length ? (
        <EmptyState
          icon={Megaphone}
          title="No campaigns yet"
          description="Create your first campaign to start reaching customers."
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Create Campaign
            </Button>
          }
        />
      ) : (
        <CampaignTable
          campaigns={campaignsQuery.data}
          onSend={(id) => sendMutation.mutate(id)}
          onDelete={(id) => deleteMutation.mutate(id)}
          sendingId={sendMutation.isPending ? sendMutation.variables : null}
          deletingId={deleteMutation.isPending ? deleteMutation.variables : null}
        />
      )}
    </div>
  );
}