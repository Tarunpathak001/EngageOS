import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { CommunicationLog, LogStatus } from "@/types";

interface CampaignLogsProps {
  logs: CommunicationLog[];
}

function statusVariant(status: LogStatus) {
  switch (status) {
    case "DELIVERED":
      return "secondary" as const;
    case "OPENED":
      return "success" as const;
    case "CLICKED":
      return "default" as const;
    case "FAILED":
      return "destructive" as const;
    default:
      return "warning" as const;
  }
}

export function CampaignLogs({ logs }: CampaignLogsProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-medium">
                {log.customer?.name ?? `Customer #${log.customerId}`}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {log.customer?.email ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(log.status)}>{log.status}</Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(log.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}