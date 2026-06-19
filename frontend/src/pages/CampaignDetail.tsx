import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { campaignsApi } from "@/api/campaigns";
import { CampaignLogs } from "@/components/campaigns/CampaignLogs";
import { CampaignStats } from "@/components/campaigns/CampaignStats";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { formatDate, getErrorMessage } from "@/lib/utils";

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const campaignId = Number(id);

  const campaignQuery = useQuery({
    queryKey: ["campaigns", campaignId],
    queryFn: async () => (await campaignsApi.getById(campaignId)).data,
    enabled: !!id,
  });

  const statsQuery = useQuery({
    queryKey: ["campaigns", campaignId, "stats"],
    queryFn: async () => (await campaignsApi.getStats(campaignId)).data,
    enabled: !!id,
  });

  const logsQuery = useQuery({
    queryKey: ["campaigns", campaignId, "logs"],
    queryFn: async () => (await campaignsApi.getLogs(campaignId)).data,
    enabled: !!id,
  });

  const sendMutation = useMutation({
    mutationFn: () => campaignsApi.send(campaignId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] });
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

  if (campaignQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner label="Loading campaign..." />
      </div>
    );
  }

  if (campaignQuery.error || !campaignQuery.data) {
    return (
      <ErrorAlert
        message={getErrorMessage(campaignQuery.error) || "Campaign not found"}
      />
    );
  }

  const campaign = campaignQuery.data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold">{campaign.name}</h1>
              <Badge variant="secondary">{campaign.status}</Badge>
              {campaign.channel === "EMAIL" && (
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                  Email
                </Badge>
              )}
              {campaign.channel === "SMS" && (
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5" title="SMS provider integration planned. Currently available for architecture demonstration.">
                  SMS (Mock)
                </Badge>
              )}
              {campaign.channel === "WHATSAPP" && (
                <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5" title="Official WhatsApp Cloud API integration planned. Currently available for architecture demonstration.">
                  WhatsApp (Mock)
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(campaign.createdAt)}
            </p>
          </div>
        </div>
        <Button
          onClick={() => sendMutation.mutate()}
          disabled={sendMutation.isPending}
        >
          <Send className="h-4 w-4" />
          {sendMutation.isPending ? "Sending..." : "Send Campaign"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {campaign.message}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="logs">Delivery Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-6">
          {statsQuery.isLoading ? (
            <LoadingSpinner label="Loading stats..." />
          ) : statsQuery.error ? (
            <ErrorAlert message={getErrorMessage(statsQuery.error)} />
          ) : statsQuery.data ? (
            <CampaignStats stats={statsQuery.data} />
          ) : null}
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          {logsQuery.isLoading ? (
            <LoadingSpinner label="Loading logs..." />
          ) : logsQuery.error ? (
            <ErrorAlert message={getErrorMessage(logsQuery.error)} />
          ) : !logsQuery.data?.length ? (
            <p className="text-sm text-muted-foreground">
              No delivery logs yet. Send the campaign to generate logs.
            </p>
          ) : (
            <CampaignLogs logs={logsQuery.data} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}