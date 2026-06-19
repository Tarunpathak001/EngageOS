import { Eye, Send, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatPercent } from "@/lib/utils";
import type { CampaignListItem } from "@/types";

interface CampaignTableProps {
  campaigns: CampaignListItem[];
  onSend: (id: number) => void;
  onDelete: (id: number) => void;
  sendingId?: number | null;
  deletingId?: number | null;
}

function statusVariant(status: string) {
  switch (status) {
    case "SENT":
      return "success" as const;
    case "SCHEDULED":
      return "warning" as const;
    default:
      return "secondary" as const;
  }
}

export function CampaignTable({
  campaigns,
  onSend,
  onDelete,
  sendingId,
  deletingId,
}: CampaignTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Delivered</TableHead>
            <TableHead>Open Rate</TableHead>
            <TableHead>CTR</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Badge variant={statusVariant(campaign.status)}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{campaign.delivered}</TableCell>
              <TableCell className="tabular-nums">
                {formatPercent(campaign.openRate)}
              </TableCell>
              <TableCell className="tabular-nums">
                {formatPercent(campaign.ctr)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(campaign.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" asChild>
                    <Link to={`/campaigns/${campaign.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onSend(campaign.id)}
                    disabled={sendingId === campaign.id}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(campaign.id)}
                    disabled={deletingId === campaign.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}