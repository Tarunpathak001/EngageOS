import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { customersApi } from "@/api/customers";
import { ErrorAlert } from "@/components/common/ErrorAlert";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, getErrorMessage } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: customer, isLoading, error } = useQuery({
    queryKey: ["customers", id],
    queryFn: async () => (await customersApi.getById(Number(id))).data,
    enabled: !!id,
  });

  const connectMutation = useMutation({
    mutationFn: () => customersApi.connectTelegram(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", id] });
      toast({
        title: "Telegram invitation sent successfully.",
        variant: "success",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to send Telegram invitation",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: () => customersApi.disconnectTelegram(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", id] });
      toast({
        title: "Telegram account disconnected",
        variant: "success",
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to disconnect Telegram",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner label="Loading customer..." />
      </div>
    );
  }

  if (error || !customer) {
    return <ErrorAlert message={getErrorMessage(error) || "Customer not found"} />;
  }

  // Calculate if invitation is currently active and pending connection
  const isInvitePending =
    !customer.telegramConnected &&
    customer.telegramInviteToken &&
    customer.telegramInviteExpiresAt &&
    new Date() < new Date(customer.telegramInviteExpiresAt);

  const inviteSentAt = customer.telegramInviteExpiresAt
    ? new Date(new Date(customer.telegramInviteExpiresAt).getTime() - 24 * 60 * 60 * 1000).toISOString()
    : null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/customers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">{customer.name}</h1>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "City", value: customer.city ?? "—" },
          { label: "Phone", value: customer.phone ?? "—" },
          { label: "Total Spend", value: formatCurrency(customer.totalSpend) },
          { label: "Joined", value: formatDate(customer.createdAt) },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                {item.label}
              </p>
              <p className="mt-1 font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="h-4 w-4 text-blue-500" />
            Telegram Onboarding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 border-b border-border pb-4 text-sm sm:grid-cols-5">
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Telegram Status</p>
              <div className="mt-1">
                {customer.telegramConnected ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
                    🟢 Connected
                  </Badge>
                ) : isInvitePending ? (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
                    🔴 Invitation Pending
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-zinc-500/30 text-zinc-500 dark:text-zinc-400 bg-zinc-500/5">
                    ⚪ Not Invited
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Invitation Sent</p>
              <p className="mt-1 font-semibold text-muted-foreground">
                {inviteSentAt ? formatDate(inviteSentAt) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Invitation Expiry</p>
              <p className="mt-1 font-semibold text-muted-foreground">
                {customer.telegramInviteExpiresAt ? formatDate(customer.telegramInviteExpiresAt) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Connected On</p>
              <p className="mt-1 font-semibold text-muted-foreground">
                {customer.telegramConnected && customer.telegramConnectedAt ? formatDate(customer.telegramConnectedAt) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-medium">Telegram Username</p>
              <p className="mt-1 font-semibold font-mono text-muted-foreground">
                {customer.telegramConnected && customer.telegramUsername ? `@${customer.telegramUsername}` : "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {!customer.telegramConnected ? (
              <Button onClick={() => connectMutation.mutate()} disabled={connectMutation.isPending}>
                {connectMutation.isPending
                  ? "Sending..."
                  : isInvitePending
                  ? "Send Invitation Again"
                  : "Send Telegram Invitation"}
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => connectMutation.mutate()} disabled={connectMutation.isPending}>
                  Send Invitation Again (Reconnect)
                </Button>
                <Button variant="destructive" onClick={() => disconnectMutation.mutate()} disabled={disconnectMutation.isPending}>
                  {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect Telegram"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {!customer.orders?.length ? (
            <p className="text-sm text-muted-foreground">No orders yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{formatCurrency(order.amount)}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Communication History</CardTitle>
        </CardHeader>
        <CardContent>
          {!customer.communicationLogs?.length ? (
            <p className="text-sm text-muted-foreground">No communications yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.communicationLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {log.campaign?.name ?? `Campaign #${log.campaignId}`}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.status}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(log.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}